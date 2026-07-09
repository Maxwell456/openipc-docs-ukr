---
title: "Waybeam — Video encoder for FPV"
description: "Overview of Waybeam — a standalone H.265 (HEVC) video encoder and RTP streamer for FPV systems based on SigmaStar Infinity6E (Star6E) and Infinity6C (Maruko)."
---

# Waybeam — Video encoder for FPV

**Waybeam** is a standalone H.265 (HEVC) video encoder and RTP streamer for cameras on SigmaStar Infinity6E (Star6E) and Infinity6C (Maruko) chips. It was designed specifically for FPV drones with minimal latency and full real-time control via an HTTP API.

::: info Repository
[https://github.com/OpenIPC/waybeam_venc](https://github.com/OpenIPC/waybeam_venc)

This page is verified against version **v0.24.1** (July 2026).
:::

---

### Features

| Feature | Description |
| :--- | :--- |
| **Codec** | H.265 (HEVC) with CBR / VBR / AVBR / FIXQP modes. The codec is hardcoded — there is no `video0.codec` field |
| **Streaming** | RTP packetization; Compact UDP mode (raw NAL units). Transports: `udp://`, `unix://`, `shm://` |
| **HTTP API** | Real-time parameter tuning without restarting the stream |
| **Web panel** | Built-in dashboard on port 80: configuration, API docs, ISP tuning; a custom dashboard can be dropped into `/usr/share/www` |
| **mDNS discovery** | The camera announces itself on the network: `waybeam.local` + a unique `waybeam-<suffix>.local` (the `discovery` section) |
| **ISP IQ** | 62 ISP parameters with profile export/import support |
| **3A (AE/AWB)** | Star6E: `isp.aeEngine` (`"sdk"` / `"custom"`). Maruko: always the vendor's native AE+AWB with an `fps/3` pacer — ~24% CPU savings at 1080p100, the `aeEngine` field is ignored |
| **ROI encoding** | Frame-center priority for FPV |
| **Loss resilience** | Resilience presets: intra-refresh (rolling GDR) + SVC-T reference pyramid |
| **Framing** | Digital zoom 1.25×–4× (both chips) + `stab` / `stab-fill` stabilization (Kalman, Star6E only) |
| **High frame rate** | Up to 100 fps (IMX415 / IMX335, 1080p) and 144 fps in the `1536×864@144` mode (IMX335, Maruko) |
| **Audio** | Audio capture, Opus / G.711a / G.711µ / PCM codecs |
| **Snapshot** | Dedicated MJPEG channel — frame via `/api/v1/snapshot.jpg` |
| **SD recording** | MPEG-TS (HEVC + audio), power-loss safe |
| **Gemini mode** | Two VENC channels: streaming + recording independently |
| **Adaptive recording bitrate** | Auto-lowers the recording bitrate if the SD card can't keep up (10%/s) |
| **IMU** | BMI270 driver (both chips), disabled by default — a POC for telemetry/sidecar |

::: details For versions before v0.8 — GyroGlide gyroscopic stabilization (the `eis` section)
Older versions had gyroscopic **GyroGlide-Lite** stabilization (the `eis` config section). It was **removed in v0.8.0**. Stabilization is now implemented via a Kalman filter in the `video0.framing` field (`stab` / `stab-fill`, Star6E only) and does not require an IMU. The BMI270 driver remains, but as a POC consumer for telemetry, not for EIS.
:::

---

### Supported chips

| Chip | Backend | Sensors | Status |
| :--- | :--- | :--- | :--- |
| SigmaStar Infinity6E | Star6E | SSC30KQ, SSC338Q | ✅ Full support |
| SigmaStar Infinity6C | Maruko | SSC378QE | ✅ Supported (some features are a subset of Star6E) |

::: info Codec — H.265 only
Waybeam encodes only H.265 (HEVC) on both chips. There is no `video0.codec` field; old configs containing `"codec": "h264"` or `"h265"` load without errors, but the key is ignored.
:::

::: warning Star6E-only features
- `stab` / `stab-fill` stabilization (Maruko lacks the IVE block, so the corresponding WebUI controls are greyed out)
- Scene-change IDR (`video0.sceneThreshold` / `sceneHoldoff`)
- `hevc` recording format (Maruko is `ts` only)
- HTTP-driven recording (`/api/v1/record/start|stop`); on Maruko recording is config-only

Check per-field backend support via `/api/v1/capabilities`.
:::

---

### Comparison with Majestic

| | **Waybeam** | **Majestic** |
| :--- | :--- | :--- |
| **Purpose** | Specialized FPV streamer | General IP camera |
| **HTTP API** | Full, real-time field changes | Limited |
| **WFB integration** | Native via Unix socket / SHM / UDP | Via UDP |
| **SD recording** | Gemini mode (streaming + recording) | Limited |
| **Loss resilience** | Resilience presets (intra-refresh + SVC-T) | Basic |
| **Stabilization / zoom** | Kalman stabilization (Star6E) + digital zoom | None |
| **ISP tuning** | 62 parameters in real time | Basic |
| **License** | MIT (open source) | Closed |

---

### Documentation structure

- [**Install on the camera**](/en/software/waybeam-venc-install-camera) — downloading the tarball, configuring `/etc/waybeam.json`, first run
- [**WFB-ng integration**](/en/software/waybeam-venc-install-groundstation) — replacing Majestic with Waybeam alongside WFB-ng
- [**Web panel and HTTP API**](/en/software/waybeam-venc-web-interface) — configuration via the browser and command line
