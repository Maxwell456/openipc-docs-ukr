---
title: "venc web panel and HTTP API"
description: "Complete reference for the waybeam venc HTTP API — web dashboard, ISP tuning, recording and real-time video parameter control."
---

# Web panel and HTTP API

waybeam venc includes a built-in web panel and a full HTTP API for controlling all parameters in real time. The web panel is available at `http://<camera-ip>/` (default port — 80).

---

### Web panel

<strong>Settings tab</strong>

All 84 configuration parameters are grouped into 13 sections:

| Section | Number of fields | Description |
| :--- | :--- | :--- |
| System | 3 | Port, overclock, logging |
| Sensor | 7 | Sensor selection and unlock |
| ISP | 7 | Exposure, AWB, AE |
| Image | 3 | Mirror, flip, rotate |
| Video | 10 | Codec, bitrate, FPS, GOP |
| Outgoing | 7 | Streaming, address, mode |
| Audio | 6 | Codec, sample rate, volume |
| FPV | 5 | ROI encoding |
| IMU | 7 | BMI270 gyroscope |
| EIS | 11 | Image stabilization |
| Recording | 10 | Recording to the SD card |
| Adaptive Encoder | 2 | Scene detection |
| Debug | 1 | OSD |

**Interface elements:**

- 🟢 **Live** — the parameter changes instantly without a restart
- 🟠 **Restart** — requires a pipeline reinit (automatic)
- **Apply Changes** — apply all changed fields
- **Save & Restart** — apply and restart the pipeline
- **Restore Defaults** — restore the configuration from disk

<strong>API Reference tab</strong>

Documentation for all HTTP endpoints with example responses. Categories:

- Configuration
- Encoder Control
- ISP & Image Quality
- Recording
- Dual-Stream

<strong>Image Quality tab (ISP)</strong>

Direct access to 62 SigmaStar ISP parameters:

- **Parameters** — expandable sections with parameter chips
- **Multi-fields** — a built-in editor for complex parameters (colortrans, OBC, demosaic, etc.)
- **Export / Import** — saving and restoring ISP profiles in JSON

---

### HTTP API — reference

All endpoints use HTTP GET (compatible with BusyBox wget). Responses are JSON in the format `{"ok": true/false, ...}`.

---

<strong>Core endpoints</strong>

<strong>GET /api/v1/version</strong>

Returns version information.

```bash
curl http://&lt;ip&gt;:80/api/v1/version
```

**Response:**
```json
{
  "ok": true,
  "data": {
    "app_version": "0.5.2",
    "backend": "star6e",
    "contract_version": "0.2.0",
    "config_schema_version": "0.2.0"
  }
}
```

---

<strong>GET /api/v1/config</strong>

Returns the full active configuration.

```bash
curl http://&lt;ip&gt;:80/api/v1/config
```

---

<strong>GET /api/v1/capabilities</strong>

Shows the mutability of each field (`live` or `restart_required`) and backend support.

```bash
curl http://&lt;ip&gt;:80/api/v1/capabilities
```

::: tip Checking support
Use this endpoint to find out which fields can be changed on the fly and which require a pipeline restart.
:::

---

### Reading and writing fields

<strong>GET /api/v1/get?field_name</strong>

Read a single field:

```bash
curl "http://&lt;ip&gt;:80/api/v1/get?video0.bitrate"
```

**Response:**
```json
{"ok": true, "data": {"field": "video0.bitrate", "value": 8192}}
```

---

<strong>GET /api/v1/set?field_name=value</strong>

Write a field. Live fields are applied instantly. Restart fields trigger a reinit.

```bash
# Instant bitrate change (live)
curl "http://&lt;ip&gt;:80/api/v1/set?video0.bitrate=4096"

# Multi-change (live fields only)
curl "http://&lt;ip&gt;:80/api/v1/set?video0.bitrate=4096&system.verbose=true"

# Resolution change (restart — pipeline reinit)
curl "http://&lt;ip&gt;:80/api/v1/set?video0.size=1280x720"
```

**Responses:**
```json
// Single field
{"ok": true, "data": {"field": "video0.bitrate", "value": 4096}}

// Multi-change
{"ok": true, "data": {"applied": [
  {"field": "video0.bitrate", "value": 4096},
  {"field": "system.verbose", "value": true}
]}}

// Restart field
{"ok": true, "data": {"field": "video0.size", "value": "1280x720", "reinit_pending": true}}
```

::: warning Multi-set limitation
Multi-set is supported only for live fields. If at least one restart field is present, the entire request is rejected. Send restart changes one at a time.
:::

::: danger HTTP 409 — validation error
If a value is invalid (for example, a non-existent AWB mode, or if the field doesn't exist), the API returns **HTTP 409 Conflict** instead of the usual 200.
:::

---

<strong>GET /api/v1/restart</strong>

A full pipeline reinit. Reloads `/etc/venc.json` and restarts the camera without terminating the process.

```bash
curl http://&lt;ip&gt;:80/api/v1/restart
```

---

### Encoder control

<strong>GET /request/idr</strong>

Request an IDR keyframe from the encoder:

```bash
curl http://&lt;ip&gt;:80/request/idr
```

::: tip When to request an IDR
- After a new viewer connects
- After packet loss on the radio link
- When video artifacts appear
:::

---

<strong>GET /api/v1/awb</strong>

The auto white balance state from the ISP:

```bash
curl http://&lt;ip&gt;:80/api/v1/awb
```

---

### Recording to the SD card

<strong>GET /api/v1/record/start</strong>

Start recording. Uses the configured `record.dir`, or you can specify a directory as a parameter:

```bash
# Record to the default directory
curl "http://&lt;ip&gt;:80/api/v1/record/start"

# Record to a specific directory
curl "http://&lt;ip&gt;:80/api/v1/record/start?dir=/mnt/mmcblk0p1"
```

<strong>GET /api/v1/record/stop</strong>

Stop recording:

```bash
curl "http://&lt;ip&gt;:80/api/v1/record/stop"
```

<strong>GET /api/v1/record/status</strong>

Recording status:

```bash
curl "http://&lt;ip&gt;:80/api/v1/record/status"
```

**Response:**
```json
{
  "ok": true,
  "data": {
    "active": true,
    "format": "ts",
    "path": "/mnt/mmcblk0p1/rec_01h23m45s_abcd.ts",
    "frames": 1500,
    "bytes": 12345678,
    "segments": 1,
    "stop_reason": "none"
  }
}
```

---

### Dual-Stream (Gemini mode)

<strong>GET /api/v1/dual/status</strong>

Status of the second VENC channel:

```bash
curl "http://&lt;ip&gt;:80/api/v1/dual/status"
```

**Response:**
```json
{"ok": true, "data": {"active": true, "channel": 1, "bitrate": 20000, "fps": 120, "gop": 240}}
```

::: warning Dual VENC not active
If the recording mode is not `"dual"` or `"dual-stream"`, this endpoint returns **HTTP 404**.
:::

<strong>GET /api/v1/dual/set?param=value</strong>

Change the second channel's parameters in real time:

```bash
# Change the recording bitrate
curl "http://&lt;ip&gt;:80/api/v1/dual/set?bitrate=10000"

# Change the GOP (in seconds)
curl "http://&lt;ip&gt;:80/api/v1/dual/set?gop=1.0"
```

<strong>GET /api/v1/dual/idr</strong>

IDR keyframe for the second channel:

```bash
curl "http://&lt;ip&gt;:80/api/v1/dual/idr"
```

---

### ISP Image Quality

<strong>GET /api/v1/iq</strong>

Export all ISP parameters:

```bash
# Save as a file
curl http://&lt;ip&gt;:80/api/v1/iq > my_tuning.json
```

<strong>POST /api/v1/iq/import</strong>

Import ISP parameters (full or partial):

```bash
# Full import
curl -X POST -H "Content-Type: application/json" \
  -d @my_tuning.json http://&lt;ip&gt;:80/api/v1/iq/import

# Partial import — only specific parameters
echo '{"lightness":{"value":75},"demosaic":{"fields":{"dir_thrd":30}}}' | \
  curl -X POST -H "Content-Type: application/json" -d @- http://&lt;ip&gt;:80/api/v1/iq/import
```

<strong>GET /api/v1/iq/set?param=value</strong>

Change a single ISP parameter (dot-notation):

```bash
# Set a single field
curl "http://&lt;ip&gt;:80/api/v1/iq/set?colortrans.y_ofst=200"

# Set an array (comma-separated)
curl "http://&lt;ip&gt;:80/api/v1/iq/set?colortrans.matrix=23,45,9,1005,987,56,56,977,1015"
```

---

### Common scenario examples

<strong>Quick switch to 720p 90fps</strong>

```bash
curl "http://&lt;ip&gt;/api/v1/set?video0.size=1280x720"
# Wait for reinit...
curl "http://&lt;ip&gt;/api/v1/set?video0.fps=90"
curl "http://&lt;ip&gt;/api/v1/set?video0.bitrate=4096"
```

<strong>Manual white balance (6500K)</strong>

```bash
curl "http://&lt;ip&gt;/api/v1/set?isp.awbMode=ct_manual"
curl "http://&lt;ip&gt;/api/v1/set?isp.awbCt=6500"
```

<strong>Enabling ROI encoding for FPV</strong>

```bash
curl "http://&lt;ip&gt;/api/v1/set?fpv.roiEnabled=true"
curl "http://&lt;ip&gt;/api/v1/set?fpv.roiQp=-18"
curl "http://&lt;ip&gt;/api/v1/set?fpv.roiSteps=2"
```

<strong>Enabling EIS (Star6E only)</strong>

```bash
# First in /etc/venc.json:
# "imu": {"enabled": true}, "eis": {"enabled": true, "mode": "gyroglide"}
# Then restart:
curl http://&lt;ip&gt;/api/v1/restart
```

::: info IMU calibration
After a restart, hold the camera still for 2 seconds for automatic gyroscope calibration.
:::

---

### Recommended settings by scenario

<strong>FPV racing (minimum latency)</strong>

```json
{
  "video0": {"codec":"h265", "rcMode":"cbr", "fps":90, "size":"1280x720", "bitrate":6144, "gopSize":0.5},
  "fpv": {"roiEnabled":true, "roiQp":-12, "roiSteps":2, "roiCenter":0.35},
  "outgoing": {"streamMode":"rtp", "server":"unix://wfb_tx"}
}
```

<strong>FPV freestyle (quality + recording)</strong>

```json
{
  "video0": {"codec":"h265", "rcMode":"cbr", "fps":60, "size":"1920x1080", "bitrate":8192, "gopSize":1.0},
  "fpv": {"roiEnabled":true, "roiQp":-18, "roiSteps":3, "roiCenter":0.4},
  "record": {"enabled":true, "mode":"dual", "bitrate":20000, "fps":120},
  "outgoing": {"streamMode":"rtp", "server":"unix://wfb_tx"}
}
```

<strong>Long range</strong>

```json
{
  "video0": {"codec":"h265", "rcMode":"cbr", "fps":30, "size":"1280x720", "bitrate":3072, "gopSize":2.0},
  "fpv": {"roiEnabled":false},
  "outgoing": {"streamMode":"rtp", "server":"unix://wfb_tx"}
}
```

---

### Next steps

- [**waybeam venc overview**](/en/software/waybeam-venc) — the full list of features
- [**Install on the camera**](/en/software/waybeam-venc-install-camera) — initial installation
- [**WFB-ng integration**](/en/software/waybeam-venc-install-groundstation) — configuring the WFB combination
