---
title: Quick Start with OpenIPC FPV
description: What to buy for OpenIPC FPV, how to quickly set up camera, VRX and ground station for first flights.
faq:
  - q: "What hardware do I need to start with OpenIPC FPV?"
    a: "You need an OpenIPC-compatible camera/VTX (e.g. Runcam WiFiLink v1/v2 or EMAX Wyvern Link) and a VRX ground station. The easiest entry point is a Runcam WiFiLink v1/v2 paired with a smartphone running PixelPilot."
  - q: "What is the video latency of OpenIPC FPV?"
    a: "Latency depends on the firmware: APFPV delivers 40–70 ms, WFB-NG can achieve under 35 ms. A Radxa Zero 3W ground station provides the lowest latency."
  - q: "Is OpenIPC FPV suitable for TinyWhoop?"
    a: "Yes. The EMAX Wyvern Link and OpenIPC Thinker v1 with built-in Wi-Fi (100 mW) are ideal for TinyWhoop builds with a range of up to ~500 m."
  - q: "What is a VRX and which one should I choose as a beginner?"
    a: "VRX is a ground station for receiving video. For beginners, the RunCam WiFiLink‑RX (ready-made) or PixelPilot on Android with an RTL8812AU USB Wi-Fi adapter is the easiest choice."
---

# Quick Start

Everything in OpenIPC changes rapidly, so this documentation will be updated over time.

**Part 1** — what to buy, minimal setup and fly.<br>
**Part 2** — for enthusiasts who love soldering, 3D printing and SSH tweaking.

---

## Part 1: Buy and Fly

### VTX (Cameras & Transmitters)

| Camera | Sensor | Chipset | Note |
|--------|--------|---------|------|
| [Runcam WiFiLink v1](/en/hardware/vtx/runcamwifilink) | IMX415 | SSC338Q + EU2 | Classic solution |
| [Runcam WiFiLink v2](/en/hardware/vtx/runcamwifilinkv2) | IMX415 | SSC338Q | Built-in EU2 |
| [EMAX Wyvern Link](/en/hardware/vtx/) | — | — | AliExpress, TinyWhoop |
| [OpenIPC Thinker v1](/en/hardware/vtx/) | — | — | DIY, separate WiFi card |

### VRX (Ground Stations)

| Option | Description | Latency |
|--------|-------------|---------|
| [RunCam WiFiLink‑RX](https://shop.runcam.com/runcam-wifilink-rx/) | Ready-made: Radxa + 2×EU2 | Minimal |
| [PixelPilot (Android)](https://github.com/OpenIPC/PixelPilot/releases) | Smartphone as GS | ~50–70 ms |
| Radxa Zero 3W DIY | Build yourself | Minimal |

::: tip Easiest start
**RunCam WiFiLink v1/v2** + **PixelPilot on Android** — cheapest and fastest way to get flying.
:::

## Next Steps

- [Drone Setup](/en/getting-started/drone) — connecting to flight controller
- [VRX Setup](/en/getting-started/groundstation) — first ground station launch
- [Troubleshooting](/en/getting-started/troubleshooting) — if something goes wrong
