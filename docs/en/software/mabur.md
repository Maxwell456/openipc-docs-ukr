---
title: "Mabur — an RTP-free video link built on the Waybeam encoder core"
description: "Overview of Mabur, an experimental FPV video link for the SSC338Q: the Waybeam encoder, UEP FEC and RTL8812EU injection in one maburd process, a maburgs/maburplay ground station on Radxa ZERO 3 or Orange Pi Zero 2W, and a browser GS over WebUSB."
---

# Mabur — an RTP-free video link built on the Waybeam encoder core

**Mabur** is an experimental digital FPV video link for **SigmaStar SSC338Q** (Infinity6E) cameras. It takes the [Waybeam](/en/software/waybeam-venc) encoder core and builds it into a single daemon, `maburd`. That one process encodes the video, protects it with FEC, injects the frames itself through an RTL8812EU USB card, and takes adaptive-link commands from the ground station. There is no RTP, no WFB-ng and no separate HTTP encoder in the chain.

::: info Repository
[https://github.com/gilankpam/mabur](https://github.com/gilankpam/mabur), by **gilankpam**.

This page was checked against `master` as of **October 28, 2026**. There are no releases and no prebuilt binaries; everything is built from source.
:::

::: warning Experimental project
Mabur is developed by one person for their own bench: "one drone, one GS, one operator, both ends always on the latest build". There is **deliberately** no compatibility between versions: the on-air formats, config keys and control protocol change without a transition period. At the time of writing the repository also has no license file. This is a tool for enthusiasts prepared to build their own firmware, not a replacement for stock OpenIPC FPV.
:::

---

### How Mabur relates to Waybeam

In the classic setup [Waybeam](/en/software/waybeam-venc) encodes H.265 and emits RTP, and [WFB-ng](/en/software/wfb-ng), as a separate process, packs that stream, adds FEC and sends it through a kernel driver. The adaptive link (`alink`) is yet another process that steers the encoder over HTTP.

Mabur puts all of that in one process. On August 29, 2026 the Waybeam encoder core (a snapshot of commit `f956a52`) was moved into `drone/venc/`. Since then `maburd` calls the SigmaStar MI layer directly, and the link's commands (bitrate, ROI QP, IDR request) are plain function calls instead of HTTP requests to a second daemon. A camera running Mabur does **not** run a separate Waybeam, and an existing one has to be removed before installing.

The sensor driver comes from Waybeam too: the Mabur image loads `sensor_imx415_star6e.ko` from the Waybeam tree instead of the stock `sensor_imx415_mipi.ko`. Only that driver offers the 1728×972@100 and 1728×816@120 modes.

| | Waybeam + WFB-ng | Mabur |
| :--- | :--- | :--- |
| **Processes on the drone** | `waybeam` + `wfb_tx` + alink | a single `maburd` |
| **Video transport** | RTP → WFB-ng | whole frames, no RTP |
| **Radio driver** | kernel module (`88XXau`, `8812eu`) | `devourer`, a userspace driver over libusb |
| **FEC** | block Reed-Solomon | sliding-window FEC, separate per SVC-T layer (UEP) |
| **Link adaptation** | separate alink over HTTP | MCS ladder on the GS, in-process commands |
| **Camera chips** | Star6E, Maruko, CV610 | SSC338Q (Star6E) + IMX415 only |
| **Ground station** | anything with WFB-ng, PixelPilot | `maburgs` + `maburplay`, or a browser |
| **Status** | stable releases | built from source, no cross-version compatibility |

---

### Components

| Component | Runs on | What it does |
| :--- | :--- | :--- |
| **`maburd`** | drone, armv7, OpenIPC | H.265/SVC-T encoder, UEP FEC, injection via `devourer`, link commands, MSP OSD, SD recording |
| **`maburgs`** | GS, aarch64 | multi-card receive, FEC decode, MCS ladder, channel selection, publishes whole frames to a shared-memory ring |
| **`maburplay`** | GS | hardware decode (MPP on Rockchip, Cedrus on Allwinner) straight to DRM/KMS, OSD, fMP4 DVR |
| **Web GS** | browser | the same receive and control core compiled to WebAssembly, with the card over WebUSB |
| **`mabur-relay`** | TP-Link CPE510 | a remote receive card on a panel antenna, frames go to the GS over Ethernet |
| **`maburcal`** | GS | calibrates the drone's TX power in about 75 seconds |

---

### Key features

**Unequal error protection (UEP).** The encoder produces H.265 with temporal layers (SVC-T): a base layer every frame depends on, and a droppable enhancement layer. Each layer gets its own FEC overhead (`overhead_base` ≥ `overhead_enh`). Under loss the enhancement layer suffers first: motion gets less smooth, but the picture does not break up.

**Software NACK.** When FEC could not recover a base-layer symbol, the GS asks the drone to resend exactly that symbol while the frame is still waiting to be assembled. This removes truncated frames in the moments before the MCS ladder has stepped down.

**Slice salvage.** Each frame is encoded as row slices (`venc.slices = 4`). If a frame arrives incomplete, the GS does not drop the whole thing: missing slices are filled with skip slices and the rest of the picture is shown. On a GS with streamed decode each slice goes to the decoder as soon as it arrives, without waiting for the end of the frame.

**MCS ladder on the GS.** The ground station measures real loss and drives the `(channel width, MCS)` operating point, probing before stepping up. The encoder bitrate is a pure function of the current rung: there is no `venc.bitrate` key.

**Automatic channel selection.** Both ends share a channel set (default `[40, 64, 112, 144]`, provisional). At startup the GS measures the set, moves the link to the cleanest channel and remembers it. If the channel gets jammed in flight, the GS moves the link within a fraction of a second. `channel = <number>` pins a channel with no hopping.

**HT40.** Ladder rungs can fly at 40 MHz on the standard 5 GHz channel pair.

**Authenticated control.** A shared 16-byte key (`/etc/mabur.key`) signs commands with a SipHash tag, and a recorded session cannot be replayed to the drone. Video and telemetry stay in the clear, so a passive spotter works with no key.

**Phase lock.** `maburplay` trims the drone's sensor frame rate to the GS display's vblank, so every frame arrives with the same margin before it is shown. Camera-to-screen latency becomes flat, with no sawtooth beat between the sensor rate and the panel rate.

**OSD.** MSP DisplayPort from the flight controller travels as its own FEC stream and is drawn on the GS over the video with the Betaflight font. Next to it is a separate GS link-status bar: channel, MCS, per-card RSSI/SNR, drone temperature, bitrate, latency, pre- and post-FEC loss. Both layers are burned into the DVR.

**Onboard SD recording.** `maburd` writes a constant-bitrate fragmented-MP4 copy to the drone's microSD, independent of what is on air. The GS record button drives this recorder too (`dvr.target = "gs" | "vtx" | "both"`). A power cut loses at most about 2 s.

**Disarmed mode.** When the flight controller reports DISARMED, the encoder drops to 1 Mb/s and 30 fps so the camera doesn't overheat on the bench. The shipped config has it off (`low_power.enable = false`).

---

### Hardware

**Drone**

- an **SSC338Q** SoC with a **Sony IMX415** sensor on OpenIPC firmware
- an **RTL8812EU** Wi-Fi card (the main option). The **RTL8812CU** is supported through a separate image (`ssc338q_fpv_emax-wyvern-link-alpha`), but the author has not verified it on their own hardware
- for OSD, a flight-controller UART with MSP DisplayPort (default `/dev/ttyS2`)

**Ground station**

- **Radxa ZERO 3** (RK3566): the main platform, supports everything including the DVR with burned-in OSD and 3D-LUT colour correction
- **Orange Pi Zero 2W** (H618): the Cedrus decoder via `v4l2request`. Raw DVR only, no burned-in OSD and no hardware record button
- one or more **RTL8812EU** cards; `maburgs` combines what every card receives at the FEC-symbol level
- optionally a **TP-Link CPE510** running [mabur-openwrt](https://github.com/gilankpam/mabur-openwrt) as a remote receive card. The Radxa ZERO 3 has no Ethernet, so it needs a USB adapter

**A browser instead of a GS.** The web version supports one RTL8812EU, RTL8812AU, RTL8812CU or TP-Link RTL8821AU card, or the CPE510 relay.

---

### Camera modes

`venc.fps` picks the sensor mode:

| `venc.fps` | IMX415 mode | Field of view |
| :--- | :--- | :--- |
| 1–90 | 1920×1080, 2×2 binned | full |
| 91–100 | 1728×972, binned + crop | 1.11× zoom |
| 101–120 | 1728×816, binned + crop | 1.11× wider, 1.32× taller zoom |
| any, with `record.size` above 1920×1080 | 3840×2160 | full, but `venc.fps` ≤ 30 |

Full view stops at 90 fps because of the sensor, not the encoder: the minimum line count for full height times the minimum line time comes to 90.4 fps. The default is `1920x1080` at **60 fps**.

::: warning The stock sensor driver lacks the 100 and 120 fps modes
If the image loads `sensor_imx415_mipi.ko`, `maburd` fails to start with `sensor mode WxH@F not offered by the driver`. Check the running mode with `grep Cur /proc/mi_modules/mi_sensor/mi_sensor0`.
:::

---

### Latency

The author's first instrumented session was on August 31, 2026. Typical camera-to-screen latency then was **≈ 75–85 ms**, with the worst frames going past 100 ms. The encoder itself took a flat 7 ms. Since then the project has added phase lock, streamed slice decode and shorter GS queues, aimed at exactly those tails. The repository has no newer end-to-end figure yet.

---

### Installation

There are no ready-made images or releases. The minimal path:

**1. Drone firmware.** The OpenIPC image is built from the [gilankpam/openipc-builder](https://github.com/gilankpam/openipc-builder) fork, branch `feat/mabur`. The `mabur` package installs the daemon as `/etc/init.d/S00mabur` so `maburd` starts first, and already includes the required IMX415 driver.

**2. Updating `maburd` from source.** Requires the OpenIPC Buildroot toolchain:

```sh
git clone --recursive https://github.com/gilankpam/mabur
cd mabur
bash tools/build-arm.sh                 # → out/arm/maburd
bash bundle/install.sh root@<camera-ip>
```

The script copies the binary to `/usr/bin/maburd`, seeds `/etc/mabur.toml` from the shipped config **only if there is none yet** (a tuned config is never overwritten), and restarts the service. The log is `/tmp/mabur.log`.

**3. Ground station.** The image is built from the [gilankpam/sbc-groundstations](https://github.com/gilankpam/sbc-groundstations) fork. `maburgs` and `maburplay` are built with `tools/build-arm64.sh` and installed with:

```sh
bash gs/bundle/install.sh root@<gs-ip>  # detects the board model itself
```

There is no installer for `maburplay`: on a fresh GS copy `maburplay.default.toml` to `/etc/maburplay.toml` by hand. On the Radxa that path is a symlink to `/config/maburplay.toml`; edit the file it points to.

**4. Pairing.** One key goes on both ends:

```sh
(echo "# mabur link key"; openssl rand -hex 16) > mabur.key
chmod 600 mabur.key
scp -O mabur.key root@<camera-ip>:/etc/mabur.key
scp -O mabur.key root@<gs-ip>:/etc/mabur.key
```

After restarting both daemons, compare the fingerprint in the logs: the `link: key <fp>` line must match on the drone, the GS and the web page. With no key file all three use the built-in default key and print `link: DEFAULT key in use`. The link works, but without protection.

**5. TX power calibration.** The shipped config flies at the card's stock power (`power_mode = "none"`). To measure the PA compression walls of your own card:

```sh
ssh root@<gs-ip>
maburcal start
```

In about 75 seconds the tool sweeps a power grid across every MCS, writes the result into the drone's `/etc/mabur.toml` (keeping the old one as `.pre-cal`) and switches to `power_mode = "offset"`. No restart needed.

---

### Drone configuration

`/etc/mabur.toml` is TOML. The shipped file sets **every** key, so on a stock config the startup line `config: N key(s) defaulted:` in the log is empty. If anything shows up there, you dropped a key while editing.

```toml
[radio]
channels   = [40, 64, 112, 144]  # the channel set, same as the GS (or a superset)
width      = 40                  # HT40; each rung's width comes from the GS ladder
power_mode = "none"              # "offset" after maburcal
ldpc       = true                # false only for an RTL8821AU ground card

[encoder]
bitrate_min_kbps = 1000
bitrate_max_kbps = 24000
airtime_budget   = 0.65          # share of the link's real capacity for video

[venc]
size   = "1920x1080"
fps    = 60                      # 1..120, see the camera-mode table
slices = 4                       # H.265 row slices for salvaging truncated frames
gop_s  = 0                       # no periodic IDR; the GS requests a key frame itself
```

::: danger An unknown key means an endless restart loop
A stale, removed or misspelled key stops the daemon from starting. The init script restarts it every 2 seconds forever, and the log is truncated on each restart. `/tmp/mabur.log` will hold a single `error: <file>:<line>: <key>: unknown key` line and nothing else. A `maburplay` config error does the opposite: the player stops for good, leaving a black screen with no retry.
:::

---

### The browser ground station

The easiest way to try Mabur is the page **[gilankpam.github.io/mabur](https://gilankpam.github.io/mabur/)** (there is also an `edge/` channel built from the latest PR). It is the `maburgs` core compiled to WebAssembly. The card connects over WebUSB, so you need Chrome or another Chromium-based browser. The page can be installed as an app and works offline after the first visit.

Two modes:

- **Spotter** (the default): receives and displays only, never transmits. Good for a second viewer next to the main GS. It finds which channel the link is on by itself and follows it through hops
- **GS**: a full ground station with the MCS ladder, NACK, channel selection and recording. It has to be switched on explicitly, so a stray tab never starts commanding someone else's drone

::: warning Only one GS per drone
The page cannot see another commander and does not try to. Don't use GS mode if `maburgs` or another tab is already flying the drone.
:::

::: tip RTL8812AU / RTL8821AU / RTL8812CU on Linux
The Linux kernel has its own drivers for these cards (`rtw88_8812au`, `rtw88_8821au`, `rtw88_8822cu`), and they grab the card mid-initialisation. Unload the module (`sudo modprobe -r rtw88_8812au`) or blacklist it. The kernel has no driver for the RTL8812EU, so it is not affected.
:::

---

### Common pitfalls

| Symptom | Cause | Fix |
| :--- | :--- | :--- |
| No video and no control | drone and GS on different protocol versions (`RC_VERSION`) | update **both** ends; a restart won't help |
| The daemon restarts every 2 s | unknown key in the config | read `/tmp/mabur.log` or `/tmp/maburgs.log`, fix the key |
| The link drops a few seconds after `ssh … start` | the init script dies with the ssh session | `setsid /etc/init.d/S00mabur start </dev/null >/dev/null 2>&1 &` |
| `scp` to the drone fails | dropbear has no sftp | `scp -O` |
| `sensor mode … not offered by the driver` | stock IMX415 driver | the Mabur image, or swap in `sensor_imx415_star6e.ko` by hand |
| `unsupported chip` at startup | binary built for the other card (EU ↔ CU) | the image for your card |
| `KEY?` on the OSD in place of the channel, `link KEY MISMATCH` in the GS log | different keys on the two ends | compare the `link: key <fp>` fingerprints |

---

### Who it's for

**Worth trying** if you have an SSC338Q with an IMX415 and an RTL8812EU, a Radxa ZERO 3 on the ground, and you're ready to build firmware from source and update the drone and GS together. In return you get a link designed end to end, from sensor to screen: no RTP, with UEP, NACK, slice salvage, automatic channel selection and phase lock.

**Better to stay** on [Waybeam](/en/software/waybeam-venc) + [WFB-ng](/en/software/wfb-ng) if you need stable releases, other chips (Maruko, CV610) or sensors, compatibility with PixelPilot and your existing ground setup, or simply firmware you can install by following instructions without a compiler.

---

### Links

- [gilankpam/mabur](https://github.com/gilankpam/mabur): the main repository; reference pages in `docs/`, dated investigations in `docs/findings/`
- [Web GS](https://gilankpam.github.io/mabur/): the browser ground station
- [gilankpam/devourer](https://github.com/gilankpam/devourer): the userspace Realtek driver
- [gilankpam/mabur-openwrt](https://github.com/gilankpam/mabur-openwrt): firmware for the CPE510 relay
- [OpenIPC/waybeam](https://github.com/OpenIPC/waybeam): the encoder the `drone/venc/` core comes from
