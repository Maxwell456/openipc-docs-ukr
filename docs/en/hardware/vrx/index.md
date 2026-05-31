---
title: Receivers (VRX) for OpenFPV
description: Overview of ground stations and receivers for OpenFPV. RunCam RX, Radxa Zero 3W, PixelPilot.
---

# Receivers (VRX)

## Ready-made Solutions

### RunCam WiFiLink‑RX

Ready ground station: Radxa + 2×EU2 boards. Connects to goggles or a monitor via HDMI.

- **Buy:** [shop.runcam.com](https://shop.runcam.com/runcam-wifilink-rx/)
- Minimal latency
- Plug & Play solution

### PixelPilot (Android)

Turns an Android smartphone into a ground station with an RTL8812AU WiFi adapter.

- **Download:** [GitHub releases](https://github.com/OpenIPC/PixelPilot/releases)
- Latency: ~50–70 ms (depends on phone performance)
- **Pros:** cheap, convenient, always with you
- **Cons:** higher latency, depends on the smartphone

## DIY: Radxa Zero 3W Ground Station

A full-featured ground station built yourself.

### Components

| Component | Link | Note |
|-----------|------|------|
| Radxa Zero 3W | [allnetchina.cn](https://shop.allnetchina.cn/collections/rock-3/products/copy-of-radxa-zero-3w?variant=48051150717244) | 2 GB, no eMMC, with header |
| RTL8812AU (×2) | [AliExpress](https://vi.aliexpress.com/item/1005006845799671.html) | 3.3V, up to 40 MHz |
| RTL8812EU2 (×2) | [AliExpress](https://vi.aliexpress.com/item/1005006869601109.html) | 5V, more powerful |
| USB HAT/hub | [AliExpress](https://www.aliexpress.com/item/1005007935543635.html) | For RTL8812EU2 |
| microSD ≥ 64 GB | Samsung Evo Plus | Image ~1.5 GB |
| 25×25 mm fans | [AliExpress](https://www.aliexpress.com/item/1005006523861888.html) | For cooling |
| 4 antennas | — | 2 directional + 2 patch |

### Ready Build Options

**Option 1:** USB‑HAT + 2×RTL8812AU → **227 g** without antennas

**Option 2:** USB‑hub + 2×RTL8812EU → **105 g** without antennas (more compact)

**3D case model:** [thingiverse.com](https://www.thingiverse.com/thing:6680584/files)
