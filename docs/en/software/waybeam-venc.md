---
title: "Waybeam venc — Video encoder for FPV"
description: "Overview of waybeam venc — a standalone H.265/H.264 video encoder and streamer for FPV systems based on SigmaStar Infinity6E and Infinity6C."
---

# Waybeam venc — Video encoder for FPV

**waybeam venc** is a standalone H.265/H.264 video encoder and RTP streamer for cameras on SigmaStar Infinity6E (Star6E) and Infinity6C (Maruko) chips. It was designed specifically for FPV drones with minimal latency and full real-time control via an HTTP API.

::: info Repository
[https://github.com/OpenIPC/waybeam_venc](https://github.com/OpenIPC/waybeam_venc)
:::

---

<h3>Features</h3>

| Feature | Description |
| :--- | :--- |
| **Codecs** | H.265 (HEVC) and H.264 with CBR / VBR / AVBR / FIXQP modes |
| **Streaming** | RTP packetization; Compact UDP mode (raw NAL units without headers) |
| **HTTP API** | Change any of 84 parameters in real time without restarting the stream |
| **Web panel** | Built-in dashboard on port 80: configuration, API docs, ISP tuning |
| **ISP IQ** | 60+ ISP parameters with profile export/import support |
| **Custom 3A** | Built-in AE and AWB with configurable gain limits and tracking |
| **ROI encoding** | Frame-center priority for FPV |
| **High frame rate** | Up to 120 fps for IMX415 / IMX335 |
| **Audio** | Audio capture, G.711 / PCM / Opus codecs |
| **SD recording** | MPEG-TS (HEVC + PCM), power-loss safe |
| **Gemini mode** | Two VENC channels: streaming + recording independently |
| **Adaptive recording bitrate** | Auto-lowers the recording bitrate if the SD card can't keep up (10%/s) |
| **EIS (stabilization)** | GyroGlide-Lite — gyroscopic stabilization (Star6E only) |
| **IMU** | BMI270 support (Star6E only) |

---

<h3>Supported chips</h3>

| Chip | Name | Status |
| :--- | :--- | :--- |
| SigmaStar Infinity6E | Star6E (SSC338Q etc.) | ✅ Full support |
| SigmaStar Infinity6C | Maruko | ✅ Full support |

::: warning Star6E and RTP
On Star6E the `outgoing.streamMode: "rtp"` mode requires the codec `video0.codec: "h265"`.
Maruko supports both codecs: h264 and h265.
:::

---

<h3>Comparison with Majestic</h3>

| | **waybeam venc** | **Majestic** |
| :--- | :--- | :--- |
| **Purpose** | Specialized FPV streamer | General IP camera |
| **HTTP API** | Full, real-time change of all fields | Limited |
| **WFB integration** | Native via Unix socket / UDP | Via UDP |
| **SD recording** | Gemini mode (streaming + recording) | Limited |
| **EIS / IMU** | GyroGlide-Lite (Star6E) | None |
| **ISP tuning** | 60+ parameters in real time | Basic |
| **License** | MIT (open source) | Closed |

---

<h3>Documentation structure</h3>

- [**Install on the camera**](/en/software/waybeam-venc-install-camera) — downloading the binary, configuring `/etc/venc.json`, first run
- [**WFB-ng integration**](/en/software/waybeam-venc-install-groundstation) — replacing Majestic with venc alongside WFB-ng
- [**Web panel and HTTP API**](/en/software/waybeam-venc-web-interface) — configuration via the browser and command line
