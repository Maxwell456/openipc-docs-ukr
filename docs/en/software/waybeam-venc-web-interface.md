---
title: "Waybeam web panel and HTTP API"
description: "Complete reference for the Waybeam HTTP API — web dashboard, ISP tuning, stabilization, resilience presets, recording and real-time video parameter control."
---

# Web panel and HTTP API

Waybeam includes a built-in web panel and a full HTTP API for real-time parameter control. The web panel is available at `http://<camera-ip>/` (default port — 80).

---

### Web panel

<strong>Settings tab</strong>

Configuration fields are grouped into **12 sections**:

| Section | Description |
| :--- | :--- |
| System | Port, overclock, logging |
| Sensor | Sensor selection (index / mode) |
| ISP | Exposure, AWB, AE engine |
| Image | Mirror, flip, rotate |
| Video | Codec, bitrate, FPS, GOP, framing, resilience |
| Outgoing | Streaming, address, mode |
| Audio | Codec, sample rate, volume |
| FPV | ROI encoding + 3DNR |
| IMU | BMI270 gyro (POC) |
| Recording | SD card recording |
| Adaptive Encoder Control | Scene detection |
| Debug | OSD |

**Interface elements:**

- 🟢 **Live** — the parameter changes instantly without a restart
- 🟠 **Restart** — requires a pipeline reinit (automatic)
- 🔴 **Reboot** — requires a full camera reboot (only `video0.resilience`)
- **Apply Changes** — apply all changed fields
- **Save & Restart** — apply changes and restart the pipeline
- **Restore Defaults** — reload the on-disk configuration

::: info The EIS section was removed
Earlier versions had a separate `eis` section (gyroscopic GyroGlide stabilization). It was **removed in 0.8.0**. Stabilization now lives in the Video section — the `video0.framing` field (see [below](#framing-stabilization-and-digital-zoom)).
:::

<strong>API Reference tab</strong>

Documentation for all HTTP endpoints with example responses. Categories: Configuration, Encoder Control, ISP & Image Quality, Recording, Dual-Stream.

<strong>Image Quality (ISP) tab</strong>

Direct access to 62 SigmaStar ISP parameters:

- **Parameters** — collapsible sections with parameter chips
- **Multi-fields** — built-in editor for complex parameters (colortrans, OBC, demosaic, etc.)
- **Export / Import** — save and restore ISP profiles as JSON

---

### HTTP API reference

All endpoints use HTTP GET (BusyBox wget compatible). Responses are JSON in the `{"ok": true/false, ...}` format.

::: tip Three mutability levels
- **live** — applied instantly without interrupting the stream
- **restart_required** — triggers an automatic pipeline reinit
- **reboot** — requires a full camera reboot (only `video0.resilience`)

`/api/v1/capabilities` shows each field's mutability level and backend support.
:::

---

<strong>GET /api/v1/version</strong>

Returns version information.

```bash
curl http://<ip>/api/v1/version
```

**Response:**
```json
{
  "ok": true,
  "data": {
    "app_version": "0.16.0",
    "backend": "star6e",
    "contract_version": "0.2.0",
    "config_schema_version": "0.2.0"
  }
}
```

---

<strong>GET /api/v1/config</strong> — the full active configuration.

<strong>GET /api/v1/capabilities</strong> — each field's mutability (`live` / `restart_required`) and backend support.

```bash
curl http://<ip>/api/v1/config
curl http://<ip>/api/v1/capabilities
```

::: tip Checking support
Field support is backend-specific. For example, Star6E reports `video0.scene_threshold` as supported, while Maruko does not. Use `capabilities` before writing.
:::

<strong>GET /api/v1/modes</strong>

Sensor mode introspection (pad + resolution) — the current selection and every mode the SDK enumerates. Populates the WebUI dropdown.

```bash
curl http://<ip>/api/v1/modes
```

---

### Reading and writing fields

<strong>GET /api/v1/get?field_name</strong>

```bash
curl "http://<ip>/api/v1/get?video0.bitrate"
```

```json
{"ok": true, "data": {"field": "video0.bitrate", "value": 8192}}
```

<strong>GET /api/v1/set?field_name=value</strong>

Write a field. Live fields apply instantly. Restart fields trigger a reinit.

```bash
# Instant bitrate change (live)
curl "http://<ip>/api/v1/set?video0.bitrate=4096"

# Multi-set (live fields only)
curl "http://<ip>/api/v1/set?video0.bitrate=4096&system.verbose=true"

# Resolution change (restart — pipeline reinit)
curl "http://<ip>/api/v1/set?video0.size=1280x720"
```

**Responses:**
```json
// Single field
{"ok": true, "data": {"field": "video0.bitrate", "value": 4096}}

// Multi-set
{"ok": true, "data": {"applied": [
  {"field": "video0.bitrate", "value": 4096},
  {"field": "system.verbose", "value": true}
]}}

// Restart field
{"ok": true, "data": {"field": "video0.size", "value": "1280x720", "reinit_pending": true}}
```

::: warning Multi-set limitation
Multi-set is supported only for live fields. If any restart field is present, the whole request is rejected. Send restart changes one at a time (the daemon respawns between them — wait for it to come back).
:::

::: danger HTTP 409 — validation error
If a value is invalid (e.g. a non-existent AWB mode or a field that does not exist), the API returns **HTTP 409 Conflict** instead of 200.
:::

<strong>GET /api/v1/restart</strong>

A full pipeline reinit. Reloads `/etc/waybeam.json` and restarts the camera pipeline without terminating the process.

```bash
curl http://<ip>/api/v1/restart
```

---

### Encoder control

<strong>GET /request/idr</strong>

Request an IDR keyframe from the encoder:

```bash
curl http://<ip>/request/idr
```

::: tip When to request an IDR
- After a new viewer connects
- After packet loss on the radio link
- When video artifacts appear
:::

<strong>GET /api/v1/idr/stats</strong>

Per-channel IDR rate-limit counters: how many requests were honored vs. coalesced.

<strong>GET /api/v1/awb</strong>

Current AWB (auto white balance) state from the ISP.

```bash
curl http://<ip>/api/v1/idr/stats
curl http://<ip>/api/v1/awb
```

---

### Stream observability

<strong>GET /api/v1/transport/status</strong>

State of the active video transport (UDP / Unix / SHM): buffer fill percentage, backpressure flag, lifetime drop counters.

<strong>GET /api/v1/audio/status</strong>

A snapshot of the audio pipeline: whether the library is loaded, capture state, codec, sample rate, channels, Opus initialization.

```bash
curl http://<ip>/api/v1/transport/status
curl http://<ip>/api/v1/audio/status
```

---

### Snapshot (JPEG)

<strong>GET /api/v1/snapshot.jpg</strong>

One JPEG frame from a dedicated MJPEG VENC channel (tapped off the same port as the main H.265 stream). No parameters; quality defaults to 80, resolution matches the main stream.

```bash
curl -o snapshot.jpg http://<ip>/api/v1/snapshot.jpg
```

The response is `Content-Type: image/jpeg`. Possible errors: `503 snapshot_disabled` (pipeline not up yet), `504 snapshot_timeout` (no frame within 1500 ms), `500 snapshot_failed`.

::: info Snapshot settings
`snapshot.quality` is **live** (instant, no reinit). The `snapshot.channel`, `snapshot.width`, `snapshot.height` fields are restart (baked at `MI_VENC_CreateChn`). `width=0`/`height=0` means "match the main stream".
:::

---

### SD card recording

<strong>GET /api/v1/record/start</strong>

Start recording. Uses the configured `record.dir`, or override with a parameter:

```bash
curl "http://<ip>/api/v1/record/start"
curl "http://<ip>/api/v1/record/start?dir=/mnt/mmcblk0p1"
```

<strong>GET /api/v1/record/stop</strong> — stop recording.

<strong>GET /api/v1/record/status</strong> — recording status:

```bash
curl "http://<ip>/api/v1/record/status"
```

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

::: warning Recording on Maruko
HTTP recording control (`start`/`stop`) works only on Star6E. On Maruko recording is **config-only** (`record.enabled=true` + `record.mode=...` in `/etc/waybeam.json`), and `/api/v1/record/start|stop` returns `501 not_implemented`.
:::

---

### Dual-Stream (Gemini mode)

<strong>GET /api/v1/dual/status</strong>

Secondary VENC channel status (only `dual` / `dual-stream` modes):

```bash
curl "http://<ip>/api/v1/dual/status"
```

```json
{"ok": true, "data": {"active": true, "channel": 1, "bitrate": 20000, "fps": 120, "gop": 240}}
```

::: warning Dual VENC not active
If the recording mode is not `"dual"` or `"dual-stream"`, this endpoint returns **HTTP 404**.
:::

<strong>GET /api/v1/dual/set?param=value</strong>

```bash
# Change the recording bitrate
curl "http://<ip>/api/v1/dual/set?bitrate=10000"

# Change the GOP (in seconds)
curl "http://<ip>/api/v1/dual/set?gop=1.0"
```

<strong>GET /api/v1/dual/idr</strong> — IDR keyframe for the secondary channel.

---

### Framing: stabilization and digital zoom

`video0.framing` is the **single user-facing knob** for the VPE crop. It is a named preset (restart-required); the crop fraction is *derived* from the preset (there is no separate `zoomPct` field).

| `framing` | Effect | Resolution @1080p | Chips |
| :--- | :--- | :--- | :--- |
| `off` | Full frame | 1920×1080 | both |
| `stab` | Stabilization (centered 80% crop) | 1536×864 | Star6E only |
| `stab-fill` | Stabilization (floating image on a black border) | 1920×1080 | Star6E only |
| `zoom-1.25x` | Digital zoom 1.25× | 1536×864 | both |
| `zoom-1.50x` | Digital zoom 1.50× | 1280×720 | both |
| `zoom-1.75x` | Digital zoom 1.75× | 1088×608 | both |
| `zoom-2x` | Digital zoom 2× | 960×528 | both |
| `zoom-3x` | Digital zoom 3× | 640×352 | both |
| `zoom-4x` | Digital zoom 4× | 480×256 | both |

**Digital zoom** shrinks both the crop window and the output resolution — no upscale, no extra link load. Panning inside the zoom is live, via `video0.zoomX` / `video0.zoomY` (∈ [0,1], center 0.5/0.5):

```bash
# Enable 3× zoom (restart)
curl "http://<ip>/api/v1/set?video0.framing=zoom-3x"

# Pan (live) — top-left corner / center
curl "http://<ip>/api/v1/set?video0.zoomX=0.0&video0.zoomY=0.0"
curl "http://<ip>/api/v1/set?video0.zoomX=0.5&video0.zoomY=0.5"
```

**Stabilization** (`stab` / `stab-fill`, Star6E only) uses a Kalman trajectory filter. Fine-tuning (all restart; re-selecting the preset resets them to defaults, so **set `framing` first, then the overrides**):

| Field | Default | Description |
| :--- | :--- | :--- |
| `video0.stabCropPct` | 80 | Stabilization headroom (lower = bigger dead border, more motion absorbed) |
| `video0.stabKalmanQ` | 0.03 | Pan response (`0.001..1.0`; higher = follows slow pans sooner) |
| `video0.stabKalmanR` | 2.0 | **The primary feel knob.** Smoothness (`0.1..50.0`; higher = smoother but laggier) |
| `video0.pauseStab` | — | **live** pause: glides the window/image back to center (`stab`/`stab-fill` only) |

```bash
# Enable stabilization (restart)
curl "http://<ip>/api/v1/set?video0.framing=stab"

# Pause stabilization live
curl "http://<ip>/api/v1/set?video0.pauseStab=1"   # freeze (glide to center)
curl "http://<ip>/api/v1/set?video0.pauseStab=0"   # resume
```

::: info The gyro is no longer needed
The new stabilization works from in-frame motion analysis (Kalman) and **does not use the IMU**. The former BMI270 EIS (`gyroglide`) was removed in 0.8.0.
:::

---

### Resilience: packet-loss resilience

`video0.resilience` selects a resilience profile — intra-refresh (rolling GDR stripe), the SVC-T reference pyramid, and GOP length are all derived from the preset.

::: danger Changing resilience requires a REBOOT
Writing `video0.resilience` persists the value to `/etc/waybeam.json` and returns `{"reboot_required": true}`. **The live pipeline keeps running the previous preset until the next camera start** — the SigmaStar MI kernel module does not survive a live re-configure of these fields (on Star6E it causes a kernel panic, on Maruko it hangs the daemon). Hence the "cold-boot" model.
:::

| Preset | intra-refresh | refPred | GOP | OSD-safe? |
| :--- | :--- | :--- | :--- | :--- |
| `off` | off | off | user-set | yes |
| `rescue` | off | off | 0.25 s (IDR-spam) | yes |
| `quality` | off | off | 4.0 s | yes |
| `sprint` | fast (150 ms) | off | 0.5 s | yes |
| `racing` | fast (150 ms) | off | 2.0 s | yes |
| `endurance` | balanced (500 ms) | off | 2.0 s | yes |
| `patrol` | balanced (500 ms) | off | 4.0 s | yes |
| `rally` | fast (150 ms) | base=1, enhance=1 | 2.0 s | no — "green smear" |
| `range` | balanced (500 ms) | base=1, enhance=4 | 2.0 s | no — "green smear" |
| `fpv` | robust (1000 ms) | base=1, enhance=4 | 2.0 s | no — "green smear" |

```bash
# FPV with an OSD overlay — fast stripe recovery, no SVC-T
curl "http://<ip>/api/v1/set?video0.resilience=racing"
# then reboot the camera to apply
```

::: warning OSD and SVC-T
Presets with `refPred` (`rally`, `range`, `fpv`) can leave a persistent "green smear" over a static OSD until the next IDR. For flights with an OSD overlay use OSD-safe presets (`racing`, `endurance`, `patrol`). Budget +20–30% bitrate for presets with intra-refresh.
:::

---

### ISP Image Quality

<strong>GET /api/v1/iq</strong> — export all ISP parameters:

```bash
curl http://<ip>/api/v1/iq > my_tuning.json
```

<strong>POST /api/v1/iq/import</strong> — import (full or partial):

```bash
# Full import
curl -X POST -H "Content-Type: application/json" \
  -d @my_tuning.json http://<ip>/api/v1/iq/import

# Partial import — specific parameters only
echo '{"lightness":{"value":75},"demosaic":{"fields":{"dir_thrd":30}}}' | \
  curl -X POST -H "Content-Type: application/json" -d @- http://<ip>/api/v1/iq/import
```

<strong>GET /api/v1/iq/set?param=value</strong> — change a single ISP parameter (dot-notation):

```bash
# Set a single field
curl "http://<ip>/api/v1/iq/set?colortrans.y_ofst=200"

# Set an array (comma-separated)
curl "http://<ip>/api/v1/iq/set?colortrans.matrix=23,45,9,1005,987,56,56,977,1015"
```

---

### Common scenario examples

<strong>Quick switch to 720p 90fps</strong>

```bash
curl "http://<ip>/api/v1/set?video0.size=1280x720"
# Wait for reinit...
curl "http://<ip>/api/v1/set?video0.fps=90"
curl "http://<ip>/api/v1/set?video0.bitrate=4096"
```

<strong>Manual white balance (6500K)</strong>

```bash
curl "http://<ip>/api/v1/set?isp.awbMode=ct_manual"
curl "http://<ip>/api/v1/set?isp.awbCt=6500"
```

<strong>Enable ROI encoding for FPV</strong>

```bash
curl "http://<ip>/api/v1/set?fpv.roiEnabled=true"
curl "http://<ip>/api/v1/set?fpv.roiQp=-18"
curl "http://<ip>/api/v1/set?fpv.roiSteps=2"
```

<strong>Enable stabilization (Star6E only)</strong>

```bash
# framing is a restart field; set it first, then fine-tune
curl "http://<ip>/api/v1/set?video0.framing=stab"
curl "http://<ip>/api/v1/set?video0.stabKalmanR=6"
```

---

### Recommended settings by scenario

<strong>FPV racing (minimal latency)</strong>

```json
{
  "video0": {"rcMode":"cbr", "fps":90, "size":"1280x720", "bitrate":6144, "gopSize":0.5, "resilience":"racing"},
  "fpv": {"roiEnabled":true, "roiQp":-12, "roiSteps":2, "roiCenter":0.35},
  "outgoing": {"streamMode":"rtp", "server":"unix://wfb_tx"}
}
```

<strong>FPV freestyle (quality + recording)</strong>

```json
{
  "video0": {"rcMode":"cbr", "fps":60, "size":"1920x1080", "bitrate":8192, "gopSize":1.0},
  "fpv": {"roiEnabled":true, "roiQp":-18, "roiSteps":3, "roiCenter":0.4},
  "record": {"enabled":true, "mode":"dual", "bitrate":20000, "fps":120},
  "outgoing": {"streamMode":"rtp", "server":"unix://wfb_tx"}
}
```

<strong>Long range</strong>

```json
{
  "video0": {"rcMode":"cbr", "fps":30, "size":"1280x720", "bitrate":3072, "gopSize":2.0, "resilience":"range"},
  "fpv": {"roiEnabled":false},
  "outgoing": {"streamMode":"rtp", "server":"unix://wfb_tx"}
}
```

::: tip resilience in the config
`resilience` is applied at cold boot, so in the config file it takes effect immediately. Via the API it requires a camera reboot.
:::

---

### Next steps

- [**Waybeam overview**](/en/software/waybeam-venc) — the full feature list
- [**Install on the camera**](/en/software/waybeam-venc-install-camera) — initial installation
- [**WFB-ng integration**](/en/software/waybeam-venc-install-groundstation) — setting up the WFB link
