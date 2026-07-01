---
title: FAQ — Frequently Asked Questions about OpenIPC FPV
description: Answers to the most common OpenIPC questions — what to buy, which firmware to pick, how to reduce latency and what to do when there is no video.
faq:
  - q: "What is OpenIPC?"
    a: "OpenIPC is open source firmware that turns ordinary IP cameras into digital FPV systems. It is free, has no regional locks and runs on a wide range of hardware — from Runcam WiFiLink to fully DIY builds."
  - q: "How much does an OpenIPC FPV system cost?"
    a: "A minimal kit starts at ~$60–100: a camera from ~$40 (e.g. OpenIPC Thinker) plus an Android smartphone with a Wi-Fi adapter as the ground station. A kit with a Runcam WiFiLink v2 and a DIY Radxa ground station runs about $150–250."
  - q: "What hardware should I buy to get started?"
    a: "The simplest proven kit: a Runcam WiFiLink v1/v2 camera and either a RunCam WiFiLink-RX or an Android smartphone with the PixelPilot app and an RTL8812AU adapter."
  - q: "Which firmware should I pick — APFPV or WFB-NG?"
    a: "APFPV is for beginners: the drone creates a Wi-Fi network you simply join with your phone. WFB-NG is for experienced users: lower latency (down to ~35 ms), longer range and a more robust link, but a more involved setup."
  - q: "What is the video latency of OpenIPC?"
    a: "It depends on firmware and settings: APFPV — 40–70 ms, WFB-NG — from ~35 ms. Resolution, bitrate, channel bandwidth and ground station performance all affect latency."
  - q: "Can I watch FPV video on my phone?"
    a: "Yes. The PixelPilot Android app receives video from OpenIPC cameras through a Wi-Fi adapter (WFB-NG) or directly over the drone's Wi-Fi network (APFPV), shows OSD telemetry and records DVR."
  - q: "Which Wi-Fi adapters are supported?"
    a: "The most common are RTL8812AU (simple, 3.3V powered), RTL8812EU2 (more powerful, needs 5V and a USB hub) and RTL8731BU (compact, close-range only). Drivers are already included in ground station images."
  - q: "What is Adaptive-Link and do I need it?"
    a: "Adaptive-Link automatically adjusts bitrate and transmitter power based on signal quality — up close the picture is as sharp as possible, at the edge of range the link does not drop. For long-range flying it is definitely worth enabling."
  - q: "How do I update the camera firmware?"
    a: "Over SSH with the sysupgrade command (from the internet or local files) or with the OpenIPC Configurator. Before updating, have a recovery plan: a rescue SD card or a UART adapter."
  - q: "No video on the ground station. What should I check?"
    a: "The most common causes: gs.key mismatch between camera and ground station, different channel or bandwidth, an unsupported Wi-Fi adapter or insufficient adapter power. Check them one by one, then reboot both sides."
  - q: "The camera does not respond over SSH. How do I recover access?"
    a: "The default camera address is 192.168.1.10 (root/12345). If ping fails, connect through a UART adapter: it gives console access even when the network is down."
  - q: "How do I flash or recover a Runcam VRX?"
    a: "Flashing — with the emmc_flasher image from an SD card. Recovery after a failed flash — with RKDevTool in loader mode (service button next to HDMI + USB Type-C to a PC)."
  - q: "Why is OpenIPC better than DJI or Walksnail?"
    a: "Price, openness and flexibility: no power or region locks, any compatible hardware, a ground station built from anything. It trades away simplicity: it is a kit you assemble and configure yourself."
  - q: "Is OpenIPC suitable for TinyWhoop?"
    a: "Yes. EMAX Wyvern Link and OpenIPC Thinker v1 with built-in Wi-Fi (100 mW) weigh next to nothing and give up to ~500 m of range — enough for indoor and park flying."
  - q: "Where can I get help if something does not work?"
    a: "In Ukrainian Telegram communities (e.g. «Є-дрон»), the official OpenIPC Telegram chat and on the OpenIPC GitHub. Links are collected on the Links page."
---

# Frequently Asked Questions (FAQ)

Answers to the questions beginners and experienced OpenIPC users ask most often. Every answer links to a detailed guide.

[[toc]]

## General

### What is OpenIPC?

**OpenIPC** is open source firmware that turns ordinary IP cameras into digital FPV systems. It is free, has no regional locks and runs on a wide range of hardware — from off-the-shelf [Runcam WiFiLink](/en/hardware/vtx/runcamwifilink) to fully DIY builds.

→ Comparison with DJI, Walksnail and HDZero — [on a dedicated page](/en/getting-started/comparison).

### How much does an OpenIPC FPV system cost?

A minimal kit starts at **~$60–100**: a camera from ~$40 plus an Android smartphone with a Wi-Fi adapter as the ground station. A kit with a [Runcam WiFiLink v2](/en/hardware/vtx/runcamwifilinkv2) and a DIY ground station on a [Radxa Zero 3W](/en/hardware/vrx/radxa-zero-3w) — roughly $150–250.

### Why is OpenIPC better than DJI or Walksnail?

Price, openness and flexibility: no power or region locks, any compatible hardware, a ground station built from anything — a phone, a Radxa, a laptop. It trades away simplicity: it is a kit you assemble and configure yourself. Detailed comparison — [here](/en/getting-started/comparison).

## Hardware

### What hardware should I buy to get started?

The simplest proven kit:

- **Camera**: [Runcam WiFiLink v1/v2](/en/hardware/vtx/runcamwifilinkv2) — the universal choice
- **Ground station**: [RunCam WiFiLink-RX](/en/hardware/vrx/runcam-rx) (ready-made) or an Android smartphone with [PixelPilot](/en/software/pixelpilot) and an RTL8812AU adapter

A full breakdown of the options — in the [Quick Start](/en/getting-started/).

### Is OpenIPC suitable for TinyWhoop?

Yes. [EMAX Wyvern Link](/en/hardware/vtx/emaxwyvernlink) and [OpenIPC Thinker v1 with Wi-Fi](/en/hardware/vtx/thinkerv1-withwifi) (100 mW) weigh next to nothing and give up to ~500 m of range — enough for indoor and park flying.

### Which Wi-Fi adapters are supported?

The most common:

| Adapter | Notes |
|---|---|
| [RTL8812AU](/en/hardware/net-cards/rtl8812au) | Simple, 3.3V, connects to a Radxa directly |
| [RTL8812EU2](/en/hardware/net-cards/rtl8812eu) | More powerful, needs 5V and a USB hub |
| [RTL8731BU](/en/hardware/net-cards/rtl8731bu) | Compact, close-range only |

Drivers are already included in ground station images — [network cards overview](/en/hardware/network-cards).

### Can I watch FPV video on my phone?

Yes. The [PixelPilot](/en/software/pixelpilot) Android app receives video from OpenIPC cameras through a Wi-Fi adapter (WFB-NG) or directly over the drone's Wi-Fi network (APFPV), shows OSD telemetry and records DVR.

## Firmware & configuration

### Which firmware should I pick — APFPV or WFB-NG?

- **[APFPV](/en/software/apfpv)** — for beginners: the drone creates a Wi-Fi network you simply join with your phone. Minimal setup.
- **[WFB-NG](/en/software/wfb-ng)** — for experienced users: lower latency (down to ~35 ms), longer range and a more robust link, but a more involved setup.

### What is the video latency of OpenIPC?

It depends on firmware and settings: APFPV — 40–70 ms, WFB-NG — from ~35 ms. Resolution, bitrate, channel bandwidth and ground station performance all affect latency. Parameter tuning — in the [WFB-NG configuration](/en/software/wfb-ng-config).

### What is Adaptive-Link and do I need it?

[Adaptive-Link](/en/configuration/adaptive-link) automatically adjusts bitrate and transmitter power based on signal quality — up close the picture is as sharp as possible, at the edge of range the link does not drop. For long-range flying it is definitely worth enabling.

### How do I update the camera firmware?

Over SSH with the [sysupgrade](/en/configuration/upgrading-firmware) command (from the internet or local files) or with the [OpenIPC Configurator](/en/configuration/multiconfigurator). Before updating, have a recovery plan: a rescue SD card or a [UART adapter](/en/configuration/uart-flash).

## Troubleshooting

### No video on the ground station. What should I check?

The most common causes, in order:

1. `gs.key` mismatch between camera and ground station
2. Different channel or bandwidth (e.g. 161 / 20 MHz)
3. Unsupported Wi-Fi adapter or insufficient adapter power
4. Lens cap removed? 🙂

After checking, reboot both sides.

### The camera does not respond over SSH. How do I recover access?

The default camera address is `192.168.1.10` (login `root`, password `12345`). If ping fails, connect through a [UART adapter](/en/configuration/uart-flash): it gives console access even when the network is down.

### How do I flash or recover a Runcam VRX?

Flashing — with the `emmc_flasher` image from an SD card. Recovery after a failed flash — with RKDevTool in loader mode. A step-by-step guide with photos — [here](/en/getting-started/troubleshooting).

## Community

### Where can I get help if something does not work?

- Ukrainian Telegram communities — e.g. [Є-дрон](https://t.me/e_drones)
- The [official OpenIPC chat](https://t.me/OpenIPC) on Telegram (in English)
- [OpenIPC GitHub](https://github.com/OpenIPC) — issues and discussions

All verified resources are collected on the [Links](/en/links) page.
