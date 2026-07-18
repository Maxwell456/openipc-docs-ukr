---
title: AI Dual Camera — day + thermal cameras with onboard AI detection
sidebarTitle: AI Dual Camera
date: 2026-07-18
description: A new documentation guide — how to combine a day camera and a thermal camera on a single FPV drone with in-flight switching and onboard object detection (YOLOv8n on the SigmaStar IPU). Ready-made file archive and exact commands.
tags:
  - OpenIPC
  - FPV
  - AI
  - thermal
  - dual camera
  - venc
  - YOLOv8
---

# AI Dual Camera — day + thermal cameras with onboard AI detection

We've added a new guide to the docs — **[AI Dual Camera](/en/software/dual-camera)**: how to combine a **day camera**, a **thermal camera** and **onboard object detection** on a single lightweight FPV drone, switching cameras right in flight.

Both streams are merged into a **single WFB transmitter** via `socat`, and object detection is overlaid on the day camera — the **YOLOv8n** model runs on the SigmaStar hardware **IPU** accelerator (the `venc` streamer instead of Majestic).

---

### 🔹 What's inside the guide

- An **animated diagram** of the flow: two cameras → `socat` → WFB → VRX.
- A **ready-made archive** with all binaries, configs and scripts — downloadable straight from the site.
- **Exact install commands** (PuTTY `plink` / `pscp`), edits to `wifibroadcast`, `S95majestic`, `mavlink.conf`.
- Ground-station setup (gsmenu) and **MAVLink OSD** on the VRX via PixelPilot.

---

### 🔹 The setup in brief

- **Day camera** — OpenIPC on SigmaStar (SSC338Q), stream on port `5500`.
- **Thermal camera** — a USB module via a Raspberry Pi Zero 2W, H.264 over Ethernet on port `5600`.
- **Switching** — `socat` puts only one camera on air at a time; it can be bound to an RC channel.
- **AI detection** — per frame, before encoding, right on the camera.

::: warning For advanced users
This guide is technical and modifies system files on both the camera and the ground station. It's a setup for enthusiasts — test on the ground and proceed at your own risk.
:::

- [**AI Dual Camera — full guide**](/en/software/dual-camera)
