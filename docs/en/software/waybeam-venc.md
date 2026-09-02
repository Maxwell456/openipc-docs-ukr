---
title: "Waybeam — Video encoder for FPV"
description: "Overview of Waybeam — a standalone H.265 (HEVC) video encoder and RTP streamer for FPV systems based on SigmaStar Infinity6E (Star6E), Infinity6C (Maruko) and HiSilicon Hi3516CV610."
---

# Waybeam — Video encoder for FPV

**Waybeam** is a standalone H.265 (HEVC) video encoder and RTP streamer for cameras on SigmaStar Infinity6E (Star6E), SigmaStar Infinity6C (Maruko) and HiSilicon Hi3516CV610 chips. It was designed specifically for FPV drones with minimal latency and full real-time control via an HTTP API.

::: info Repository
[https://github.com/OpenIPC/waybeam](https://github.com/OpenIPC/waybeam)

This page is verified against version **v0.73.3** (late August 2026), API contract **0.22.0**.
:::

::: warning The repository was renamed
In August 2026 the repository **`waybeam_venc` was renamed to `waybeam`**. The old URL redirects, so existing clones, forks and remotes keep working unchanged. The product, binary, config file (`/etc/waybeam.json`), init script and release tarball are all named simply `waybeam`. The old name still appears in historical documents, source comments, the dashboard's page title and the exported config filename.
:::

---

### Features

| Feature | Description |
| :--- | :--- |
| **Codec** | H.265 (HEVC) with CBR / VBR / AVBR / FIXQP modes. The codec is hardcoded — there is no `video0.codec` field |
| **Streaming** | RTP packetization; Compact UDP mode (raw NAL units). Transports: `udp://`, `unix://`, `shm://`, **`frame-shm://`** (whole frames over shared memory, bypassing RTP) |
| **HTTP API** | Real-time parameter tuning without restarting the stream; a separate **`/api/v1/live/set`** writes to the running config only, sparing the flash |
| **Web panel** | Built-in dashboard on port 80: configuration, API docs, ISP tuning; a custom dashboard can be dropped into `/usr/share/www` |
| **mDNS discovery** | The camera announces itself on the network: `waybeam.local` + a unique `waybeam-<suffix>.local` (the `discovery` section) |
| **ISP IQ** | SigmaStar — 62 ISP parameters with profile export/import; CV610 — 11 groups / 59 fields (its own response shape) |
| **3A (AE/AWB)** | One engine: `isp.aeEngine` accepts **only `"sdk"`**. A supervisory thread on top of it enforces the `isp.gainMin/Max` and `isp.shutterMinUs/MaxUs` limits |
| **ROI encoding** | Frame-center priority for FPV |
| **Loss resilience** | Resilience presets: intra-refresh (rolling GDR) + SVC-T reference pyramid; since v0.64 the **`ltr`** preset (maximum non-reference density with a long GOP) |
| **Multi-slice H.265** | `video0.sliceCount` (1..32) — packet loss costs a frozen region instead of the whole frame (all three backends) |
| **Framing** | Digital zoom 1.25×–4× + `stab` / `stab-fill` stabilization (Kalman) on SigmaStar; detector level via `video0.stabAccuracy` |
| **Object detection (NPU)** | Pluggable detector on the idle IPU/NPU: the `detect` section, a DETECT trailer in the RTP sidecar, boxes on the debug OSD, hot model swap without dropping the stream (Star6E + Maruko) |
| **On-board QR scanning** | Overlay-free luma tap + an isolated `qr_decode` helper: the craft decodes a marker out of its own frame (`/api/v1/qr/scan`) and returns a 16-character envelope. The pairing/command logic on top of it is not implemented yet — Star6E |
| **High frame rate** | IMX335 — up to 144 fps (`1600×900@144` on Star6E, `1536×864@144` on Maruko); IMX415 — up to 120 fps (`1728×816@120`); IMX662 on CV610 — up to 100 fps. In-tree sensor drivers |
| **Audio** | Audio capture, Opus / G.711a / G.711µ / PCM codecs (Opus 48 kHz mono on CV610) |
| **Snapshot** | Dedicated MJPEG channel — frame via `/api/v1/snapshot.jpg` (all three backends) |
| **SD recording** | MPEG-TS (HEVC + audio), power-loss safe; since v0.70 the writer runs on **its own thread**, so recording no longer stalls the live stream |
| **Gemini mode** | Two VENC channels: streaming + recording independently (Star6E and Maruko) |
| **Adaptive recording bitrate** | Auto-lowers the recording bitrate if the SD card can't keep up (10%/s) |
| **IMU** | BMI270 driver (SigmaStar), disabled by default; since v0.39 it feeds the attitude estimator |
| **Attitude (horizon)** | Live roll/pitch/yaw via `GET /api/v1/attitude`, one-command level calibration, ATTITUDE trailer in the RTP sidecar for HUDs (Star6E) |

::: details For versions before v0.8 — GyroGlide gyroscopic stabilization (the `eis` section)
Older versions had gyroscopic **GyroGlide-Lite** stabilization (the `eis` config section). It was **removed in v0.8.0**. Stabilization is now implemented via a Kalman filter in the `video0.framing` field (`stab` / `stab-fill`) and does not require an IMU. The BMI270 driver remains: since v0.39 it feeds the attitude (horizon) estimator for telemetry/HUD, not stabilization.
:::

::: details For versions before v0.47 — `isp.aeEngine` had a `"custom"` value
Star6E's `isp.aeEngine` used to accept two values — `"sdk"` and `"custom"` (a userspace AE) — while Maruko ignored the field entirely after v0.22. It turned out the `cus3a` thread never did AE convergence: the ISP firmware/bin AE always drove it, in both modes. **v0.47.0 removed `"custom"` outright**: only `"sdk"` is accepted, and an old config still carrying `"custom"` loads with a warning and falls back to `sdk`. The supervisory thread stayed, but purely as a limits enforcer — it holds `isp.gainMin/Max` and `isp.shutterMinUs/MaxUs` on top of the stock firmware AE.
:::

::: details For versions before v0.65 — two chips only (SigmaStar)
Until August 2026 Waybeam ran exclusively on SigmaStar: Infinity6E (Star6E) and Infinity6C (Maruko). A third backend — **HiSilicon Hi3516CV610 with the Sony IMX662 sensor** — arrived in **v0.65.0** (13 August 2026) and was brought close to parity over the course of August. If you read this page earlier, the chip table below had two rows.
:::

---

### Supported chips

| Chip | Backend | Sensors | Status |
| :--- | :--- | :--- | :--- |
| SigmaStar Infinity6E | `star6e` | SSC30KQ, SSC338Q | ✅ Full support (the reference backend) |
| SigmaStar Infinity6C | `maruko` | SSC378QE | ✅ Supported (a few features are a subset of Star6E) |
| HiSilicon Hi3516CV610 | `cv610` | Sony IMX662 | 🟡 Streaming, recording, IQ, resilience work; stabilization, detection, QR and attitude do not |

::: info Codec — H.265 only
Waybeam encodes only H.265 (HEVC) on all three chips. There is no `video0.codec` field; old configs containing `"codec": "h264"` or `"h265"` load without errors, but the key is ignored.
:::

::: warning Star6E-only features
- Scene-change IDR (`video0.sceneThreshold` / `sceneHoldoff`)
- `hevc` recording format (Maruko and CV610 are `ts` only)
- QR scanning (`/api/v1/qr/*`; Maruko answers `404`)
- The ATTITUDE sidecar trailer and level calibration (on Maruko `/api/v1/attitude/calibrate_level` returns `501`)
- `/api/v1/dual/set` (Maruko returns `501` — a different venc-channel struct layout)

Check per-field backend support via `/api/v1/capabilities`.
:::

::: warning Not on CV610 yet
- Stabilization and digital zoom (`video0.framing`), object detection, QR, attitude
- `video0.qpDelta` (removed in v0.73.0 — CV610's CBR controller ignores it; use `video0.intraRefreshQp` instead)
- `record.mode: "dual"` / `"dual-stream"` (needs a second VENC channel) — refused with a warning
- `/api/v1/iq/import` (export via `/api/v1/iq` works, but in a different response shape)
:::

::: details For versions before v0.35/v0.37 — stabilization was Star6E-only
Previously `stab` / `stab-fill` stabilization worked only on Star6E, and the corresponding WebUI controls on Maruko were greyed out (the `MI_IVE` detector was believed not to work on that chip). **v0.35** brought `stab` and **v0.37** brought `stab-fill` to Maruko — at feature parity with Star6E; the culprit was an incompatible vendor library, which the tarball now ships. Maruko caveats: the motion detector is software (NEON) and costs a noticeable share of the single core (quality/cost level via `video0.stabAccuracy`, v0.36), and `stab-fill` is incompatible with `record.mode: "dual"`.
:::

::: details For versions before v0.70 — HTTP recording control was believed Star6E-only
The documentation (and the API contract itself) used to state that `/api/v1/record/start|stop` works on Star6E only and that Maruko answers `501`. That was a **stale claim**: Maruko has polled the same start/stop flags ever since it registered `record_http_control_supported(true)`. Contract **0.22.0** corrects the row. From **v0.70.0** recording also reached CV610, in `record.mode: "mirror"`.
:::

---

### Comparison with Majestic

| | **Waybeam** | **Majestic** |
| :--- | :--- | :--- |
| **Purpose** | Specialized FPV streamer | General IP camera |
| **HTTP API** | Full, real-time field changes + a volatile `/live/set` | Limited |
| **WFB integration** | Native via Unix socket / SHM / frame-SHM / UDP | Via UDP |
| **SD recording** | Gemini mode (streaming + recording), writer on its own thread | Limited |
| **Loss resilience** | Resilience presets (intra-refresh + SVC-T + `ltr`) and multi-slice H.265 | Basic |
| **Stabilization / zoom** | Kalman stabilization (SigmaStar) + digital zoom | None |
| **ISP tuning** | 62 parameters in real time | Basic |
| **NPU detection** | Pluggable object detector on the built-in IPU | None |
| **License** | MIT (open source) | Closed |

---

### Documentation structure

- [**Install on the camera**](/en/software/waybeam-venc-install-camera) — downloading the tarball, configuring `/etc/waybeam.json`, first run
- [**WFB-ng integration**](/en/software/waybeam-venc-install-groundstation) — replacing Majestic with Waybeam alongside WFB-ng
- [**Web panel and HTTP API**](/en/software/waybeam-venc-web-interface) — configuration via the browser and command line
- [**NPU object detection**](/en/software/waybeam-detection) — the pluggable detector, the DETECT trailer, hot model swap
- [**On-board QR scanning**](/en/software/waybeam-qr) — the marker format, endpoints, why pairing does not exist yet
