---
title: "Installing Waybeam on the camera"
description: "Step-by-step guide to installing Waybeam on a SigmaStar (Infinity6E / Infinity6C) or HiSilicon Hi3516CV610 camera and integrating it with WFB-ng instead of Majestic."
---

# Installing Waybeam on the camera

This guide describes how to install **Waybeam** on a SigmaStar (Infinity6E / Infinity6C) or HiSilicon (Hi3516CV610) camera and configure it to work with **WFB-ng** instead of Majestic.

::: info What is Waybeam?
**Waybeam** is a standalone H.265 (HEVC) video encoder that fully replaces Majestic. It provides lower latency, a full HTTP API for real-time tuning, and native WFB-ng integration via a Unix socket. The binary, config (`/etc/waybeam.json`) and init script are named `waybeam`.

This guide is verified against version **v0.73.3** (late August 2026).
:::

::: warning Upgrading from a version older than v0.73? Read this first
- **`video0.maxIBytes` / `video0.maxPBytes` were removed** in v0.72.0 — measurement showed they never imposed the ceiling they named. A config still carrying them loads fine (unknown keys are ignored), but `/api/v1/set` or `/api/v1/live/set` naming them fails the **whole request** with `404 unknown config field`. Strip them from saved profiles.
- **`outgoing.shmThrottle` was removed** in v0.69.0 — same rule: the config tolerates it, the API does not.
- **`isp.aeEngine: "custom"` was removed** in v0.47.0 — only `"sdk"` is accepted.
- **The `video0.qpDelta` default changed from `0` to `-12`** (Star6E, Maruko) to bound the cost of an IDR.
:::

---

### Requirements

| Component | Details |
| :--- | :--- |
| **Camera (VTX)** | Star6E (SSC30KQ / SSC338Q, Infinity6E), Maruko (SSC378QE, Infinity6C) or CV610 (Hi3516CV610) with OpenIPC firmware |
| **Sensor** | IMX335, IMX415, GC4653 (SigmaStar) or IMX662 (CV610) |
| **Firmware** | OpenIPC (Lite or FPV) |
| **Access** | SSH to the camera (`root` / `12345`) |
| **Network** | Ethernet or WiFi for file transfer |

---

### Step 1: Connect to the camera via SSH

Connect to the camera over SSH. The camera's IP address is usually `192.168.1.10` or can be found via the router.

::: code-group

```powershell [Windows (PowerShell)]
ssh root@192.168.1.10
# password: 12345
```

```bash [macOS / Linux]
ssh root@192.168.1.10
# password: 12345
```

:::

::: tip GUI client for Windows
Instead of the command line you can use [PuTTY](https://www.putty.org/): "Host Name" — the camera IP, port `22`, type `SSH`, login `root`, password `12345`.
:::

---

### Step 2: Stop Majestic

Before installing Waybeam you must stop and disable Majestic:

```bash
# Stop Majestic
killall majestic 2>/dev/null

# Disable Majestic autostart
# (if it starts via an init script)
if [ -f /etc/init.d/S95majestic ]; then
    chmod -x /etc/init.d/S95majestic
fi
```

::: warning Important
Majestic and Waybeam cannot run at the same time — they both use the chip's ISP and video encoder.
:::

---

### Step 3: Download Waybeam

Releases ship as tarballs that contain the `waybeam` binary, a `waybeam.json` config template, and (for Maruko) the required SigmaStar libraries. Pick the tarball for your chip.

::: code-group

```bash [Star6E · SSC30KQ / SSC338Q]
cd /tmp
curl -L -o waybeam-star6e.tar.gz \
  https://github.com/OpenIPC/waybeam/releases/latest/download/waybeam-star6e.tar.gz
tar xzf waybeam-star6e.tar.gz

# Install the binary
cp waybeam /usr/bin/waybeam
chmod +x /usr/bin/waybeam
```

```bash [Maruko · SSC378QE]
cd /tmp
curl -L -o waybeam-maruko.tar.gz \
  https://github.com/OpenIPC/waybeam/releases/latest/download/waybeam-maruko.tar.gz
tar xzf waybeam-maruko.tar.gz

cp waybeam /usr/bin/waybeam
chmod +x /usr/bin/waybeam
```

```bash [CV610 · Hi3516CV610]
cd /tmp
curl -L -o waybeam-cv610.tar.gz \
  https://github.com/OpenIPC/waybeam/releases/latest/download/waybeam-cv610.tar.gz
tar xzf waybeam-cv610.tar.gz

cp waybeam /usr/bin/waybeam
chmod +x /usr/bin/waybeam
```

:::

::: warning Maruko needs libraries
Stock OpenIPC firmware for Infinity6C does **not** ship SigmaStar (MI) vendor libraries. The libraries from the tarball must be copied to `/usr/lib/`, and sensor `.ko` modules and ISP `.bin` files may also be required. See the [repository README](https://github.com/OpenIPC/waybeam#maruko-infinity6c) for details and provisioning scripts.
:::

::: warning CV610 installs differently <Badge type="tip" text="v0.65+" />
The **CV610** backend (HiSilicon Hi3516CV610 + Sony IMX662) arrived in v0.65.0 and has its own install flow. Besides the binary, the tarball carries:

- `sensors/` — the IMX662 sensor plugin (built from source, not a proprietary blob)
- `S95waybeam` — a device-verified init script: it loads the MPP modules and **refuses to unload them while the graph still has an owner**
- `waybeam-cv610.conf` — the sensor clock profile for the platform loader
- `waybeam.json` — the CV610 default config (`1280x720@100`, 2600 kbps, output straight to `frame-shm://venc_wfb`)

Audio on CV610 is enabled **only through JSON plus the platform config**, never over HTTP: a daemon respawn cannot safely load the opt-in kernel modules.

Do not use `S95waybeam reload` — that action was **removed in v0.65.10**, together with the module rollback on a failed start: both paths unloaded MPP modules under a live consumer and could wedge the SoC. The correct post-crash recovery is a plain `restart`.
:::

::: tip Alternative — SCP from a self-built binary
If you build Waybeam yourself (`make build SOC_BUILD=star6e`):
```bash
scp out/star6e/waybeam root@192.168.1.10:/usr/bin/waybeam
```
:::

---

### Step 4: Create the configuration

Create the configuration file `/etc/waybeam.json` (the tarball includes a ready-made `waybeam.json` template you can just copy to `/etc/`):

```bash
cat > /etc/waybeam.json << 'EOF'
{
  "system": { "webPort": 80, "overclockLevel": 1, "verbose": false },
  "sensor": { "index": -1, "mode": -1 },
  "isp": {
    "sensorBin": "",
    "aeEngine": "sdk",
    "aeFps": 15,
    "awbFps": 15,
    "gainMax": 0,
    "gainMin": 0,
    "shutterMaxUs": 0,
    "shutterMinUs": 0,
    "shutterRule180": false,
    "awbMode": "auto",
    "awbCt": 5500,
    "keepAspect": true
  },
  "image": { "mirror": false, "flip": false, "rotate": 0 },
  "video0": {
    "rcMode": "cbr",
    "fps": 60,
    "size": "1920x1080",
    "bitrate": 8192,
    "gopSize": 1.0,
    "qpDelta": -12,
    "minQp": 0,
    "maxQp": 0,
    "sceneThreshold": 0,
    "sceneHoldoff": 2,
    "sliceCount": 1,
    "resilience": "off",
    "intraRefreshQp": 0,
    "framing": "off",
    "zoomX": 0.5,
    "zoomY": 0.5
  },
  "outgoing": {
    "enabled": true,
    "server": "unix://wfb_tx",
    "streamMode": "rtp",
    "maxPayloadSize": 1400,
    "connectedUdp": true,
    "audioPort": 0,
    "sidecarPort": 0
  },
  "discovery": {
    "enabled": true,
    "serviceType": "_waybeam-venc._tcp",
    "name": "",
    "bareAlias": true
  },
  "fpv": { "roiEnabled": true, "roiQp": 0, "roiSteps": 2, "roiCenter": 0.4, "noiseLevel": 0 },
  "audio": {
    "enabled": false,
    "sampleRate": 48000,
    "channels": 1,
    "codec": "opus",
    "volume": 80,
    "mute": false
  },
  "imu": {
    "enabled": false,
    "i2cDevice": "/dev/i2c-1",
    "i2cAddr": "0x68",
    "sampleRateHz": 200,
    "gyroRangeDps": 1000,
    "calFile": "/etc/imu.cal",
    "calSamples": 400
  },
  "attitude": {
    "enabled": false,
    "mountDeg": 0,
    "invertRoll": false,
    "invertPitch": false
  },
  "record": {
    "enabled": false,
    "mode": "mirror",
    "dir": "/mnt/mmcblk0p1",
    "format": "ts",
    "maxSeconds": 300,
    "maxMB": 500,
    "bitrate": 0,
    "fps": 0,
    "gopSize": 0,
    "server": ""
  },
  "snapshot": { "enabled": true, "quality": 80, "channel": 7, "width": 0, "height": 0 },
  "detect": {
    "enabled": false,
    "plugin": "",
    "modelPath": "",
    "firmwarePath": "",
    "inferInterval": 1,
    "osd": false,
    "confThresh": 0.20,
    "nmsIou": 0.0,
    "netWidth": 640,
    "netHeight": 352,
    "modelId": 0
  },
  "qr": { "tapEnabled": false, "tapWidth": 0, "tapHeight": 0, "windowMs": 0 },
  "debug": { "showOsd": false }
}
EOF
```

::: info All fields are optional
Any omitted field uses its compiled-in default. The default `video0.size` is `"auto"` (the sensor's native resolution).
:::

::: tip The codec is always H.265
There is no `video0.codec` field anymore — Waybeam encodes only H.265 (HEVC). Old configs containing `"codec": "h264"` or `"h265"` load without errors, but the key is ignored.
:::

::: details For versions before v0.19 — the `video0.frameLost` field
Older versions had an SDK frame-drop strategy in the `video0` section:

```json
"video0": {
  "...": "...",
  "frameLost": true
}
```

In **v0.19** this strategy was removed entirely — the `frameLost` field no longer exists in the config or the API; a **1000 kbps** bitrate floor applies instead. If the key is still in your old config, delete that line.
:::

---

### Step 5: Key configuration parameters

<strong>Video (`video0`)</strong>

| Parameter | Description | Typical values |
| :--- | :--- | :--- |
| `rcMode` | Rate-control mode | `"cbr"`, `"vbr"`, `"avbr"`, `"fixqp"` |
| `fps` | Frame rate (max depends on the sensor mode) | `30`, `60`, `90`, `100`, up to `144` |
| `size` | Resolution | `"auto"`, `"1920x1080"`, `"1280x720"` |
| `bitrate` | Bitrate (kbps), 1000 minimum | `4096` — `16384` |
| `gopSize` | GOP size in seconds (only effective when `resilience: "off"`) | `0.5` — `4.0` |
| `qpDelta` | I-frame QP offset relative to P. **Default `-12`** (Star6E, Maruko); not offered on CV610 | `-12` — `12` |
| `minQp` / `maxQp` | **live** rate-control QP bounds. `0` = driver default | `0`, or `20`—`45` |
| `sliceCount` | H.265 slices per picture (restart). `1` = today's behaviour | `1` — `32` |
| `resilience` | Loss-resilience preset (requires a **reboot**) | `"off"`, `"racing"`, `"ltr"`, `"fpv"`, … |
| `intraRefreshQp` | QP of the intra-refresh stripe — **CV610 only** | `0` (auto) — `51` |
| `framing` | Stabilization / digital zoom (SigmaStar) | `"off"`, `"stab"`, `"zoom-2x"`, … |

::: tip New in v0.41–v0.73 <Badge type="tip" text="current" />
- **`video0.minQp` / `maxQp`** — live QP bounds. Star6E got them in v0.64, CV610 in v0.65.6, and **Maruko in v0.73.0**. On Star6E a `minQp > maxQp` request is now rejected instead of silently written.
- **`video0.sliceCount`** — multi-slice H.265: the picture is split into N independent slices, so RF loss past the FEC budget costs a **frozen region** instead of the whole frame. Star6E since v0.66.0, CV610 and Maruko since v0.67.0. The request range is 1..32; device geometry sets the delivered ceiling (720p on Maruko quantizes to 12).
- **`video0.resilience = "ltr"` / `"ltr:<N>"`** (v0.64.0) — half of all frames non-referenced while preserving *your* `gopSize`, so half of all frame losses cost exactly one frame. Smaller `N` is more resilient (`ltr` = `ltr:1`). Measured bitrate cost: under 1%. The preset is **not OSD-safe**.
- An unknown `resilience` value now returns **409** instead of being accepted silently while the derived fields still hold the previous preset's expansion.
:::

::: info More on framing, resilience and attitude
The stabilization/zoom modes (`framing`), resilience presets and the IMU-driven artificial horizon (the `attitude` section, v0.39+) are documented in detail in [Web panel and HTTP API](/en/software/waybeam-venc-web-interface).
:::

::: details For versions v0.45–v0.71 — the `video0.maxIBytes` / `maxPBytes` fields
**v0.45.0** added live per-frame I- and P-frame size caps (`u32MaxISize` / `u32MaxPSize` in the MI_VENC RC params), and v0.49.0 surfaced them in the dashboard. **v0.72.0 removed them entirely** — measurement on an SSC338Q (720p60, H.265 CBR, GDR) showed they do not impose the ceiling they name: across `maxPBytes` 33144 → 6000 bytes the delivered rate moved under 0.3%, and at the 6000 B step an access-unit census found **all 863 units over the cap** (mean 40247 B).

A config still carrying the old keys loads fine (unknown keys are ignored, and they disappear on the next config write), but `GET /api/v1/set` **or** `GET /api/v1/live/set` naming them fails the **whole request** with `404 unknown config field`. Strip them from any saved ground-side profile.

**What to use instead:** for I-frame size, `video0.qpDelta` — a 68× range on the same rig, and it does not keyframe. For P-frame size there is no direct replacement; `video0.minQp` is the surviving lever.
:::

::: details For versions before v0.47 — `isp.aeEngine: "custom"`
`isp.aeEngine` on Star6E used to accept `"sdk"` and `"custom"`. **v0.47.0 removed `"custom"`**: the `cus3a` thread never did AE convergence — the ISP firmware/bin AE always drove it. Only `"sdk"` is accepted now; an old config carrying `"custom"` loads with a warning and silently falls back to `sdk`. The supervisory thread stayed on as a limits enforcer for `isp.gainMin/Max` + `isp.shutterMinUs/MaxUs`.
:::

<strong>Streaming (`outgoing`)</strong>

| Parameter | Description | Examples |
| :--- | :--- | :--- |
| `enabled` | Enable streaming | `true` / `false` |
| `server` | Receiver address | `"unix://wfb_tx"`, `"udp://192.168.1.1:5600"`, `"shm://venc_ring"`, `"frame-shm://venc_wfb"` |
| `streamMode` | Stream mode | `"rtp"` or `"compact"` |
| `maxPayloadSize` | Max RTP packet size | `1400` (default) |
| `connectedUdp` | Connected UDP socket (`connect()`) | `true` (default); `false` — unconnected, used in the apfpv WiFi mode |
| `audioPort` | Audio channel | `0` — together with video; `>0` — separate UDP port; `<0` — audio to the recording only, never on air |

::: tip The `frame-shm://` transport <Badge type="tip" text="v0.42+" />
This transport carries **whole encoded frames** over POSIX shared memory, bypassing RTP packetization entirely: the consumer (waybeam-link) applies its own framing and FEC at frame boundaries. The ring is SPSC lock-free, 8 slots × 384 KiB, and every frame carries metadata: the **GDR** / **ENHANCE** / **SALVAGED** flags plus its position in the intra-refresh cycle (`gdr_pos` / `gdr_len`) — so the transport can apply stronger FEC exactly where the refresh cycle completes.

This is the **default output on CV610**. `apply_server` (live retargeting) does not work for SHM outputs — switching `outgoing.server` to frame-shm needs a restart.

⚠️ In **v0.69.0** the ring header went to **version 2** (offset 88 changed meaning: it carried `throttle_permille`, now `low_water_slots` — and the polarity is inverted, lower is healthier). A v2 producer **will not serve a v1 consumer**: waybeam-link, waybeam-hub and radeon-vrx must be rebuilt alongside the camera.
:::

::: details For versions v0.57–v0.68 — the `outgoing.shmThrottle` field
**v0.57.0** added an AIMD controller that clamped the encoder bitrate by SHM ring fill, plus the `outgoing.shmThrottle` field (on by default). **v0.69.0 removed it along with the mechanism itself**: on a `frame-shm://` craft the rate controller (waybeam-link) is co-located, already reads the same ring, and already owns `video0.bitrate` — the clamp was a second controller on the same signal, and its only actuator keyframes.

Measured on 24 August on a Star6E at 720p120: clamp on, 6.5 IDR/s and 100–143 ms glass-to-glass; clamp off, 0.2 IDR/s and 15–37 ms.

The same release removed the **ring-full recovery IDR**: the request fired precisely when the largest frame in the stream could not be delivered anyway (13 IDRs in 12 s, none of which reached anyone). `throttlePermille` and `effectiveBitrateKbps` are gone from `/api/v1/transport/status`; `ringLowWaterSlots`, `otherDrops` and `badAuDrops` replaced them.

A config with the old key loads fine, but a `POST /api/v1/set` naming it rejects the **whole batch**.
:::

<strong>Network discovery (`discovery`)</strong>

The camera announces itself via mDNS — you can open it as `http://waybeam.local` without hunting for the IP:

| Parameter | Description | Default |
| :--- | :--- | :--- |
| `enabled` | mDNS announcement on the LAN | `true` |
| `serviceType` | Service type | `"_waybeam-venc._tcp"` |
| `name` | Custom name; empty — `waybeam-<suffix>`, where the suffix is the tail of the chip's die ID | `""` |
| `bareAlias` | Also announce the short `waybeam.local` name (conflicts between cameras are resolved per RFC 6762) | `true` |

The full 12-hex serial (die ID) is readable from `GET /api/v1/config` → `data.device.serial`.

<strong>Exposure and gain (`isp`)</strong>

The supervisory thread enforces these limits on top of the stock firmware AE. All four are **live**; `0` means "use the ISP bin's calibrated limit".

| Parameter | Description | Since |
| :--- | :--- | :--- |
| `gainMax` | Sensor gain ceiling | long-standing |
| `shutterMaxUs` | Exposure ceiling (µs). Set above the frame period, it makes the sensor skip frames — a soft way to lower effective fps without the ~0.5 s bind-rebind stall | v0.44.0 |
| `gainMin` | Gain **floor** | v0.46.0 |
| `shutterMinUs` | Exposure **floor** (µs) | v0.46.0 |
| `shutterRule180` | 180° shutter rule: exposure pinned to exactly 1/(2×fps) — 8333 µs at 60 fps. The shutter dimension is locked while gain still auto-adjusts for brightness. **restart** | v0.41.0 |

Each floor is clamped so it can never exceed its ceiling, and `shutterRule180` (which pins `min == max`) takes precedence over a manual `shutterMinUs`.

<strong>Object detection (`detect`)</strong> <Badge type="tip" text="v0.48+ · Star6E, Maruko" />

The detector runs on the idle IPU/NPU and is **not shipped with waybeam** — the model, the decode and the class table all live in a `.so` plugin you install separately. A new model is a config change, not a waybeam rebuild.

| Parameter | Description |
| :--- | :--- |
| `enabled` | Enable the detector (**live** since v0.53) |
| `plugin` | Path to the `.so` plugin |
| `modelPath` | Path to the `.img` model (**live** — hot swap without dropping the stream, v0.52) |
| `firmwarePath` | NPU firmware |
| `inferInterval` | Run inference once every N frames |
| `osd` | Draw boxes on the debug OSD (needs `debug.showOsd`) |
| `confThresh` | Confidence threshold. `<=0` — plugin default. ~`0.20` is recommended: INT8 quantization costs ~30% of the FP32 score on small objects, and the ground tracker rejects noise with its 2-hit confirmation |
| `nmsIou` | NMS IoU threshold. `<=0` — plugin default |
| `netWidth` / `netHeight` | Tap geometry for the model — both multiples of 32, and they must match the compiled `.img` (**restart**) |
| `modelId` | Class-table selector on the sidecar DETECT trailer. Without it a one-class SAR-person model announced itself as VisDrone-10 and every box came out labelled "pedestrian" |

::: warning `detect` and `framing=stab` are mutually exclusive
Both claim the same tap (VPE port1 on Star6E, SCL port3 on Maruko), so they cannot run together. There is no detection on CV610 at all.
:::

<strong>QR scanning (`qr`)</strong> <Badge type="tip" text="v0.60+ · Star6E" />

| Parameter | Description |
| :--- | :--- |
| `tapEnabled` | Enable the **overlay-free** luma tap (so the OSD does not corrupt the marker) |
| `tapWidth` / `tapHeight` | Tap resolution; `0` — follow the snapshot resolution |
| `windowMs` | Default scan-window length (**live**: the next scan picks up the new value) |

::: danger Waybeam decodes the marker but does nothing with it
Pairing, commands and action dispatch are **not implemented** and are deliberately kept outside the waybeam binary. The camera hands you 16 characters through `/api/v1/qr/status` and stops: it **does not interpret, authorize, persist or execute** that payload. What those characters mean is decided by your own layer on top of the API.
:::

<strong>Marker format</strong>

Only a locked envelope is accepted — deliberately, to avoid global finder scans across the frame:

```text
PXXXXXXXXXXXXXXX
```

- QR **Version 1** (21 × 21 modules), error correction **Q**, alphanumeric mode
- exactly **16** characters from the alphabet `0-9 A-Z` and `` $%*+-./:``
- the first character is the type: **`P`** (reserved for pairing/passphrase) or **`C`** (for commands/settings)
- the remaining 15 characters are **opaque** to the decoder

An **outer frame** is mandatory too — a standards-compliant but unframed QR is deliberately ignored:

```text
33 × 33 marker units total
2-module continuous black outer frame
4-module white quiet zone inside the frame
21 × 21 Version-1 QR at marker coordinate (6, 6)
```

The connected border supplies four stable projective corners that the decoder maps straight into the QR grid — which is why the production decoder **never** runs unbounded finder-pattern discovery.

<strong>Generate a marker</strong>

```bash
python3 -m pip install -r tools/qr/requirements-generator.txt
python3 tools/qr/generate_qr.py P23456789ABCDEFG waybeam-pair.svg
python3 tools/qr/generate_qr.py CRES1080P60A0030 command.png --scale 30
```

`--scale` is the integer number of pixels per marker unit for raster output.

::: tip How many pixels per module you need
The lab minimum is roughly **3 px/module**, and **4 px/module** is the realistic camera target. That budget is spent against the MJPEG channel's resolution (`snapshot.width` / `snapshot.height`), so **size the channel up** when markers must decode from further away. JPEG q80 luma decodes reliably.

Measured on the bench (768 generated 1280×720 symbols: four marker widths, compression down to 0.35, three rotations, four perspective directions, four defocus levels): the outer frame was identified in **100%** of cases and the payload decoded in **92.3%** — against **65.9%** for stock quirc without the frame. The same counts were reproduced natively on the SSC338Q bench.
:::

<strong>Check it by hand</strong>

```bash
# Straight from the camera, without opening a scan window
curl -s http://127.0.0.1/api/v1/snapshot.jpg | qr_decode

# Diagnostics: which passes fired and how long each took
qr_decode --stats capture.jpg

# Polling with no action dispatch — just prints valid envelopes
qr_watch.sh -c -v
```

This needs `snapshot.enabled: true`. `qr_watch.sh` reports HTTP `503` when snapshots are disabled.

<strong>FPV ROI encoding (`fpv`)</strong>

| Parameter | Description | Values |
| :--- | :--- | :--- |
| `roiEnabled` | Frame-center priority | `true` — center in higher quality |
| `roiQp` | ROI QP delta (`-30`…`30`) | `-18` — maximum center quality |
| `roiSteps` | Number of bands | `1` — `4` |
| `roiCenter` | Center band size | `0.1` — `0.9` |

---

### Step 6: Run Waybeam

<strong>Manual run (for testing)</strong>

```bash
# Run with logs printed to the console
waybeam
```

The web panel will be available at `http://<camera-ip>/` or simply `http://waybeam.local` — the camera announces itself via mDNS (the `discovery` section, enabled by default).

<strong>Check operation</strong>

```bash
# Check the version
curl http://localhost/api/v1/version

# Check the configuration
curl http://localhost/api/v1/config

# Check which parameters can be changed in real time
curl http://localhost/api/v1/capabilities
```

---

### Step 7: Autostart Waybeam

Create an init script to start Waybeam automatically when the camera boots:

```bash
cat > /etc/init.d/S96waybeam << 'INITEOF'
#!/bin/sh

case "$1" in
  start)
    echo "Starting waybeam..."
    # Make sure Majestic is not running
    killall majestic 2>/dev/null
    # Start waybeam in the background
    start-stop-daemon -S -b -x /usr/bin/waybeam -- 2>&1 | tee /tmp/waybeam.log &
    ;;
  stop)
    echo "Stopping waybeam..."
    killall waybeam 2>/dev/null
    ;;
  restart)
    $0 stop
    sleep 1
    $0 start
    ;;
  *)
    echo "Usage: $0 {start|stop|restart}"
    exit 1
    ;;
esac

exit 0
INITEOF

chmod +x /etc/init.d/S96waybeam
```

::: tip Startup order
The script is numbered `S96`, meaning it starts after most system services, but you need to make sure the WiFi drivers and WFB-ng are already loaded by then (especially for `unix://wfb_tx`, where `wfb_tx` must be listening on the socket first).
:::

::: info audioPort and sidecarPort
In the config above `audioPort: 0` and `sidecarPort: 0`. This means:

- `audioPort: 0` — audio is sent together with video over the same channel (optimal for WFB-ng)
- `audioPort < 0` (e.g. `-1`) — record-only mode: audio goes to the SD recording but is never transmitted on air
- `sidecarPort: 0` — the diagnostics sidecar channel is disabled (no overhead)

The default template has `audioPort: 5601` and `sidecarPort: 5602` — if you need separate audio or per-frame telemetry over UDP, set the corresponding values.
:::

---

### Step 8: Change parameters in real time

After starting Waybeam you can change parameters without restarting:

```bash
# Change the bitrate (live)
curl "http://localhost/api/v1/set?video0.bitrate=4096"

# Change the resolution (requires reinit)
curl "http://localhost/api/v1/set?video0.size=1280x720"

# Change FPS (live)
curl "http://localhost/api/v1/set?video0.fps=90"

# Enable ROI for FPV (live)
curl "http://localhost/api/v1/set?fpv.roiEnabled=true"
curl "http://localhost/api/v1/set?fpv.roiQp=-18"

# Request an IDR keyframe (useful after connecting)
curl http://localhost/request/idr
```

::: tip `/api/v1/live/set` — change without writing to flash <Badge type="tip" text="v0.50+" />
The ordinary `/api/v1/set` **persists** the value to `/etc/waybeam.json`. For a high-cadence automated writer (waybeam-link's adaptive bitrate) that is bad twice over: it wears the flash, and the camera reboots into the last adaptive transient.

`/api/v1/live/set` has exactly the same field surface and byte-identical responses, but writes to the **running config only**:

```bash
curl "http://localhost/api/v1/live/set?video0.bitrate=4096"
```

Live fields only. A restart-class field answers `400` ("restart-class field requires persistence; use /api/v1/set") — because a pipeline reinit reloads from disk and would silently discard the value. A later persisting `/set` or `/defaults` snapshots the whole running config, volatile changes included. Older builds without the endpoint answer 404 — clients probe once and fall back to `/set`.
:::

---

### Common problems

::: details Waybeam won't start — library error
Make sure all SigmaStar libraries are available in `/usr/lib`. On Maruko they must be installed from the tarball manually. If you use a staged build, set the variable:

```bash
export LD_LIBRARY_PATH=/path/to/lib
```
:::

::: details No video after start
1. Check that `outgoing.enabled` is set to `true`
2. Check that the `outgoing.server` address is correct
3. Check that Majestic is fully stopped: `ps | grep majestic`
4. Check the logs: `cat /tmp/waybeam.log`
:::

::: details Black screen or artifacts
Check sensor compatibility:

```bash
# Current sensor and available modes
curl http://localhost/api/v1/modes
```

Make sure `sensor.index` and `sensor.mode` are set to `-1` (auto-detect).

**Upgrading from an older version?** The sensor mode lineups were rebuilt several times: v0.21/v0.23 (Maruko), **v0.25–v0.34** (Star6E, in-tree IMX335/IMX415 drivers). The **`sensor.mode` indices were renumbered** and some modes were hidden — a persisted index outside the new range keeps waybeam from starting (mode-select error at boot). Check your old config against the `/api/v1/modes` list or set it back to `-1`.
:::

::: details The sensor never answers on i2c (`MI_SNR_Enable` = `0xA01B201F`)
This is not your config — it was an IMX335 driver defect, fixed in **v0.60.1 (Maruko)** and **v0.60.2 (Star6E)**.

`pCus_poweron()` never produced a clean reset edge: on Maruko it did not touch PWDN/RESET at all (the toggle lived in `pCus_HardwareReset()`, which nothing called), and on Star6E the first PWDN/RESET pair used the release polarity, making the sequence "release → configure CSI → release again". On boards that hold the sensor in reset until the driver releases it, **every mode's init table NAK'd**.

Both drivers now run the canonical SDK pulse: assert PWDN+RESET through CSI config → release PWDN → 31 ms rail settle → release RESET → start MCLK. Just upgrade to v0.60.2 or newer (contributed by @tipoman9, verified on SSC378QE + IMX335).
:::

::: details CV610: the camera is dead after a daemon crash, or the audio went silent
On CV610 MPP objects are kernel state, so they survive a process crash. A few rules established by measurement in v0.65.7–v0.65.10:

- **Never unload MPP modules under a live consumer.** That is why the `S95waybeam reload` action and the module rollback on a failed start were both removed. The correct recovery is `restart`.
- The `MMB LEAK` lines in the log are **the kernel reclaiming**, not losing.
- A `SIGKILL` leaves behind ISP state rather than VB, and additionally leaks two `aenc` blocks — which is why audio silently failed to come back after a crash. Since v0.65.9 `cv610_audio_start()` cycles the audio module first, so sound recovers on its own.
- The waybeam-hub RGN OSD **does not survive a venc restart** — it has to be re-established.
:::

::: details H.264 codec doesn't work
Waybeam encodes **only H.265 (HEVC)** on both chips. There is no `video0.codec` field; H.264 is not supported. Make sure your receiver (PixelPilot, ffplay, QGroundControl, GStreamer) is configured for H.265.
:::

---

### Next steps

- [**WFB-ng integration**](/en/software/waybeam-venc-install-groundstation) — configuring Waybeam + WFB-ng on the camera and ground station
- [**Web panel and HTTP API**](/en/software/waybeam-venc-web-interface) — detailed description of all API endpoints
- [**NPU object detection**](/en/software/waybeam-detection) — everything about the `detect` section
- [**On-board QR scanning**](/en/software/waybeam-qr) — everything about the `qr` section
- [**Waybeam overview**](/en/software/waybeam-venc) — the full feature list
