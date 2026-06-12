---
title: "Installing Waybeam on the camera"
description: "Step-by-step guide to installing Waybeam on a SigmaStar (Infinity6E / Infinity6C) camera and integrating it with WFB-ng instead of Majestic."
---

# Installing Waybeam on the camera

This guide describes how to install **Waybeam** on a SigmaStar (Infinity6E / Infinity6C) camera and configure it to work with **WFB-ng** instead of Majestic.

::: info What is Waybeam?
**Waybeam** is a standalone H.265 (HEVC) video encoder that fully replaces Majestic. It provides lower latency, a full HTTP API for real-time tuning, and native WFB-ng integration via a Unix socket. The binary, config (`/etc/waybeam.json`) and init script are named `waybeam` (the old `venc` name only survives in the repository URL).
:::

---

### Requirements

| Component | Details |
| :--- | :--- |
| **Camera (VTX)** | Star6E (SSC30KQ / SSC338Q, Infinity6E) or Maruko (SSC378QE, Infinity6C) with OpenIPC firmware |
| **Sensor** | IMX335, IMX415, GC4653 or another supported sensor |
| **Firmware** | OpenIPC (Lite or FPV) |
| **Access** | SSH to the camera (`root` / `12345`) |
| **Network** | Ethernet or WiFi for file transfer |

---

### Step 1: Connect to the camera via SSH

Connect to the camera over SSH. The camera's IP address is usually `192.168.1.10` or can be found via the router.

<details markdown="1">
<summary><strong>Windows</strong></summary>

1. Download and install [PuTTY](https://www.putty.org/)
2. Enter the camera's IP address in the "Host Name" field
3. Port: `22`, type: `SSH`
4. Click "Open"
5. Login: `root`, password: `12345`

</details>

<details markdown="1">
<summary><strong>Mac / Linux</strong></summary>

```bash
ssh root@192.168.1.10
```

Password: `12345`

</details>

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

**For Star6E (SSC30KQ / SSC338Q / Infinity6E):**

```bash
cd /tmp
curl -L -o waybeam-star6e.tar.gz \
  https://github.com/OpenIPC/waybeam_venc/releases/latest/download/waybeam-star6e.tar.gz
tar xzf waybeam-star6e.tar.gz

# Install the binary
cp waybeam /usr/bin/waybeam
chmod +x /usr/bin/waybeam
```

**For Maruko (SSC378QE / Infinity6C):**

```bash
cd /tmp
curl -L -o waybeam-maruko.tar.gz \
  https://github.com/OpenIPC/waybeam_venc/releases/latest/download/waybeam-maruko.tar.gz
tar xzf waybeam-maruko.tar.gz

cp waybeam /usr/bin/waybeam
chmod +x /usr/bin/waybeam
```

::: warning Maruko needs libraries
Stock OpenIPC firmware for Infinity6C does **not** ship SigmaStar (MI) vendor libraries. The libraries from the tarball must be copied to `/usr/lib/`, and sensor `.ko` modules and ISP `.bin` files may also be required. See the [repository README](https://github.com/OpenIPC/waybeam_venc#maruko-infinity6c) for details and provisioning scripts.
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
    "gainMax": 0,
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
    "qpDelta": -4,
    "frameLost": true,
    "sceneThreshold": 0,
    "sceneHoldoff": 2,
    "resilience": "off",
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

---

### Step 5: Key configuration parameters

<strong>Video (`video0`)</strong>

| Parameter | Description | Typical values |
| :--- | :--- | :--- |
| `rcMode` | Rate-control mode | `"cbr"`, `"vbr"`, `"avbr"`, `"fixqp"` |
| `fps` | Frame rate | `30`, `60`, `90`, `120` |
| `size` | Resolution | `"auto"`, `"1920x1080"`, `"1280x720"` |
| `bitrate` | Bitrate (kbps) | `4096` — `16384` |
| `gopSize` | GOP size in seconds (only effective when `resilience: "off"`) | `0.5` — `4.0` |
| `qpDelta` | I/P QP delta | `-12` — `12` |
| `resilience` | Loss-resilience preset (requires a **reboot**) | `"off"`, `"racing"`, `"fpv"`, … |
| `framing` | Stabilization / digital zoom | `"off"`, `"stab"`, `"zoom-2x"`, … |

::: info More on framing and resilience
The stabilization/zoom modes (`framing`) and resilience presets are documented in detail in [Web panel and HTTP API](/en/software/waybeam-venc-web-interface).
:::

<strong>Streaming (`outgoing`)</strong>

| Parameter | Description | Examples |
| :--- | :--- | :--- |
| `enabled` | Enable streaming | `true` / `false` |
| `server` | Receiver address | `"unix://wfb_tx"`, `"udp://192.168.1.1:5600"`, `"shm://venc_ring"` |
| `streamMode` | Stream mode | `"rtp"` or `"compact"` |
| `maxPayloadSize` | Max RTP packet size | `1400` (default) |

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

The web panel will be available at `http://<camera-ip>/`

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
:::

::: details H.264 codec doesn't work
Waybeam encodes **only H.265 (HEVC)** on both chips. There is no `video0.codec` field; H.264 is not supported. Make sure your receiver (PixelPilot, ffplay, QGroundControl, GStreamer) is configured for H.265.
:::

---

### Next steps

- [**WFB-ng integration**](/en/software/waybeam-venc-install-groundstation) — configuring Waybeam + WFB-ng on the camera and ground station
- [**Web panel and HTTP API**](/en/software/waybeam-venc-web-interface) — detailed description of all API endpoints
- [**Waybeam overview**](/en/software/waybeam-venc) — the full feature list
