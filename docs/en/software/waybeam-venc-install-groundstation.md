---
title: "Integrating Waybeam with WFB-ng"
description: "How to configure Waybeam to work with WFB-ng instead of Majestic — a full guide for the camera and the ground station."
---

# Integrating Waybeam with WFB-ng

This guide describes how to fully replace **Majestic** with **Waybeam** alongside **WFB-ng** (WiFi Broadcast) for FPV streaming with minimal latency. The guide is verified against version **v0.40.1** (July 2026).

---

### System architecture

<FpvLinkDiagram />

---

### Part 1: Camera (VTX) setup

<strong>1.1 Prerequisites</strong>

Before you begin, make sure that:

- ✅ OpenIPC firmware is installed on the camera
- ✅ WFB-ng (`wfb_tx`) is installed and working
- ✅ A WiFi adapter (RTL8812EU or RTL8812AU) is connected
- ✅ You have SSH access to the camera

::: info Installing Waybeam
If Waybeam is not installed yet, see [Installing Waybeam on the camera](/en/software/waybeam-venc-install-camera).
:::

<strong>1.2 Stop Majestic</strong>

```bash
# Stop Majestic
killall majestic 2>/dev/null

# Disable autostart (if init.d is used)
chmod -x /etc/init.d/S95majestic 2>/dev/null
```

<strong>1.3 Configure Waybeam for WFB-ng</strong>

The main difference from Majestic is **how video is delivered to WFB-ng**.

<strong>Method 1: Unix socket (recommended)</strong>

The most efficient method is delivery over an abstract Unix socket. This reduces latency compared to UDP because the data does not traverse the kernel network stack.

Edit `/etc/waybeam.json`:

::: code-group
```json [/etc/waybeam.json]
{
  "outgoing": {
    "enabled": true,
    "server": "unix://wfb_tx",
    "streamMode": "rtp",
    "maxPayloadSize": 1400,
    "connectedUdp": true,
    "audioPort": 0,
    "sidecarPort": 0
  }
}
```
:::

::: tip Socket name
The `wfb_tx` name in `unix://wfb_tx` is the name of the abstract Unix socket. It must match the WFB-ng setting on the transmitter side. Check the WFB-ng configuration to ensure `wfb_tx` listens on this socket.
:::

<strong>Method 2: UDP on localhost</strong>

If WFB-ng expects an RTP stream over UDP:

```json
{
  "outgoing": {
    "enabled": true,
    "server": "udp://127.0.0.1:5600",
    "streamMode": "rtp",
    "maxPayloadSize": 1400,
    "connectedUdp": true,
    "audioPort": 0,
    "sidecarPort": 0
  }
}
```

::: tip The apfpv mode (WiFi without WFB-ng)
In the apfpv WiFi mode Waybeam boots with unconnected UDP output (`connectedUdp: false`) and clamps the RTP payload to 1400 bytes — less fragmentation on the WiFi link. For the WFB-ng setup keep `connectedUdp: true`.
:::

<strong>Method 3: Shared Memory (SHM)</strong>

For maximum performance — over a ring buffer in shared memory:

```json
{
  "outgoing": {
    "enabled": true,
    "server": "shm://venc_ring",
    "streamMode": "rtp",
    "maxPayloadSize": 1400,
    "connectedUdp": true,
    "audioPort": 0,
    "sidecarPort": 0
  }
}
```

::: warning SHM and audio
`shm://` works only in RTP mode and cannot carry audio over the main channel. If you need audio with `shm://`, set `audioPort > 0` (e.g. `5601`) and audio will go to a separate UDP port.
:::

---

<strong>1.4 WFB-ng setup on the camera</strong>

The WFB-ng configuration must match the delivery method you chose in Waybeam.

**For a Unix socket** — in the `wfb_tx` configuration specify the same abstract socket:

```
# In the wfb_tx configuration
# Input stream — from the Unix socket from waybeam
peer = listen://unix://wfb_tx
```

**For UDP on localhost:**

```
# In the wfb_tx configuration
# Input stream — UDP from waybeam
peer = listen://udp://127.0.0.1:5600
```

<strong>1.5 Optimal video parameters for WFB-ng</strong>

Recommended parameters for stable FPV streaming over WiFi Broadcast:

```json
{
  "video0": {
    "rcMode": "cbr",
    "fps": 60,
    "size": "1920x1080",
    "bitrate": 8192,
    "gopSize": 1.0,
    "qpDelta": -4,
    "resilience": "racing"
  }
}
```

**Parameter explanation:**

| Parameter | Recommendation | Why |
| :--- | :--- | :--- |
| `rcMode: "cbr"` | CBR | Stable bitrate — better for the radio link |
| `fps: 60` | 60 fps | Balance between smoothness and load |
| `bitrate: 8192` | 8 Mbps | Optimal for a 20 MHz WFB channel |
| `gopSize: 1.0` | 1 second | Fast recovery (only effective when `resilience: "off"`) |
| `resilience: "racing"` | Intra-refresh | Stripe recovery without waiting for an IDR (requires a reboot) |

::: details For versions before v0.19 — the `frameLost` field
Older versions additionally recommended `"frameLost": true` — an SDK strategy that allowed the encoder to drop frames under overload. In **v0.19** it was removed entirely: the field no longer exists, and a **1000 kbps** bitrate floor applies instead. If the key is still in your config, delete it.
:::

::: info The codec is always H.265
Waybeam encodes only H.265 (HEVC) — there is no `video0.codec` field. Make sure the receiver is configured for H.265.
:::

::: warning resilience requires a reboot
Changing `video0.resilience` via the API returns `{"reboot_required": true}` and only applies after the camera reboots. In the configuration file it takes effect immediately at start. Details are in [Web panel and HTTP API](/en/software/waybeam-venc-web-interface#resilience-packet-loss-resilience).
:::

::: warning Bitrate and channel width
Choose the bitrate according to the WFB-ng throughput:

| Channel width | MCS | Max bitrate | Recommended |
| :--- | :--- | :--- | :--- |
| 20 MHz | MCS 3 | ~20 Mbps | 8–12 Mbps |
| 20 MHz | MCS 1 | ~10 Mbps | 4–6 Mbps |
| 40 MHz | MCS 3 | ~40 Mbps | 16–22 Mbps |

Budget +20–30% bitrate when intra-refresh is enabled (`resilience` ≠ `off`).
:::

---

<strong>1.6 Service startup order</strong>

The correct startup order on the camera:

```bash
# 1. Load the WiFi driver
insmod /lib/modules/88XXau.ko 2>/dev/null

# 2. Start WFB-ng TX
wfb_tx -u unix://wfb_tx -p 0 -k 8 -n 12 wlan0 &

# 3. Start waybeam
waybeam &
```

::: tip Init script
For automatic startup, create an init script as described in [Installing on the camera — Step 7](/en/software/waybeam-venc-install-camera#step-7-autostart-waybeam). Make sure the script numbering order is correct: WiFi → WFB-ng → waybeam.
:::

---

### Part 2: Ground station (GS) setup

<strong>2.1 Ground station requirements</strong>

| Component | Options |
| :--- | :--- |
| **Platform** | Radxa Zero 3W, Raspberry Pi 4/5, x86 Linux |
| **WiFi adapter** | RTL8812EU (recommended) or RTL8812AU |
| **Player** | PixelPilot (Android), QGroundControl, ffplay |

<strong>2.2 WFB-ng RX setup</strong>

On the ground station, WFB-ng receives the stream and outputs it to a UDP port for the player:

```bash
# Start the WFB-ng receiver
wfb_rx -p 0 -c 127.0.0.1 -u 5600 -k 8 -n 12 wlan0
```

The parameters must match the TX settings on the camera:

| Parameter | TX (camera) | RX (ground) | Description |
| :--- | :--- | :--- | :--- |
| `-k` | `8` | `8` | FEC data blocks |
| `-n` | `12` | `12` | Total FEC blocks |
| `-p` | `0` | `0` | WFB port (channel) |

<strong>2.3 Viewing the video</strong>

<strong>PixelPilot (Android)</strong>

1. Connect the ground station to your phone
2. Open PixelPilot
3. Set the RTP source: `udp://0.0.0.0:5600`

<strong>ffplay (Linux / Mac)</strong>

```bash
ffplay -fflags nobuffer -flags low_delay -framedrop \
  -analyzeduration 0 -probesize 32 \
  -i udp://0.0.0.0:5600
```

<strong>QGroundControl</strong>

1. Open Settings → Video
2. Set "Video Source": `UDP h.265 Video Stream`
3. Port: `5600`

<strong>GStreamer</strong>

```bash
gst-launch-1.0 udpsrc port=5600 \
  caps="application/x-rtp,media=video,encoding-name=H265" ! \
  rtph265depay ! h265parse ! avdec_h265 ! autovideosink sync=false
```

---

### Part 3: Audio over WFB-ng

Waybeam supports audio transmission in parallel with video. Supported codecs: `opus`, `g711a`, `g711u`, `pcm`.

#### 3.1 Enable audio on the camera

Update `/etc/waybeam.json`:

```json
{
  "audio": {
    "enabled": true,
    "sampleRate": 16000,
    "channels": 1,
    "codec": "g711a",
    "volume": 80,
    "mute": false
  },
  "outgoing": {
    "audioPort": 5601
  }
}
```

::: info Audio and the Unix socket
With `unix://` and `audioPort: 0`, audio is sent together with video over the same channel. With `audioPort > 0`, audio is sent to a separate UDP port `127.0.0.1:<audioPort>`. A negative `audioPort` (e.g. `-1`) is record-only mode: audio goes to the SD recording but never on air. The `audio.*` fields (except `audio.mute`) are restart-required; `audio.mute` changes live.
:::

<strong>3.2 Receiving audio on the ground station</strong>

```bash
# Separate WFB channel for audio
wfb_rx -p 1 -c 127.0.0.1 -u 5601 -k 4 -n 8 wlan0

# Playback (G.711a)
ffplay -nodisp -fflags nobuffer -i udp://0.0.0.0:5601
```

::: tip Opus over GStreamer
For Opus (PT 98, 48 kHz) use `rtpjitterbuffer` before `rtpopusdepay`, otherwise out-of-order UDP packets cause clicks:

```bash
gst-launch-1.0 -v \
  udpsrc port=5601 caps="application/x-rtp,media=audio,clock-rate=48000,encoding-name=OPUS,payload=98,channels=1" \
  ! rtpjitterbuffer latency=40 ! rtpopusdepay ! opusdec plc=true \
  ! audioconvert ! audioresample ! autoaudiosink sync=false
```
:::

---

### Part 4: Adaptive control (advanced)

<strong>4.1 Scene-Change IDR</strong>

To improve stream recovery during sharp scene changes (takeoff, maneuvers):

```bash
# Enable scene detection (Star6E only)
curl "http://localhost/api/v1/set?video0.sceneThreshold=150"
curl "http://localhost/api/v1/set?video0.sceneHoldoff=2"
```

- `sceneThreshold: 150` — triggers on a ≈1.5x frame-size spike
- `sceneHoldoff: 2` — minimum interval between IDR frames

::: info Star6E only
Scene-change IDR is supported only on Star6E. On Maruko these fields are reported as unsupported in `/api/v1/capabilities`.
:::

<strong>4.2 Sidecar for an external controller</strong>

If you use an external link-quality controller (adaptive link):

```bash
curl "http://localhost/api/v1/set?outgoing.sidecarPort=6666"
```

The sidecar sends per-frame telemetry: encode/send timing, one-way latency, jitter, and — when scene detection is active — `frame_type`, `complexity`, `scene_change`, `idr_inserted`, `frames_since_idr`.

Since **v0.39** the sidecar is multi-subscriber — up to 4 receivers at once (5 s TTL per slot), so an adaptive-link controller and a HUD can listen to the telemetry in parallel without hijacking each other's feed. With the `attitude` section enabled, every frame gains an **ATTITUDE** trailer (roll/pitch/yaw for an artificial horizon in the HUD) — Star6E only; see the [API reference](/en/software/waybeam-venc-web-interface#attitude-artificial-horizon-from-the-imu).

---

### Part 5: SD card recording

Waybeam supports simultaneous streaming and recording:

```bash
# Enable recording via the API (Star6E)
curl "http://localhost/api/v1/record/start"

# Check status
curl "http://localhost/api/v1/record/status"

# Stop recording
curl "http://localhost/api/v1/record/stop"
```

::: warning Recording on Maruko
HTTP recording control works only on Star6E. On Maruko recording is enabled config-only (`record.enabled=true` + `record.mode=...`), and `/api/v1/record/start|stop` returns `501 not_implemented`.
:::

**Gemini mode** — stream to WFB-ng at a low bitrate while recording to SD at high quality:

```json
{
  "record": {
    "enabled": true,
    "mode": "dual",
    "dir": "/mnt/mmcblk0p1",
    "format": "ts",
    "bitrate": 20000,
    "fps": 120,
    "gopSize": 2
  }
}
```

::: info
The MPEG-TS format needs no file finalization. Even on a sudden power loss the recording is playable up to the last written packet. Files rotate at IDR boundaries by time (`maxSeconds`) or size (`maxMB`).

Since **v0.17.1** the second VENC channel is created right away with `record.mode: "dual"` / `"dual-stream"` (not only with `record.enabled: true`), and the SD recording bitrate is fully independent of the live stream.
:::

---

### Integration check

After setup, run a check:

```bash
# 1. On the camera — verify waybeam is streaming
curl http://localhost/api/v1/config | grep -A5 outgoing

# 2. On the camera — check the transport state (fill, drops)
curl http://localhost/api/v1/transport/status

# 3. On the ground station — verify reception
ffplay -fflags nobuffer -i udp://0.0.0.0:5600

# 4. Request an IDR keyframe to start decoding
curl http://192.168.1.10/request/idr
```

---

### Comparison: Waybeam + WFB-ng vs Majestic + WFB-ng

| Aspect | Waybeam + WFB-ng | Majestic + WFB-ng |
| :--- | :--- | :--- |
| **Latency** | Lower (Unix socket / SHM) | UDP via the network stack |
| **API** | Real-time field changes | Limited set |
| **Loss resilience** | Resilience presets (intra-refresh + SVC-T) | Basic |
| **Recording** | Gemini mode (stream + record) | Basic |
| **ISP tuning** | 62 parameters + export/import | Limited |
| **Stabilization / zoom** | Kalman stabilization (both chips) + digital zoom | None |
| **Web panel** | Built-in with full control | — |
| **Source** | Open (MIT) | Closed |

---

### Next steps

- [**Web panel and HTTP API**](/en/software/waybeam-venc-web-interface) — control via the browser
- [**Waybeam overview**](/en/software/waybeam-venc) — all features
- [**Install on the camera**](/en/software/waybeam-venc-install-camera) — initial installation
