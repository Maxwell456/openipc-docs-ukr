---
title: Quick Start with OpenIPC for FPV
description: What to buy for FPV based on OpenIPC, how to quickly set up a camera, VRX, and ground station for your first flights
---

# Quick Start

OpenIPC is evolving rapidly, so this documentation will be updated over time:

**Part 1** – what to buy, minimal setup, and fly.<br>
**Part 2** – for enthusiasts who like soldering, 3D printing, and tweaking via SSH.

---

## Part 1: What to buy and fly

VTX (cameras and transmitters)

- **[Runcam Wifi Link v1](vtx/runcamwifilink.md)** – IMX415 + SigmaStar SSC338Q, EU2 module (can be replaced if needed)
- **[Runcam Wifi Link v2](vtx/runcamwifilinkv2.md)** – IMX415 + SSC338Q, EU2 module integrated into the board
- **[EMAX Wyvern Link](vtx/emaxwyvernlink.md)** – Available on AliExpress, suitable for TinyWhoop
- **[OpenIPC Thinker v1 (no Wi‑Fi)](vtx/thinkerv1-nowifi.md)** – Bare board, Wi‑Fi card must be purchased separately (e.g., RTL8812EU2)
- **[OpenIPC Thinker v1 (with Wi‑Fi)](vtx/thinkerv1-withwifi.md)** – Built-in Wi‑Fi transmitter 100 mW (suitable only for TinyWhoop, range up to ~500 m)

Antennas

- UFL connector:  
[Rush Cherry UFL‑LHCP](https://vi.aliexpress.com/item/4000201021654.html)  
Compact antenna for 2–3" drones (2 outputs)
- Polarization: LHCP → LHCP or RHCP → RHCP

VRX (receivers)

- **[RunCam WiFiLink‑RX Digital HD Receiver](https://shop.runcam.com/runcam-wifilink-rx/)** <br>
Turnkey solution: Radxa + 2 EU2 boards <br>
Connects to goggles or monitor
- **Emax Ground Station**<br>
Test samples, not yet available for sale
- **[PixelPilot (Android)](https://github.com/OpenIPC/PixelPilot/releases)**<br>
Turns a smartphone into a ground station (Wi‑Fi adapter RTL8812AU)<br>
Pros: affordable  
Cons: ~50–70 ms latency, depends on phone power
- **[Radxa Zero 3W Hat](https://store.openipc.org/OpenIPC-Bonnet-v1-0-p738525070)**
  - **[Radxa Zero 3W](https://shop.allnetchina.cn/products/copy-of-radxa-zero-3w?variant=48051150717244)** + [USB Hub](https://www.aliexpress.com/item/1005007935543635.html) + [microSD](https://www.itbox.ua/ua/product/Karta_pam_yati_Samsung_Misro-SDXC_memory_card_64GB_C10_UHS-I_R130MB_s_Evo_Plus_SD_MB-MC64KA_EU-p1000286/) + 2 Wi‑Fi cards ([RTL8812EU2](https://vi.aliexpress.com/item/1005006869601109.html) or [RTL8812AU](https://www.aliexpress.com/item/1005006845799671.html)) + 3D‑printed case

---

## Part 2: For DIY enthusiasts

Components for Radxa Zero 3W Ground Station

- **[Radxa Zero 3W](https://shop.allnetchina.cn/products/copy-of-radxa-zero-3w?variant=48051150717244)** (2 GB, no eMMC, with header)
- **Wi‑Fi cards (2 pcs)**
  - [RTL8812AU](https://vi.aliexpress.com/item/1005006845799671.html): compact, cheap, runs on 3.3 V, supports up to 40 MHz
  - [RTL8812EU2](https://vi.aliexpress.com/item/1005006869601109.html): more powerful, requires USB hub and 5 V power supply
- **BECs (voltage regulators)**: 5 V and 3.3 V adjustable
- **[USB HAT / hub](https://www.aliexpress.com/item/1005007935543635.html)**: for connecting multiple cards
- **Micro-USB → USB‑C cable**: for the HAT
- **[microSD card](https://www.itbox.ua/ua/product/Karta_pam_yati_Samsung_Misro-SDXC_memory_card_64GB_C10_UHS-I_R130MB_s_Evo_Plus_SD_MB-MC64KA_EU-p1000286/)**: ≥ 64 GB (image ~1.5 GB + DVR ~1 GB/10 min)
- **[HDMI to mini HDMI cable](https://www.aliexpress.com/item/1005005941468774.html)** or micro‑HDMI to HDMI adapter
- **3D‑printed case** (PETG)
- **[25×25 mm fans](https://www.aliexpress.com/item/1005006523861888.html)**
- **[Push buttons/limit switches](https://gfashop.com.ua/ua/p2137785051-mikropereklyuchatel-kontsevoj-kw10.html)** for recording and AP mode
- **XT60 (female) connector** for power input
- **4 antennas** (2 directional + 2 patch, LHCP or RHCP)
- **RP‑SMA extensions/adapters**

**Examples of assembled ground stations**

- *Option 1*: USB‑HAT + 2×RTL8812AU → 227 g without antennas  
  <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
    <img src="/images/vrx_radxa1.png" alt="Option 1 — front view" width="400" />
    <img src="/images/vrx_radxa1-1.png" alt="Option 1 — side view" width="400" />
  </div>  
<br>
- *Option 2*: USB‑hub + 2×RTL8812EU → 105 g without antennas  
  <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
    <img src="/images/vrx_radxa2.png" alt="Option 2 — front view" width="400" />
    <img src="/images/vrx_radxa2-2.png" alt="Option 2 — side view" width="400" />
  </div>

3D model of the case can be found [here](https://www.thingiverse.com/thing:6680584/files)