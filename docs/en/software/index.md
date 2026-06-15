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

<div class="fpv-cards">
  <a class="fpv-card" href="/en/software/firmware"><span class="fpv-card-t">OpenFPV firmware overview</span><span class="fpv-card-d">Comparison of the available firmware for OpenIPC FPV cameras</span></a>
  <a class="fpv-card" href="/en/software/apfpv"><span class="fpv-card-t">APFPV — beginner's guide</span><span class="fpv-card-d">Simple FPV video transmission over Wi-Fi, no complex configuration</span></a>
  <a class="fpv-card" href="/en/software/apfpv-greg"><span class="fpv-card-t">Greg's APFPV</span><span class="fpv-card-d">A version of APFPV with adaptive bitrate for FPV/GPS drones and planes</span></a>
  <a class="fpv-card" href="/en/software/apalink"><span class="fpv-card-t">APALink</span><span class="fpv-card-d">Dynamic bitrate switching for APFPV</span></a>
</div>

---

## 📡 WFB-NG — digital video link

**WFB-NG** (WiFi Broadcast Next Generation) is the foundation of OpenIPC's digital FPV link: broadcast video transmission without associating to an access point.

<div class="fpv-cards">
  <a class="fpv-card" href="/en/software/wfb-ng"><span class="fpv-card-t">WFB-NG — how it works</span><span class="fpv-card-d">Operating principle, supported hardware and components</span></a>
  <a class="fpv-card" href="/en/software/wfb-ng-config"><span class="fpv-card-t">Configuration & bitrate calculator</span><span class="fpv-card-d">Encryption keys, wifibroadcast.cfg, channel parameters and a bitrate calculator</span></a>
  <a class="fpv-card" href="/en/software/wfb-ng-groundstation"><span class="fpv-card-t">Ground station on Ubuntu</span><span class="fpv-card-d">Installing WFB-NG on Ubuntu 22.04, drivers, startup and link monitoring</span></a>
</div>

---

## 🎥 Waybeam — video encoder

**Waybeam** is a standalone H.265 (HEVC) video encoder and RTP streamer for SigmaStar cameras that replaces Majestic and integrates natively with WFB-NG.

<div class="fpv-cards">
  <a class="fpv-card" href="/en/software/waybeam-venc"><span class="fpv-card-t">Waybeam overview</span><span class="fpv-card-d">Features, supported chips and comparison with Majestic</span></a>
  <a class="fpv-card" href="/en/software/waybeam-venc-install-camera"><span class="fpv-card-t">Install on the camera</span><span class="fpv-card-d">Download, <code>/etc/waybeam.json</code> configuration, first run</span></a>
  <a class="fpv-card" href="/en/software/waybeam-venc-install-groundstation"><span class="fpv-card-t">WFB-ng integration</span><span class="fpv-card-d">Replacing Majestic alongside WFB-ng</span></a>
  <a class="fpv-card" href="/en/software/waybeam-venc-web-interface"><span class="fpv-card-t">Web panel and HTTP API</span><span class="fpv-card-d">Real-time parameter control, ISP tuning, resilience presets</span></a>
</div>

---

## 🖥️ Ground station

Software for the receiving side — decoding and displaying FPV video.

<div class="fpv-cards">
  <a class="fpv-card" href="/en/software/apfpv-gs"><span class="fpv-card-t">Radxa Zero 3W with APFPV</span><span class="fpv-card-d">A ready-made image for receiving FPV video on the Radxa Zero 3W</span></a>
  <a class="fpv-card" href="/en/software/wfb-ng-groundstation"><span class="fpv-card-t">WFB-NG on Ubuntu</span><span class="fpv-card-d">A universal ground station on a PC running Ubuntu</span></a>
</div>

---

## 🌍 QuadroFleet — 4G/LTE platform

**QuadroFleet** is an open modular platform for controlling FPV drones over mobile networks: low-latency video, GPS tracking, secure VPN and OSD.

<div class="fpv-cards">
  <a class="fpv-card" href="/en/software/openipc-4g"><span class="fpv-card-t">QuadroFleet platform overview</span><span class="fpv-card-d">Architecture, features and use cases</span></a>
  <a class="fpv-card" href="/en/software/drone-build"><span class="fpv-card-t">Drone build</span><span class="fpv-card-d">Components and assembly steps for a QuadroFleet drone</span></a>
  <a class="fpv-card" href="/en/software/firmware-build"><span class="fpv-card-t">Build & flash firmware</span><span class="fpv-card-d">Compiling and flashing OpenIPC Firmware for 4G</span></a>
  <a class="fpv-card" href="/en/software/vpn"><span class="fpv-card-t">VPN setup</span><span class="fpv-card-d">WireGuard configuration for secure control</span></a>
  <a class="fpv-card" href="/en/software/map"><span class="fpv-card-t">Map navigation</span><span class="fpv-card-d">Working with the interactive QuadroFleet map</span></a>
  <a class="fpv-card" href="/en/software/update-settings"><span class="fpv-card-t">Updating settings</span><span class="fpv-card-d">Updating the QuadroFleet firmware</span></a>
</div>

---

::: info Looking for hardware?
For information about cameras, VTX or receivers, see the [**Hardware**](/en/hardware/vtx/) section or the [**Getting started**](/en/getting-started/troubleshooting) guide.
:::
