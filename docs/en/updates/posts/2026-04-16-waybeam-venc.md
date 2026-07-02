---
title: Waybeam Venc — new FPV video encoder
sidebarTitle: Waybeam Venc
date: 2026-04-16
description: waybeam venc — a standalone H.265/H.264 video encoder for SigmaStar cameras with native WFB-ng integration, HTTP API and built-in EIS stabilisation.
tags:
  - waybeam venc
  - FPV encoder
  - OpenIPC
  - SigmaStar SSC338Q
  - WFB-ng
  - H.265
  - EIS
  - GyroGlide
---

# Waybeam Venc — new FPV video encoder

**waybeam venc** is a new standalone open-source (MIT) video encoder for cameras based on **SigmaStar Infinity6E (Star6E / SSC338Q)** and **Infinity6C (Maruko)** chips, fully replacing Majestic for FPV streaming.

---

### 🔹 What's new?

1. **Full replacement of Majestic for WFB-ng:**
   - Native integration via abstract Unix socket (`unix://wfb_tx`) — no UDP overhead
   - Shared Memory support (`shm://`) for maximum performance
   - H.265 (HEVC) and H.264 codec with CBR / VBR / AVBR / FIXQP modes

2. **HTTP API — 84 real-time parameters:**
   - Change bitrate, FPS, resolution, white balance — without restart
   - Built-in web dashboard on port 80: config, API docs, ISP tuning
   - BusyBox wget compatible: all endpoints via GET requests

3. **Gemini mode — streaming + recording simultaneously:**
   - Stream via WFB-ng at low bitrate + record to SD at high quality (up to 20 Mbps, 120 fps)
   - MPEG-TS format: safe on sudden power loss
   - Automatic recording bitrate reduction if the SD card can't keep up

4. **GyroGlide-Lite — gyroscopic image stabilisation (Star6E):**
   - BMI270 IMU with hardware FIFO synchronised to frames
   - Shake compensation via VPE-cropper window shift — no CPU overhead
   - Auto gyroscope calibration on start (2 seconds of stillness)

5. **ROI encoding for FPV:**
   - The centre of the frame is encoded at higher quality — guaranteed sharpness where it matters

---

### 🔹 Supported devices

| Chip | Name | Status |
| :--- | :--- | :--- |
| SigmaStar Infinity6E | Star6E (SSC338Q etc.) | ✅ Full support |
| SigmaStar Infinity6C | Maruko | ✅ Full support |

---

### 🔹 How to get started?

- [**Waybeam Venc overview**](/en/software/waybeam-venc) — all features and comparison with Majestic
- [**Install on camera**](/en/software/waybeam-venc-install-camera) — download binary, configure `/etc/venc.json`, first launch
- [**WFB-ng integration**](/en/software/waybeam-venc-install-groundstation) — replace Majestic, configure ground station
- [**Web panel & HTTP API**](/en/software/waybeam-venc-web-interface) — control via browser and command line

> **Repository:** [github.com/OpenIPC/waybeam_venc](https://github.com/OpenIPC/waybeam_venc) — MIT licence, open source.
