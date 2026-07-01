---
title: PixelPilot — OpenIPC Ground Station on Android
description: How to turn an Android smartphone into an OpenIPC ground station with PixelPilot — installation, gs.key and channel setup, OSD and DVR recording.
faq:
  - q: "What is PixelPilot?"
    a: "PixelPilot is a free Android app that turns a smartphone into an OpenIPC ground station: it receives video through an external Wi-Fi adapter (WFB-NG) or the drone's Wi-Fi network (APFPV), decodes H.264/H.265, shows OSD telemetry and records DVR."
  - q: "Which Wi-Fi adapter do I need for PixelPilot?"
    a: "The recommended one is RTL8812AU: compact and powered directly over OTG. RTL8812EU2 is more powerful but requires a USB hub with external 5V power."
  - q: "Why is there no video in PixelPilot?"
    a: "Check in order: lens cap removed, gs.key matches the camera, channel and bandwidth are correct (typically 161 / 20 MHz), the adapter gets enough power. Then restart the app and reboot the camera."
  - q: "What is the video latency in PixelPilot?"
    a: "Roughly 50–70 ms — it depends on the smartphone's performance, bitrate and channel congestion. A Radxa-based ground station (PixelPilot_rk) gives lower latency."
---

# PixelPilot — Ground Station on Android

**PixelPilot** is a free open source app that turns an Android smartphone or tablet into a full OpenIPC ground station. It is the cheapest way to start flying: no goggles, no single-board computer — just a phone and a ~$10–15 Wi-Fi adapter.

What PixelPilot does:

- Receives **WFB-NG** video through an external Wi-Fi adapter (OTG)
- Plays the **RTP/UDP stream** from [APFPV](/en/software/apfpv) firmware — no adapter needed, directly over the drone's Wi-Fi
- Decodes **H.264 and H.265**
- Shows **OSD telemetry** (MSP from the flight controller)
- Records **DVR** to phone storage

::: info Two versions of PixelPilot
- **[PixelPilot](https://github.com/OpenIPC/PixelPilot/releases)** — for Android smartphones and tablets (this page)
- **[PixelPilot_rk](https://github.com/OpenIPC/PixelPilot_rk)** — for Rockchip single-board computers (Radxa Zero 3W etc.) with HDMI output; used in [Radxa ground stations](/en/getting-started/groundstation-build)
:::

## What you need

| Component | Requirements |
|---|---|
| Android device | USB OTG support; the faster the CPU, the lower the latency |
| Wi-Fi adapter | [RTL8812AU](/en/hardware/net-cards/rtl8812au) (recommended) or [RTL8812EU2](/en/hardware/net-cards/rtl8812eu) with a powered USB hub |
| OTG cable/adapter | USB-C or micro-USB → USB-A |
| `gs.key` file | Encryption key from the camera (how to get it — [WiFiLink v2 guide](/en/hardware/vtx/runcamwifilinkv2)) |

For APFPV mode you need neither the adapter nor `gs.key` — the phone simply joins the drone's Wi-Fi network.

## Installation

1. Download the latest APK from the [PixelPilot releases page](https://github.com/OpenIPC/PixelPilot/releases)
2. Allow installation from unknown sources (Android will prompt automatically)
3. Install and launch the app

## Setup for WFB-NG

1. Copy the `gs.key` file from the camera to the phone
2. Connect the Wi-Fi adapter over OTG — Android will ask for USB device permission; confirm and open PixelPilot via the popup
3. Tap the gear icon and set:
   - **Channel** — `161` (must match the camera's channel)
   - **Bandwidth** — `20` MHz
4. Add the key: **Gear → WFB-NG → gs.key** → pick the copied file
5. Power on the VTX — video appears within a few seconds

::: tip Channel and bandwidth
`161 / 20 MHz` are the defaults of stock Runcam WiFiLink firmware. If you changed the channel on the camera (via the [VTX Menu](/en/configuration/telemetry) or config), set the same values in PixelPilot.
:::

## Setup for APFPV

1. Power on a drone running [APFPV](/en/software/apfpv) firmware — it creates a Wi-Fi network
2. Connect the phone to that network
3. Open PixelPilot — video appears automatically

## DVR recording

PixelPilot records video to phone storage as MP4. The record button is on the main screen during flight. File size depends on the camera bitrate (roughly ~1 GB per 10 minutes at default settings).

## Troubleshooting

**No video:**

1. ✅ Lens cap removed
2. ✅ `gs.key` on the phone matches the camera's key
3. ✅ Channel and bandwidth are correct (161 / 20 MHz)
4. ✅ Restart PixelPilot
5. ✅ Reboot the camera

**Adapter not detected:**

- Check that the phone supports OTG (the "USB OTG Checker" app)
- RTL8812EU2 may not start without a powered hub — it needs stable 5V
- Try another OTG cable

**Video freezes or high latency:**

- Weak phone CPU — try lowering resolution/bitrate on the camera
- Congested channel — switch to a cleaner one
- Enable [Adaptive-Link](/en/configuration/adaptive-link) for automatic bitrate control

## Useful links

- [PixelPilot on GitHub](https://github.com/OpenIPC/PixelPilot) — code, releases, supported adapter list
- [PixelPilot_rk](https://github.com/OpenIPC/PixelPilot_rk) — the Radxa/Rockchip version
- [Quick Start](/en/getting-started/) — the full starter hardware kit
- [Drone Setup](/en/getting-started/drone) — preparing the camera
