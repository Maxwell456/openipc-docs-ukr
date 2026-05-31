---
title: "Installing venc on the camera"
description: "Step-by-step guide to installing waybeam venc on a camera with a SigmaStar SSC338Q chip and integrating it with WFB-ng instead of Majestic."
---

# Installing venc on the camera

This guide describes how to install **waybeam venc** on a camera with a SigmaStar chip (Infinity6E / Infinity6C) and configure it to work with **WFB-ng** instead of Majestic.

::: info What is venc?
**waybeam venc** is a standalone video encoder that fully replaces Majestic. It provides lower latency, a full HTTP API for real-time configuration, and native WFB-ng integration via a Unix socket.
:::

---

### Requirements

| Component | Details |
| :--- | :--- |
| **Camera (VTX)** | SSC338Q (Infinity6E) or Infinity6C with OpenIPC firmware |
| **Sensor** | IMX335, IMX415, GC4653 or another supported one |
| **Firmware** | OpenIPC (Lite or FPV) |
| **Access** | SSH to the camera (`root` / `12345`) |
| **Network** | Ethernet or WiFi for file transfer |

---

### Step 1: Connecting to the camera via SSH

Connect to the camera via SSH. The camera's IP address is usually `192.168.1.10` or can be found via the router.

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

### Step 2: Stopping Majestic

Before installing venc you must stop and disable Majestic:

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
Majestic and venc cannot run at the same time — both use the chip's ISP and video encoder.
:::

---

### Step 3: Downloading venc

Download the venc binary onto the camera. Choose the version matching your chip:

**For Star6E (SSC338Q / Infinity6E):**

```bash
# Download the venc binary
curl -L -o /usr/bin/venc \
  https://github.com/OpenIPC/waybeam_venc/releases/latest/download/venc-star6e

chmod +x /usr/bin/venc
```

**For Maruko (Infinity6C):**

```bash
curl -L -o /usr/bin/venc \
  https://github.com/OpenIPC/waybeam_venc/releases/latest/download/venc-maruko

chmod +x /usr/bin/venc
```

::: tip Alternative method — SCP
If you have a built binary on your computer:
```bash
scp out/star6e/venc root@192.168.1.10:/usr/bin/venc
```
:::

---

### Step 4: Creating the configuration

Create the configuration file `/etc/venc.json`:

```bash
cat > /etc/venc.json << 'EOF'
{
  "system": { "webPort": 80, "overclockLevel": 1, "verbose": false },
  "sensor": {
    "index": -1,
    "mode": -1,
    "unlockEnabled": true,
    "unlockCmd": 35,
    "unlockReg": 12298,
    "unlockValue": 128,
    "unlockDir": 0
  },
  "isp": {
    "sensorBin": "", "exposure": 0,
    "legacyAe": true, "aeFps": 15, "gainMax": 0,
    "awbMode": "auto", "awbCt": 5500
  },
  "image": { "mirror": false, "flip": false, "rotate": 0 },
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
  "eis": {
    "enabled": false,
    "mode": "gyroglide",
    "marginPercent": 30,
    "testMode": false,
    "swapXY": false,
    "invertX": false,
    "invertY": false,
    "gain": 1.0,
    "deadbandRad": 0.0,
    "recenterRate": 0.5,
    "maxSlewPx": 0,
    "biasAlpha": 0.001
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
  "debug": {
    "showOsd": false
  }
}
EOF
```

---

### Step 5: Key configuration parameters

<strong>Video (`video0`)</strong>

| Parameter | Description | Typical values |
| :--- | :--- | :--- |
| `codec` | Video codec | `"h265"` or `"h264"` |
| `rcMode` | Bitrate control mode | `"cbr"`, `"vbr"`, `"avbr"`, `"fixqp"` |
| `fps` | Frame rate | `30`, `60`, `90`, `120` |
| `size` | Resolution | `"1920x1080"`, `"1280x720"` |
| `bitrate` | Bitrate (kbit/s) | `4096` — `16384` |
| `gopSize` | GOP size in seconds | `0.5` — `2.0` |

<strong> Streaming (`outgoing`)</strong>

| Parameter | Description | Examples |
| :--- | :--- | :--- |
| `enabled` | Enable streaming | `true` / `false` |
| `server` | Receiver address | `"unix://wfb_tx"`, `"udp://192.168.1.1:5600"` |
| `streamMode` | Stream mode | `"rtp"` or `"compact"` |
| `maxPayloadSize` | Max RTP packet size | `1400` (default) |

<strong> FPV ROI encoding (`fpv`)</strong>

| Parameter | Description | Value |
| :--- | :--- | :--- |
| `roiEnabled` | Frame-center priority | `true` — center in higher quality |
| `roiQp` | QP offset for ROI | `-18` — maximum center quality |
| `roiSteps` | Number of zones | `2` — `4` |
| `roiCenter` | Size of the central zone | `0.25` — `0.5` |

---

### Step 6: Running venc

<strong> Manual start (for testing)</strong>

```bash
# Start with logs printed to the console
venc
```

The web panel will be available at `http://<camera-ip>/`

<strong> Checking that it works</strong>

```bash
# Check the version
curl http://localhost/api/v1/version

# Check the configuration
curl http://localhost/api/v1/config

# Check which parameters can be changed in real time
curl http://localhost/api/v1/capabilities
```

---

### Step 7: Autostart venc

Create an init script to start venc automatically when the camera boots:

```bash
cat > /etc/init.d/S96venc << 'INITEOF'
#!/bin/sh

case "$1" in
  start)
    echo "Starting venc..."
    # Make sure Majestic is not running
    killall majestic 2>/dev/null
    # Start venc in the background
    start-stop-daemon -S -b -x /usr/bin/venc -- 2>&1 | tee /tmp/venc.log &
    ;;
  stop)
    echo "Stopping venc..."
    killall venc 2>/dev/null
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

chmod +x /etc/init.d/S96venc
```

::: tip Startup order
The script is numbered `S96`, which means it starts after most system services, but you need to make sure the WiFi drivers and WFB-ng are already loaded by that point.
:::

::: info audioPort and sidecarPort
In the config above, `audioPort: 0` and `sidecarPort: 0` are set to 0. This means:
:::

    - `audioPort: 0` — audio is transmitted together with the video over the same Unix socket (optimal for WFB-ng)
    - `sidecarPort: 0` — the sidecar diagnostics channel is disabled (no overhead)

    The default config has `audioPort: 5601` and `sidecarPort: 5602` — if you need separate audio transmission over UDP, set the appropriate values.

---

### Step 8: Changing parameters in real time

After starting venc you can change parameters without restarting:

```bash
# Change the bitrate
curl "http://localhost/api/v1/set?video0.bitrate=4096"

# Change the resolution (requires reinit)
curl "http://localhost/api/v1/set?video0.size=1280x720"

# Change the FPS
curl "http://localhost/api/v1/set?video0.fps=90"

# Enable ROI for FPV
curl "http://localhost/api/v1/set?fpv.roiEnabled=true"
curl "http://localhost/api/v1/set?fpv.roiQp=-18"

# Request an IDR keyframe (useful after connecting)
curl http://localhost/request/idr
```

---

### Common issues

??? question "venc won't start — library error"
    Make sure all SigmaStar libraries are available in `/usr/lib`. If you use a staged build, set the variable:
    ```bash
    export LD_LIBRARY_PATH=/path/to/lib
    ```

??? question "No video after starting"
    1. Check that `outgoing.enabled` is set to `true`
    2. Check that the `outgoing.server` address is correct
    3. Check that Majestic is fully stopped: `ps | grep majestic`
    4. Check the logs: `cat /tmp/venc.log`

??? question "Black screen or artifacts"
    Check sensor compatibility:
    ```bash
    curl http://localhost/api/v1/version
    ```
    Make sure `sensor.index` and `sensor.mode` are set to `-1` (auto-detect).

??? question "Star6E: error with h264 over RTP"
    On Star6E the RTP mode supports only H.265. Change the codec:
    ```bash
    curl "http://localhost/api/v1/set?video0.codec=h265"
    ```

---

### Next steps

- [**WFB-ng integration**](/en/software/waybeam-venc-install-groundstation) — configuring venc + WFB-ng on the camera and ground station
- [**Web panel and HTTP API**](/en/software/waybeam-venc-web-interface) — a detailed description of all API endpoints
- [**waybeam venc overview**](/en/software/waybeam-venc) — the full list of features
