---
title: Waybeam — major documentation update and new features
sidebarTitle: Waybeam (update)
date: 2026-06-12
description: Waybeam update — renamed from venc, H.265-only codec, resilience presets against packet loss, new Kalman stabilization replacing GyroGlide, snapshot channel and new HTTP endpoints.
tags:
  - waybeam
  - FPV encoder
  - OpenIPC
  - SigmaStar
  - WFB-ng
  - resilience
  - H.265
---

# Waybeam — major documentation update and new features

Since the [first announcement](/en/updates/posts/2026-04-16-waybeam-venc) the project has changed significantly. The Waybeam documentation has been brought up to date with the current release — here are the key things SigmaStar camera owners should know.

---

### 🔹 Renamed: `venc` → `waybeam`

The application, binary, config file and init script are now all named **`waybeam`**:

- config — `/etc/waybeam.json` (previously `/etc/venc.json`)
- binary — `/usr/bin/waybeam`
- releases ship as tarballs `waybeam-star6e.tar.gz` / `waybeam-maruko.tar.gz` (binary + config template + libraries)

The old `venc` name only survives in the repository URL `waybeam_venc`.

---

### 🔹 Codec — H.265 (HEVC) only

H.264 support has been **removed**. The codec is hardcoded to H.265; there is no `video0.codec` field anymore. Old configs containing `"codec": "h264"` or `"h265"` load without errors, but the key is ignored. Make sure your receiver (PixelPilot, QGroundControl, ffplay, GStreamer) is configured for H.265.

---

### 🔹 Resilience presets — packet-loss resilience

A single `video0.resilience` knob selects a resilience profile: intra-refresh (rolling GDR stripe), the SVC-T reference pyramid and GOP length are all derived from the preset. Available: `racing`, `endurance`, `patrol`, `fpv`, `range`, `sprint`, `rescue`, `quality` and others.

::: warning Requires a reboot
Changing `resilience` via the API returns `{"reboot_required": true}` and only applies after a camera reboot (the SigmaStar MI kernel module does not survive live changes to these fields). In the config file the preset takes effect immediately at start.
:::

---

### 🔹 New stabilization replacing GyroGlide

The gyroscopic EIS (`GyroGlide`, the `eis` section) was **removed in 0.8.0**. It is replaced by Kalman-filter-based stabilization via the `video0.framing` field:

- `stab` / `stab-fill` — stabilization (Star6E only), **no IMU required**
- `zoom-1.25x` … `zoom-4x` — digital zoom with live panning (both chips)

The BMI270 driver remains, but as a POC consumer for telemetry/sidecar.

---

### 🔹 Other changes

- **Snapshot channel** — a dedicated MJPEG frame via `/api/v1/snapshot.jpg`
- **New HTTP endpoints**: `/api/v1/modes`, `/api/v1/idr/stats`, `/api/v1/transport/status`, `/api/v1/audio/status`
- **Simplified config**: removed `sensor.unlock*` and `isp.exposure`; `isp.legacyAe` replaced by `isp.aeEngine` (`sdk` / `custom`); added `isp.keepAspect`
- **Maruko**: HTTP recording control is unavailable (recording is config-only); some features (stabilization, scene-IDR, `hevc` format) are Star6E-only

---

### 🔹 Updated documentation

- [**Waybeam overview**](/en/software/waybeam-venc) — all features and comparison with Majestic
- [**Install on the camera**](/en/software/waybeam-venc-install-camera) — tarball, `/etc/waybeam.json` config, first run
- [**WFB-ng integration**](/en/software/waybeam-venc-install-groundstation) — replacing Majestic, ground station
- [**Web panel and HTTP API**](/en/software/waybeam-venc-web-interface) — framing, resilience, all endpoints

> **Repository:** [github.com/OpenIPC/waybeam_venc](https://github.com/OpenIPC/waybeam_venc) — MIT license, open source.
