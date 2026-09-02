---
title: "Waybeam web panel and HTTP API"
description: "Complete reference for the Waybeam HTTP API — web dashboard, ISP tuning, stabilization, resilience presets, recording and real-time video parameter control."
---

# Web panel and HTTP API

Waybeam includes a built-in web panel and a full HTTP API for real-time parameter control. The web panel is available at `http://<camera-ip>/` (default port — 80) or simply `http://waybeam.local` — the camera announces itself via mDNS. The reference is verified against version **v0.73.3** (late August 2026), API contract **0.22.0**.

---

### Web panel

<strong>Settings tab</strong>

Configuration fields are grouped into **13 built-in sections**:

| Section | Description |
| :--- | :--- |
| System | Port, overclock, logging |
| Sensor | Sensor selection (index / mode) |
| ISP | Exposure (gain/shutter ceilings and floors), AWB, AE engine |
| Image | Mirror, flip, rotate |
| Video | Bitrate, FPS, GOP, QP bounds, `sliceCount`, framing, resilience |
| Outgoing | Streaming, address, mode |
| Discovery | mDNS announcement on the network (`waybeam.local`) |
| Audio | Codec, sample rate, volume |
| FPV | ROI encoding + 3DNR |
| IMU | BMI270 gyro |
| Attitude | Artificial horizon: roll/pitch/yaw from the IMU, mount angles, level trims |
| Detection | NPU object detector: plugin, model, thresholds, OSD boxes |
| Recording | SD card recording |

On top of those 13, the dashboard renders groups that come **straight from `/api/v1/capabilities`**, with no line of `dashboard.html` behind them: **Snapshot** (`snapshot.enabled`, `quality`, `width`, `height`) and **QR** (`qr.tapEnabled`, `tapWidth`, `tapHeight`, `windowMs`) — tooltips included. That is why each chip shows exactly the controls its backend actually services.

**Interface elements:**

- 🟢 **Live** — the parameter changes instantly without a restart
- 🟠 **Restart** — requires a pipeline reinit (automatic)
- 🔴 **Reboot** — requires a full camera reboot (only `video0.resilience`)
- **Apply Changes** — apply all changed fields
- **Save & Restart** — apply changes and restart the pipeline
- **Restore Defaults** — reload the on-disk configuration

::: details For versions before v0.8 — the EIS section (GyroGlide)
Earlier versions had a separate `eis` section (gyroscopic GyroGlide stabilization). It was **removed in v0.8.0**. Stabilization now lives in the Video section — the `video0.framing` field (see [below](#framing-stabilization-and-digital-zoom)).
:::

::: details For versions before v0.40 — 13 sections, no Attitude
The **Attitude** section (live roll/pitch/yaw and the "Capture level trims" button) appeared in the WebUI in **v0.40**. In 0.24–0.39 there were 13 sections, and the BMI270 gyro was listed as a POC with no consumer.
:::

::: details For versions before v0.48/v0.60 — no Detection, Snapshot or QR sections
- **Detection** arrived in **v0.48.0** along with the NPU detector itself.
- **Snapshot** is a card added in **v0.60.0**, when QR capture moved from PGM to the MJPEG channel.
- **QR** is the luma-tap group (`qr.*`), added in **v0.64.0**.
- **v0.49.0** briefly introduced a **Frame size caps** group (`video0.maxIBytes` / `maxPBytes`) — it disappeared in v0.72.0 together with the fields themselves.
- **Adaptive Encoder Control** and **Debug** are no longer rendered as separate sections: the scene-detection fields live under Video, and `debug.showOsd` sits among the system fields.
:::

::: tip Custom dashboard
The built-in web interface can be replaced by dropping your own files into `/usr/share/www` — they take priority over the bundled dashboard.
:::

<strong>API Reference tab</strong>

Documentation for all HTTP endpoints with example responses. Categories: Configuration, Encoder Control, ISP & Image Quality, Recording, Dual-Stream.

<strong>Image Quality (ISP) tab</strong>

Direct access to 62 SigmaStar ISP parameters:

- **Parameters** — collapsible sections with parameter chips
- **Multi-fields** — built-in editor for complex parameters (colortrans, OBC, demosaic, etc.)
- **Export / Import** — save and restore ISP profiles as JSON

::: info IQ on CV610 — a different shape <Badge type="tip" text="v0.65.5+" />
CV610 also serves `/api/v1/iq` and `/api/v1/iq/set`, but in **its own response shape** and with its own set: **11 ISP groups, 59 fields** — saturation, color_tone, noise reduction, sharpen, gamma, exposure and more. Writing a field selects the half of the block it lives in. The DRC and dehaze groups are registered but **bypassed**.

`/api/v1/iq/import` answers `501` on CV610 (advertised in capabilities as `routes.iq_import: false`). Since v0.65.5 the dashboard's IQ tab is driven by the capability feed rather than a hardcoded condition, so it is no longer hidden on CV610.
:::

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
    "app_version": "0.73.3",
    "backend": "star6e",
    "contract_version": "0.22.0",
    "config_schema_version": "0.22.0"
  }
}
```

`backend` now has three possible values: `star6e`, `maruko` and **`cv610`**.

The `contract_version` / `config_schema_version` values grow with releases. The landmarks worth keying scripts off:

| Contract | What changed |
| :--- | :--- |
| `0.11.0` | `video0.frameLost` removed |
| `0.12.0` | attitude API |
| `0.13.0` | new endpoint `/api/v1/live/set` |
| `0.14.0` / `0.15.0` | detector live model swap; detector reached Maruko (SCL port 3) |
| `0.16.0` | **breaking** — `/api/v1/snapshot.pgm` removed (now `404`) |
| `0.18.x` | the CV610 series: control surface, sensor-mode selection, `video0.size`, IQ, QP bounds, resilience and slices |
| `0.19.0` | **breaking** — `outgoing.shmThrottle` and the ring-full recovery IDR removed; frame-shm ring header → v2 |
| `0.20.0` | snapshot and recording reached CV610 |
| `0.21.0` | **breaking** — `video0.maxIBytes` / `maxPBytes` removed |
| `0.22.0` | current: QP bounds on Maruko, `video0.intraRefreshQp` on CV610 |

::: warning `0.18.7` was never a servable contract version
It was staged during review and folded into `0.19.0`. No device reports `contract_version: 0.18.7` — do not match against it in client code.
:::

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

::: warning sensor.mode indices renumbered (v0.21–v0.34)
The mode lineups were rebuilt on both platforms: Maruko in v0.21/v0.23, Star6E in **v0.25–v0.34** (in-tree IMX335/IMX415 drivers). The Star6E lineups are now: IMX335 — 2560×1920@30/60, 2560×1440@90, 2176×1224@100, 1920×1080@120, `1600×900@144`; IMX415 — 5 visible modes from 4K@~33 down to `1728×816@120`. The `sensor.mode` indices were **renumbered several times** along the way, and there are fewer modes than in the stock driver: a persisted index outside the new range keeps waybeam from starting. After upgrading, check old configs against the `/api/v1/modes` list or set `-1` (auto).
:::

::: details v0.21/v0.23 renumbering details (Maruko)
The mode lineups on Maruko were reworked: the IMX415 gained non-binned 16:9 modes at 1485 Mbps (up to `1920×1080@100`), the IMX335 — a best-per-fps lineup (30/50/60/90/100) plus the ultra-low-latency `1536×864@144` (v0.24).
:::

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

Since **v0.64.0** an unknown `video0.resilience` preset lands here too. It previously returned **200**, persisted the bad name to `/etc/waybeam.json`, and left the derived fields (`intra_refresh_*` / `ref_*`) holding the **previous** preset's expansion — so `/api/v1/config` disagreed with the running encoder until the next start, where the disk loader falls back to `"off"` and the operator lands on a preset they never asked for.
:::

<strong>GET /api/v1/live/set?field_name=value</strong> <Badge type="tip" text="v0.50+" />

The same as `/set`, but **without writing to flash**: the value is applied to the running configuration only.

```bash
curl "http://<ip>/api/v1/live/set?video0.bitrate=4096"
```

Built for high-cadence automated writers — waybeam-link's adaptive bitrate, frame-cap and fps actuation. Persisting at controller cadence is bad twice over: it wears the flash, and the camera reboots into the last adaptive transient.

- **Live fields only.** A restart-class field answers `400` ("restart-class field requires persistence; use /api/v1/set") — a pipeline reinit reloads from disk and would silently discard the value.
- Response shapes are **byte-identical** to `/set`. Single- and multi-set are both supported.
- A later persisting `/set` or `/defaults` snapshots the **whole** running config, volatile changes included (one config struct, by design).
- Builds without the endpoint answer `404`: clients probe once and fall back to `/set`. That is exactly what waybeam-link does.

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

Current AWB (auto white balance) state from the ISP. Works on CV610 too since **v0.68.2**.

<strong>GET /api/v1/ae</strong>

Auto-exposure state, including `runtime.active_precrop` (both SigmaStar backends).

<strong>GET /api/v1/intra/status</strong> and <strong>GET /api/v1/resilience/status</strong>

Live state of intra-refresh (rolling GDR) and the selected resilience preset — what is actually programmed into the encoder, not what the config says. Both had been served for several releases but only entered the contract in **0.18.6**; with the CV610 branch (0.18.5) they report live device state.

<strong>GET /api/v1/fps/config</strong> and <strong>GET /api/v1/fps/live</strong>

The configured and the actually delivered frame rate.

```bash
curl http://<ip>/api/v1/idr/stats
curl http://<ip>/api/v1/awb
curl http://<ip>/api/v1/resilience/status
curl http://<ip>/api/v1/fps/live
```

::: info Rate-control writes no longer request an IDR <Badge type="warning" text="v0.69+" />
`video0.bitrate` and `video0.qpDelta` no longer **request an IDR** after applying (Star6E and Maruko; CV610 never did). Measured on an SSC338Q on 23 August: ten live writes spaced 300 ms, counted as IRAP access units in the encoder's own bitstream — `qpDelta` fell from 11 IDRs to 1.

The bitrate path is unchanged **on the wire**, because `MI_VENC_SetChnAttr` emits an IDR by itself and `MI_VENC_RcParam_t` carries no bitrate field, leaving no rate-only actuator to switch to. What the fix does buy there: a bitrate write no longer consumes the shared 100 ms IDR gate (a genuine recovery request arriving inside that window used to be swallowed), and `/api/v1/idr/stats` no longer counts an IDR per bitrate write that the write did not cause.

Bootstrap IDRs (output enable, destination change, live fps rebind, recorder start) **bypass the gate unconditionally** — a receiver that has never seen a parameter set has nothing to start from. They are still counted in `/api/v1/idr/stats` and they re-arm the window.
:::

---

### Stream observability

<strong>GET /api/v1/transport/status</strong>

State of the active video transport. The field set **differs across the three transport kinds**:

| Transport | Fields |
| :--- | :--- |
| `frame-shm://` | ring fields + `ringLowWaterSlots`, `otherDrops` |
| `shm://` | packet-ring fields |
| UDP / Unix | socket subset + `transportDrops` / `packetsSent` |

`badAuDrops` appears on every transport — except CV610, whose stream path has no packet-table validation.

::: warning Fields changed in v0.69.0 <Badge type="danger" text="BREAKING" />
`throttlePermille` and `effectiveBitrateKbps` were **removed** along with the clamp mechanism itself. The `frame-shm` branch gained `ringLowWaterSlots` instead — and **the polarity is inverted**: a **low** number is healthy here (`<= 1`), where `1000` was healthy for the clamp. Read the bitrate straight from `/api/v1/config` → `video0.bitrate`: there is no longer a scaled "effective" rate, because nothing scales it.

`otherDrops` was also added — frames the producer discarded for a reason **other** than a full ring (an oversize or malformed access unit). Only `full_drops` was ever published, so a consumer was structurally blind to those: the frame simply vanished. The two are deliberately separate because they demand opposite responses from a rate controller.
:::

<strong>GET /api/v1/audio/status</strong>

A snapshot of the audio pipeline: whether the library is loaded, capture state, codec, sample rate, channels, Opus initialization. Implemented on CV610 since **v0.65.1** (it answered `501` before, while audio was in fact working).

```bash
curl http://<ip>/api/v1/transport/status
curl http://<ip>/api/v1/audio/status
```

---

### Attitude: artificial horizon from the IMU

Since **v0.39–v0.40** Waybeam estimates the camera orientation (roll/pitch/yaw) from the BMI270 gyro — for an artificial horizon in the ground-station HUD. Requires `imu.enabled=true` and `attitude.enabled=true` (both restart).

<strong>GET /api/v1/attitude</strong> — a live snapshot of the angles (camera frame, mount trims applied):

```bash
curl http://<ip>/api/v1/attitude
```

<strong>GET /api/v1/attitude/calibrate_level</strong> — one-command level calibration: hold the camera still and level for ~1.5 s — the service averages the accelerometer, solves the trims exactly (`attitude.trimRollDeg` / `trimPitchDeg`), persists them and restarts the pipeline:

```bash
curl http://<ip>/api/v1/attitude/calibrate_level
```

Possible errors: **409** — the IMU is disabled or the camera is moving; **501** — on Maruko (the estimator is not wired to that backend's IMU path yet).

`attitude` section fields (all restart):

| Field | Description |
| :--- | :--- |
| `enabled` | Enable the horizon estimator |
| `mountDeg` | Camera mount angle around the lens axis: 0 / 90 / 180 / 270 |
| `invertRoll` / `invertPitch` | Sign inversion |
| `axisFwd` / `axisDown` | Sensor axis remap for boards mounted in a non-standard orientation (any of the 24 axis-aligned ones); defaults `+x` / `+z` |
| `trimRollDeg` / `trimPitchDeg` | Level trims — written by the calibration |

::: info ATTITUDE in the RTP sidecar
With the sidecar enabled (`outgoing.sidecarPort`), the per-frame telemetry gains a 12-byte **ATTITUDE** trailer (roll/pitch/yaw in 0.1° steps, status, IMU sample age) — for HUDs. The sidecar itself is **multi-subscriber** since v0.39: up to 4 receivers at once (5 s TTL per slot), so a HUD subscription no longer hijacks the telemetry from the wfb controller. The trailer is Star6E-only. Since v0.40.1 the estimator drops corrupt IMU samples (NaN/Inf) and never publishes a "frozen" horizon.
:::

In the WebUI, the **Attitude** section shows the angles live (1 Hz poll) and offers a **Capture level trims** button — it calibrates, updates the fields and restarts the pipeline.

---

### Discovery (mDNS)

The camera announces itself on the local network as a `_waybeam-venc._tcp.local` service: a unique `waybeam-<suffix>.local` name (the suffix is the tail of the SigmaStar chip die ID) and, by default, the short `waybeam.local`. The `discovery` section fields are exposed via the API and the WebUI (Discovery section):

```bash
# Announcement state
curl "http://<ip>/api/v1/get?discovery.enabled"

# A custom name instead of waybeam-<suffix>
curl "http://<ip>/api/v1/set?discovery.name=my-drone"

# Disable the short waybeam.local name (useful with several cameras on the network)
curl "http://<ip>/api/v1/set?discovery.bareAlias=false"
```

The full 12-hex serial (die ID) is at `GET /api/v1/config` → `data.device.serial` (read-only). Short-name conflicts between several cameras are resolved automatically per RFC 6762 (IP tiebreak).

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

Since **v0.70.0** `/api/v1/snapshot.jpg` works on **CV610** too — it was the one route that backend was still missing.
:::

::: details For versions before v0.60 — the `/api/v1/snapshot.pgm` endpoint <Badge type="danger" text="REMOVED" />
There used to be a grayscale PGM snapshot at `/api/v1/snapshot.pgm`, used by the QR decoder. **v0.60.0 removed it — it now answers `404`**, and this was not housekeeping: its per-request VPE/SCL tap **could wedge the SoC**. Device-verified: `DisablePort … mhal not return buffer` → an `EnsureInputPortFifoEmpty` storm.

QR scanning now consumes the ordinary `GET /api/v1/snapshot.jpg`, and `qr_decode` reads JPEG natively (built with `-O3` — 1.66× faster end-to-end). The error codes `bad_crop`, `bad_max_dim`, `snapshot_gray_busy` and `snapshot_gray_unsupported` went with it.
:::

---

### NPU object detection <Badge type="tip" text="v0.48+ · Star6E, Maruko" />

Waybeam runs an object detector on the camera's **idle IPU/NPU**. The architecture is pluggable: the model lives in a separate `.so`, so a new model is a config change, not a waybeam rebuild. The result goes out as a **DETECT trailer in the RTP sidecar** (flag `0x10`, on every frame) and as boxes on the debug OSD.

Live fields — enable, hot model swap without dropping the stream, thresholds:

```bash
curl "http://<ip>/api/v1/set?detect.enabled=true"
curl "http://<ip>/api/v1/set?detect.modelPath=/opt/models/sar_person.img"
```

::: warning `detect` and `framing=stab` are mutually exclusive
Both claim the same tap (VPE port1 on Star6E, SCL port3 on Maruko). There is no detection on CV610.
:::

→ **[Full reference: NPU object detection](/en/software/waybeam-detection)** — every `detect` field, the trailer format, tap geometry, `modelId`, history and limitations.

---

### On-board QR scanning <Badge type="tip" text="v0.60+ · Star6E" />

The camera decodes a QR marker out of its own frame through an **overlay-free** luma tap. Endpoints: `GET /api/v1/qr/scan[?ms=N]` (a window that closes itself once a code is found), `/qr/stop`, `/qr/status`, `/qr/tap.pgm`.

```bash
curl "http://<ip>/api/v1/qr/scan?ms=10000"
curl "http://<ip>/api/v1/qr/status"    # payload in data.decode.payload
```

::: danger Pairing itself is NOT implemented yet
Waybeam ships only the transport layer: it returns 16 characters and stops — it **does not interpret, authorize, persist or execute** that payload. The `P`/`C` prefixes reserve types for future pairing and command logic, but that logic is deliberately kept outside the waybeam binary.
:::

→ **[Full reference: on-board QR scanning](/en/software/waybeam-qr)** — the marker format, the pixels-per-module budget, generation, all API responses and port1 priorities.

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
    "elapsed_ms": 25000,
    "droppedFrames": 0,
    "writerPeakDepth": 1,
    "stop_reason": "none"
  }
}
```

<strong>GET /api/v1/recordings</strong> — list the files in `record.dir`; <strong>/recordings/download</strong> and <strong>/recordings/delete</strong> fetch and remove them. Both SigmaStar backends serve these regardless of which one wrote the file.

::: tip Recording works on all three chips <Badge type="tip" text="corrected" />
Both this documentation and the contract itself used to state that HTTP recording control is Star6E-only and that Maruko returns `501`. That was a **stale claim**: Maruko has polled the same start/stop flags ever since it registered `record_http_control_supported(true)`. Contract **0.22.0** corrects the row.

**CV610** gained recording in **v0.70.0** — in `record.mode: "mirror"`, format `ts` with Opus muxed in. `dual` / `dual-stream` need a second VENC channel there, so the request is refused with a warning rather than silently recording channel 0.
:::

::: warning Recording no longer stalls the live stream <Badge type="tip" text="v0.70+" />
Before v0.70 **every backend called the recorder straight from the encode loop**: a `write()` to the SD card stalled the live video path. The writer now runs on **its own thread** on all three backends (thread count 8 → 9 while recording), and `writerPeakDepth` in the status reports the queue depth during rotation.

The same work fixed rotation by `record.maxSeconds` / `maxMB` being **inert on a GDR craft**: rotation needs a stream entry point, and a GDR stream has no natural IDRs — rotation now asks for its own IRAP.

Then a run of fixes in 0.73.1–0.73.3: `/record/status` no longer races the writer thread (it is a coherent snapshot now), a mid-run `record/stop` can no longer stall live video, and `record.mode=dual` on Maruko no longer smashes its own thread stack or forces a keyframe into the **live** stream.
:::

::: info What `droppedFrames` actually counts <Badge type="tip" text="contract 0.20.1" />
It counts **every recording frame that did not reach the file**, not only the ones the queue refused: an access unit with an incomplete `packetInfo` table, or one over the queue's byte cap, never reached the queue at all, and counting only the queue's refusals let those pass silently.

`droppedFrames` and `writerPeakDepth` are **per-recording, not per-process**. Previously the SigmaStar writer outlived any one recording and both counters accumulated for the life of the daemon: a clean recording reported the previous one's drops, and one shed frame poisoned every recording that followed.
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
| `stab` | Stabilization (centered 80% crop) | 1536×864 | both (Maruko since v0.35) |
| `stab-fill` | Stabilization (floating image on a black border) | 1920×1080 | both (Maruko since v0.37) |
| `zoom-1.25x` | Digital zoom 1.25× | 1536×864 | both |
| `zoom-1.50x` | Digital zoom 1.50× | 1280×720 | both |
| `zoom-1.75x` | Digital zoom 1.75× | 1088×608 | both |
| `zoom-2x` | Digital zoom 2× | 960×528 | both |
| `zoom-3x` | Digital zoom 3× | 640×352 | both |
| `zoom-4x` | Digital zoom 4× | 480×256 | both |

::: info "both" means the SigmaStar chips
On **CV610** there is no `video0.framing` field at all — neither stabilization nor digital zoom. Check `/api/v1/capabilities`.
:::

**Digital zoom** shrinks both the crop window and the output resolution — no upscale, no extra link load. Panning inside the zoom is live, via `video0.zoomX` / `video0.zoomY` (∈ [0,1], center 0.5/0.5):

```bash
# Enable 3× zoom (restart)
curl "http://<ip>/api/v1/set?video0.framing=zoom-3x"

# Pan (live) — top-left corner / center
curl "http://<ip>/api/v1/set?video0.zoomX=0.0&video0.zoomY=0.0"
curl "http://<ip>/api/v1/set?video0.zoomX=0.5&video0.zoomY=0.5"
```

**Stabilization** (`stab` / `stab-fill`) uses a Kalman trajectory filter and works on both chips since v0.35/v0.37. Fine-tuning (all restart; re-selecting the preset resets them to defaults, so **set `framing` first, then the overrides**):

| Field | Default | Description |
| :--- | :--- | :--- |
| `video0.stabAccuracy` | `auto` | Motion-detector level: `high` / `medium` / `low` (quality ↔ CPU). `auto` = `high` on Star6E, `low` on the single-core Maruko (v0.36) |
| `video0.stabCropPct` | 80 | Stabilization headroom (lower = bigger dead border, more motion absorbed) |
| `video0.stabKalmanQ` | 0.03 | Pan response (`0.001..1.0`; higher = follows slow pans sooner) |
| `video0.stabKalmanR` | 2.0 | **The primary feel knob.** Smoothness (`0.1..50.0`; higher = smoother but laggier) |
| `video0.pauseStab` | — | **live** pause: glides the window/image back to center (`stab`/`stab-fill` only) |

::: warning Stabilization on Maruko — the CPU cost
The motion detector is SigmaStar's software NEON library, not a hardware block. On the single-core Maruko that is a noticeable CPU share (in `stab-fill` ≈29% of the core at 50 fps with `stabAccuracy=low`). Also, on Maruko `stab-fill` is incompatible with `record.mode: "dual"` — such a request is rejected.
:::

::: details For versions before v0.35/v0.37 — stabilization was Star6E-only
Before v0.35 `stab`, and before v0.37 `stab-fill`, worked only on Star6E: on Maruko the `MI_IVE` detector failed to initialize due to an incompatible vendor library, so the WebUI greyed out the stabilization controls and `/set` rejected the fields. Since v0.35 the Maruko tarball ships a compatible `libmi_ive.so`, and both presets are available on both chips.
:::

```bash
# Enable stabilization (restart)
curl "http://<ip>/api/v1/set?video0.framing=stab"

# Pause stabilization live
curl "http://<ip>/api/v1/set?video0.pauseStab=1"   # freeze (glide to center)
curl "http://<ip>/api/v1/set?video0.pauseStab=0"   # resume
```

::: info Stabilization does not use the gyro
Stabilization works from in-frame motion analysis (Kalman) and **does not use the IMU**. The former BMI270 EIS (`gyroglide`) was removed in 0.8.0. Since v0.39 the gyro feeds a different feature — the [attitude (horizon) estimator](#attitude-artificial-horizon-from-the-imu).
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
| **`ltr`** / `ltr:<N>` | **off (forced)** | enhance=N (1 by default) | **your `gopSize`** | no — "green smear" |

<strong>The `ltr` preset</strong> <Badge type="tip" text="v0.64+" />

The most resilient reference structure this SoC can express: `InRnRnRn…` — **half the frames non-referenced**, so half of all frame losses cost exactly one frame instead of cascading to the next IDR. Unlike `rally` (same 1:1 ratio), `ltr` **preserves your `gopSize`** and forces intra-refresh off — so it can be paired with a long GOP and asymmetric transport FEC: heavy protection on the IDR, light on the rest.

The semantics of `MI_VENC_ParamRef_t.u32Enhance` had to be established **by measurement** (the SDK documents nothing): it is a **period** — exactly one frame in every `enhance + 1` is emitted non-referenced. Measured: `enhance=1` → 50.0% droppable, `4` → 17.6%, `299` → 0.3%. So **smaller is more resilient**: bare `ltr` uses 1, and `ltr:<N>` is strictly less resilient as N grows.

Measured cost at pinned QP 30 on a moving scene: **under 1%** bitrate delta vs `off` (5.62/5.64 vs 5.65/5.68 Mbps, alternating runs).

::: info What else the measurement established
P-frames **always** predict from the previous frame, never from the IDR (frame size is flat across the GOP under motion), and `bEnablePred` is a **no-op** for non-reference marking: `rally` (`pred=true`) and `ltr:1` (`pred=false`) yield identical patterns. The full SigmaStar SDK exposes no long-term-reference, SmartP or GOP-mode API, so an IDR-anchored ("virtual IDR") structure is not achievable on Infinity6E.
:::

```bash
# FPV with an OSD overlay — fast stripe recovery, no SVC-T
curl "http://<ip>/api/v1/set?video0.resilience=racing"

# Maximum resilience with a long GOP + asymmetric FEC
curl "http://<ip>/api/v1/set?video0.resilience=ltr"

# then reboot the camera to apply
```

::: warning OSD and SVC-T
Presets with `refPred` (`rally`, `range`, `fpv`, `ltr`) can leave a persistent "green smear" over a static OSD until the next IDR — `ltr` maximises that condition the hardest. For flights with an OSD overlay use OSD-safe presets (`racing`, `endurance`, `patrol`). Budget +20–30% bitrate for presets with intra-refresh.
:::

---

### Multi-slice H.265 (`video0.sliceCount`) <Badge type="tip" text="v0.66+" />

`video0.sliceCount` (1..32, default `1`, **restart**) splits each picture into several independent slices. The point is spatial concealment: when RF loss goes past the FEC budget, it costs a **frozen region** instead of the whole frame.

| Backend | Since | Details |
| :--- | :--- | :--- |
| Star6E | v0.66.0 | `MI_VENC_SetH265SliceSplit` — the symbol was exported by the shipped library all along but never wired. Asks for `ceil(rows/sliceCount)` CTU rows per slice |
| CV610 | v0.67.0 | 32-pixel LCU-row splitting, early slice output kept disabled |
| Maruko | v0.67.0 | Binds the device-aware ABI in the window between `CreateChn` and `StartRecvPic` |

Picture geometry sets the delivered ceiling. Device-verified: on CV610 (1080p30/60/100) requests 1, 3, 4, 6, 9, 12 and 17 delivered exact VCL-NAL counts; on Maruko at 720p30, requests 1, 4 and 12 were delivered exactly, while 17 and 32 quantized to the picture maximum of **12**.

If several slices are explicitly requested and the ABI cannot be applied or read back, **startup fails** rather than silently shipping a single-slice stream. `sliceCount=1` stays compatible with older libraries.

Frame-SHM publication is untouched: still **one access unit per slot**, now with N slice NALs inside it.

::: details For version v0.66 — an eight-slice ceiling
The first implementation (Star6E only) had a `packetInfo[8]` limit and was documented as "sliceCount 4 is the validated envelope". **v0.67.0** established that this was a misreading: `packetInfo[8]` is **per pack**, while every output path already walks all packs in the access unit. The ceiling was lifted, the shared request range is now 1..32, and device geometry sets the real limit.
:::

---

### Rate control: QP bounds and `qpDelta`

| Field | Mutability | Star6E | Maruko | CV610 |
| :--- | :--- | :--- | :--- | :--- |
| `video0.minQp` / `maxQp` | live | ✅ v0.64 | ✅ **v0.73.0** | ✅ v0.65.6 (P bounds + I ceiling; the I floor is not steerable) |
| `video0.qpDelta` | live | ✅ default **−12** | ✅ default **−12** | ❌ removed in v0.73.0 |
| `video0.intraRefreshQp` | restart | ❌ | ❌ | ✅ v0.73.0 |

```bash
curl "http://<ip>/api/v1/set?video0.minQp=22&video0.maxQp=42"
```

::: warning Default and behaviour changes in v0.73.0
- **`video0.qpDelta` was silently reverted at startup** (#255): applied from venc's own startup path it **logged success without reaching the encoder** — only a live write actually took effect. Fixed.
- **The `qpDelta` default is now `-12`** on Star6E and Maruko (was `0`), to bound the cost of an IDR.
- **`qpDelta` was removed from CV610**: its CBR rate controller stores the value but never acts on it. `video0.intraRefreshQp` — the QP lever for the intra-refresh stripe — replaces it there.
- On Star6E a `minQp > maxQp` request is now **rejected** instead of being written.
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

<strong>Enable stabilization</strong>

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
