---
title: "OpenFPV Software — firmware, video link, encoder"
description: "Software catalog for OpenIPC FPV: camera firmware (APFPV, Greg's, APALink), the WFB-NG digital video link, the Waybeam video encoder, and the QuadroFleet 4G/LTE platform."
---

# OpenFPV Software

This section is a complete catalog of software for **OpenIPC FPV**: from camera firmware and the digital video link to the video encoder and the long-range 4G/LTE platform. The software below is grouped by purpose so you can quickly find the component you need and jump straight to its step-by-step guide.

::: tip Not sure where to start?
If you're new — start with the [**APFPV**](/en/software/apfpv) firmware (the simplest way to transmit FPV video over Wi-Fi), then set up a [**ground station**](/en/software/apfpv-gs).
:::

---

## 📷 Camera firmware

The firmware determines how an OpenIPC camera encodes and transmits video. Pick the option that fits your scenario.

- [**OpenFPV firmware overview**](/en/software/firmware) — comparison of the available firmware for OpenIPC FPV cameras
- [**APFPV — beginner's guide**](/en/software/apfpv) — simple FPV video transmission over Wi-Fi, no complex configuration
- [**Greg's APFPV**](/en/software/apfpv-greg) — a version of APFPV with adaptive bitrate for FPV/GPS drones and planes
- [**APALink**](/en/software/apalink) — dynamic bitrate switching for APFPV

---

## 📡 WFB-NG — digital video link

**WFB-NG** (WiFi Broadcast Next Generation) is the foundation of OpenIPC's digital FPV link: broadcast video transmission without associating to an access point.

- [**WFB-NG — how it works**](/en/software/wfb-ng) — operating principle, supported hardware and components
- [**Configuration & bitrate calculator**](/en/software/wfb-ng-config) — encryption keys, `wifibroadcast.cfg`, channel parameters and an interactive bitrate calculator
- [**Ground station on Ubuntu**](/en/software/wfb-ng-groundstation) — installing WFB-NG on Ubuntu 22.04, drivers, startup and link monitoring

---

## 🎥 Waybeam — video encoder

**Waybeam** is a standalone H.265 (HEVC) video encoder and RTP streamer for SigmaStar cameras that replaces Majestic and integrates natively with WFB-NG.

- [**Waybeam overview**](/en/software/waybeam-venc) — features, supported chips and comparison with Majestic
- [**Install on the camera**](/en/software/waybeam-venc-install-camera) — download, `/etc/waybeam.json` configuration, first run
- [**WFB-ng integration**](/en/software/waybeam-venc-install-groundstation) — replacing Majestic alongside WFB-ng
- [**Web panel and HTTP API**](/en/software/waybeam-venc-web-interface) — real-time parameter control, ISP tuning, resilience presets

---

## 🖥️ Ground station

Software for the receiving side — decoding and displaying FPV video.

- [**Radxa Zero 3W with APFPV**](/en/software/apfpv-gs) — a ready-made image for receiving FPV video on the Radxa Zero 3W
- [**WFB-NG on Ubuntu**](/en/software/wfb-ng-groundstation) — a universal ground station on a PC running Ubuntu

---

## 🌍 QuadroFleet — 4G/LTE platform

**QuadroFleet** is an open modular platform for controlling FPV drones over mobile networks: low-latency video, GPS tracking, secure VPN and OSD.

- [**QuadroFleet platform overview**](/en/software/openipc-4g) — architecture, features and use cases
- [**Drone build**](/en/software/drone-build) — components and assembly steps for a QuadroFleet drone
- [**Build & flash firmware**](/en/software/firmware-build) — compiling and flashing OpenIPC Firmware for 4G
- [**VPN setup**](/en/software/vpn) — WireGuard configuration for secure control
- [**Map navigation**](/en/software/map) — working with the interactive QuadroFleet map
- [**Updating settings**](/en/software/update-settings) — updating the QuadroFleet firmware

---

::: info Looking for hardware?
For information about cameras, VTX or receivers, see the [**Hardware**](/en/hardware/vtx/) section or the [**Getting started**](/en/getting-started/troubleshooting) guide.
:::
