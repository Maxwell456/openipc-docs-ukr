---
title: "Integrating venc with WFB-ng"
description: "How to configure waybeam venc to work with WFB-ng instead of Majestic — a full guide for the camera and the ground station."
---

# Integrating venc with WFB-ng

This guide describes how to fully replace **Majestic** with **waybeam venc** in combination with **WFB-ng** (WiFi Broadcast) for low-latency FPV streaming.

---

<h3>System architecture</h3>

```
┌─────────────────── CAMERA (VTX) ───────────────────┐
                                                      
  Sensor → ISP → venc (H.265 encoder)                
                    │                                  
                    ├─ RTP over a Unix socket          
                    ▼                                  
              wfb_tx (WFB-ng TX)                      
                    │                                  
                    ▼                                  
              WiFi adapter (RTL8812EU / AU)            
└──────────────────────────────────────────────────────┘
                     │  (radio link)
                     ▼
┌──────────── GROUND STATION (GS) ────────────────────┐
              WiFi adapter (RTL8812EU / AU)            
                    │                                  
                    ▼                                  
              wfb_rx (WFB-ng RX)                      
                    │                                  
                    ├─ UDP → PixelPilot / QGroundControl
                    ▼                                  
         Video player (port 5600)                      
└──────────────────────────────────────────────────────┘
```

---

<h3>Part 1: Camera (VTX) setup</h3>

<strong>1.1 Prerequisites</strong>

Before you start, make sure that:

- ✅ OpenIPC firmware is installed on the camera
- ✅ WFB-ng (`wfb_tx`) is installed and running
- ✅ A WiFi adapter (RTL8812EU or RTL8812AU) is connected
- ✅ You have SSH access to the camera

::: info Installing venc
If venc is not yet installed, see [Installing venc on the camera](/en/software/waybeam-venc-install-camera).
:::

<strong>1.2 Stop Majestic</strong>

```bash
# Stop Majestic
killall majestic 2>/dev/null

# Disable autostart (if using init.d)
chmod -x /etc/init.d/S95majestic 2>/dev/null
```

<strong>1.3 Configuring venc for WFB-ng</strong>

The main difference from Majestic is **how the video is delivered to WFB-ng**.

<strong>Method 1: Unix socket (recommended)</strong>

The most efficient method is transmission over an abstract Unix socket. This reduces latency compared to UDP, since the data doesn't go through the kernel's network stack.

Edit `/etc/venc.json`:

```json
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

::: tip Socket name
The name `wfb_tx` in `unix://wfb_tx` is the name of the abstract Unix socket. It must match the WFB-ng configuration on the transmitter side. Check the WFB-ng configuration to make sure `wfb_tx` is listening on this socket.
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

<strong>Method 3: Shared Memory (SHM)</strong>

For maximum performance — via a ring buffer in shared memory:

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
`shm://` works only in RTP mode.
:::

    **Audio is not supported over the main SHM channel even with `audioPort: 0`.**
    If you need audio with `shm://` — set `audioPort > 0` (e.g. `5601`), and audio will go to a separate UDP port.

---

<strong>1.4 Configuring WFB-ng on the camera</strong>

The WFB-ng configuration must match the transmission method you chose in venc.

**For the Unix socket** — in the `wfb_tx` configuration, specify the same abstract socket:

```
# In the wfb_tx configuration
# Input stream — from the Unix socket from venc
peer = listen://unix://wfb_tx
```

**For UDP on localhost:**

```
# In the wfb_tx configuration
# Input stream — UDP from venc
peer = listen://udp://127.0.0.1:5600
```

<strong>1.5 Optimal video parameters for WFB-ng</strong>

Recommended parameters for stable FPV streaming over WiFi Broadcast:

```json
{
  "video0": {
    "codec": "h265",
    "rcMode": "cbr",
    "fps": 60,
    "size": "1920x1080",
    "bitrate": 8192,
    "gopSize": 1.0,
    "qpDelta": -4,
    "frameLost": true,
    "sceneThreshold": 0,
    "sceneHoldoff": 2
  }
}
```

**Parameter explanation:**

| Parameter | Recommendation | Why |
| :--- | :--- | :--- |
| `codec: "h265"` | H.265 | Better quality at the same bitrate; required for RTP on Star6E |
| `rcMode: "cbr"` | CBR | A stable bitrate is better for the radio link |
| `fps: 60` | 60 fps | Balance between smoothness and load |
| `bitrate: 8192` | 8 Mbit/s | Optimal for a 20 MHz WFB channel |
| `gopSize: 1.0` | 1 second | Fast recovery after packet loss |
| `frameLost: true` | Enabled | Allows frames to be dropped when overloaded |

::: warning Bitrate and channel width
Match the bitrate to the WFB-ng throughput:
:::

    | Channel width | MCS | Max. bitrate | Recommended |
    | :--- | :--- | :--- | :--- |
    | 20 MHz | MCS 3 | ~20 Mbit/s | 8–12 Mbit/s |
    | 20 MHz | MCS 1 | ~10 Mbit/s | 4–6 Mbit/s |
    | 40 MHz | MCS 3 | ~40 Mbit/s | 16–22 Mbit/s |

---

<strong>1.6 Service startup order</strong>

The correct startup order on the camera:

```bash
# 1. Load the WiFi driver
insmod /lib/modules/88XXau.ko 2>/dev/null

# 2. Start WFB-ng TX
wfb_tx -u unix://wfb_tx -p 0 -k 8 -n 12 wlan0 &

# 3. Start venc
venc &
```

::: tip Init script
For automatic startup, create an init script as described in [Install on the camera — Step 7](/en/software/waybeam-venc-install-camera). Make sure the script numbers are in the right order: WiFi → WFB-ng → venc.
:::

---

<h3>Part 2: Ground station (GS) setup</h3>

<strong>2.1 Ground station requirements</strong>

| Component | Options |
| :--- | :--- |
| **Platform** | Radxa Zero 3W, Raspberry Pi 4/5, x86 Linux |
| **WiFi adapter** | RTL8812EU (recommended) or RTL8812AU |
| **Player** | PixelPilot (Android), QGroundControl, ffplay |

<strong>2.2 Configuring WFB-ng RX</strong>

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

<strong>2.3 Watching the video</strong>

<strong>PixelPilot (Android)</strong>

1. Connect the ground station to the phone
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

<h3> Part 3: Audio over WFB-ng</h3>

venc supports transmitting audio in parallel with video:

<h4>3.1 Enabling audio on the camera</h4>

Update `/etc/venc.json`:

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
When using `unix://` with `audioPort: 0`, audio is transmitted together with the video over the same socket. With `audioPort > 0`, audio is sent to a separate UDP port `127.0.0.1:<audioPort>`.
:::

<strong>3.2 Receiving audio on the ground station</strong>

```bash
# Separate WFB channel for audio
wfb_rx -p 1 -c 127.0.0.1 -u 5601 -k 4 -n 8 wlan0

# Playback
ffplay -nodisp -fflags nobuffer -i udp://0.0.0.0:5601
```

---

<h3>Part 4: Adaptive control (advanced)</h3>

<strong>4.1 Scene-Change IDR</strong>

To improve stream recovery on abrupt scene changes (takeoff, maneuvers):

```bash
# Enable scene detection (Star6E only)
curl "http://localhost/api/v1/set?video0.sceneThreshold=150"
curl "http://localhost/api/v1/set?video0.sceneHoldoff=2"
```

- `sceneThreshold: 150` — triggers at a ≈1.5x jump in frame size
- `sceneHoldoff: 2` — minimum interval between IDR frames

<strong>4.2 Sidecar for an external controller</strong>

If you use an external link-quality controller (adaptive link):

```bash
curl "http://localhost/api/v1/set?outgoing.sidecarPort=6666"
```

The sidecar sends per-frame telemetry: `frame_type`, `complexity`, `scene_change`, `idr_inserted`, `frames_since_idr`.

---

<h3>Part 5: Recording to the SD card</h3>

venc supports simultaneous streaming and recording:

```bash
# Enable recording via the API
curl "http://localhost/api/v1/record/start"

# Check the status
curl "http://localhost/api/v1/record/status"

# Stop recording
curl "http://localhost/api/v1/record/stop"
```

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
The MPEG-TS format doesn't need file finalization. Even on a sudden power loss, the recording will be readable up to the last written packet.
:::

---

<h3>Verifying the integration</h3>

After configuration, run the checks:

```bash
# 1. On the camera — verify that venc is streaming
curl http://localhost/api/v1/config | grep -A5 outgoing

# 2. On the camera — check the FPS
curl http://localhost/api/v1/version

# 3. On the ground station — check reception
# (should show video without significant latency)
ffplay -fflags nobuffer -i udp://0.0.0.0:5600

# 4. Request an IDR keyframe to start decoding
curl http://192.168.1.10/request/idr
```

---

<h3>Comparison: venc + WFB-ng vs Majestic + WFB-ng</h3>

| Aspect | venc + WFB-ng | Majestic + WFB-ng |
| :--- | :--- | :--- |
| **Latency** | Lower (Unix socket / SHM) | UDP through the network stack |
| **API** | 84 parameters in real time | Limited set |
| **Recording** | Gemini mode (stream + record) | Basic |
| **ISP tuning** | 60+ parameters + export/import | Limited |
| **EIS** | GyroGlide-Lite (Star6E) | None |
| **Web panel** | Built-in with full control | — |
| **Source** | Open (MIT) | Closed |

---

<h3>Next steps</h3>

- [**Web panel and HTTP API**](/en/software/waybeam-venc-web-interface) — control via the browser
- [**waybeam venc overview**](/en/software/waybeam-venc) — all features
- [**Install on the camera**](/en/software/waybeam-venc-install-camera) — initial installation
