---
title: Quick start with OpenIPC for FPV
description: What to buy for an OpenIPC-based FPV setup and how to quickly configure the camera, VRX and ground station.
---

# Quick start

In OpenIPC everything changes quickly, so this documentation will evolve over time:

**Part 1** – what to buy, minimal setup and get flying.<br>
**Part 2** – for DIY fans who enjoy soldering, 3D printing and tweaking via SSH.

---

## Part 1: What to buy and fly

VTX (cameras and transmitters)

- **[Runcam WiFi Link v1](/en/vtx/runcamwifilink.md)** – IMX415 + SigmaStar SSC338Q, EU2 module (can be replaced if needed)
- **[Runcam WiFi Link v2](/en/vtx/runcamwifilinkv2.md)** – IMX415 + SSC338Q, with integrated EU2 module
- **[EMAX Wyvern Link](/en/vtx/emaxwyvernlink.md)** – available on AliExpress, suitable for TinyWhoop
- **[OpenIPC Thinker v1 (no Wi‑Fi)](/en/vtx/thinkerv1-nowifi.md)** – board only, buy a Wi‑Fi card separately (e.g. RTL8812EU2)
- **[OpenIPC Thinker v1 (with Wi‑Fi)](/en/vtx/thinkerv1-withwifi.md)** – built-in 100 mW Wi‑Fi transmitter (only for TinyWhoop, range up to ~500 m)

Antennas

- UFL connector: [Rush Cherry UFL‑LHCP](https://vi.aliexpress.com/item/4000201021654.html?spm=a2g0o.order_list.order_list_main.52.400d1802RMwysw&gatewayAdapt=glo2vnm) – compact antenna for 2–3" drones (2 ports)
- Polarization: LHCP → LHCP or RHCP → RHCP

VRX (receivers)

- **[RunCam WiFiLink‑RX Digital HD Receiver](https://shop.runcam.com/runcam-wifilink-rx/)**  
  Ready-to-use: Radxa + two EU2 boards  
  Connects to goggles or monitor
- **Emax Ground Station**  
  Test units, not yet for sale
- **[PixelPilot (Android)](https://github.com/OpenIPC/PixelPilot/releases)**  
  Turns a smartphone into a ground station (Wi‑Fi adapter RTL8812AU)  
  Pros: inexpensive  
  Cons: ~50–70 ms latency, depends on phone performance
- **[Radxa Zero 3W Hat](https://store.openipc.org/OpenIPC-Bonnet-v1-0-p738525070)**  
  **[Radxa Zero 3W](https://shop.allnetchina.cn/collections/rock-3/products/copy-of-radxa-zero-3w?variant=48051150717244) + [USB Hub](https://www.aliexpress.com/item/1005007935543635.html?spm=a2g0o.order_list.order_list_main.25.e47318028MlJFF) + [microSD](https://www.itbox.ua/ua/product/Karta_pam_yati_Samsung_Misro-SDXC_memory_card_64GB_C10_UHS-I_R130MB_s_Evo_Plus_SD_MB-MC64KA_EU-p1000286/)** + two network cards ([RTL8812EU2](https://vi.aliexpress.com/item/1005006869601109.html?spm=a2g0o.order_list.order_list_main.162.400d1802RMwysw&gatewayAdapt=glo2vnm) or [RTL8812AU](https://www.aliexpress.com/item/1005006845799671.html?spm=a2g0o.detail.pcDetailTopMoreOtherSeller.4.39a5JzpRJzpRR6&gps-id=pcDetailTopMoreOtherSeller&scm=1007.40000.327270.0&scm_id=1007.40000.327270.0&scm-url=1007.40000.327270.0&pvid=c35349de-3fbe-430e-901e-1a4e47fbe353&_t=gps-id%3ApcDetailTopMoreOtherSeller%2Cscm-url%3A1007.40000.327270.0%2Cpvid%3Ac35349de-3fbe-430e-901e-1a4e47fbe353%2Ctpp_buckets%3A668%232846%238115%232000&pdp_npi=4%40dis%21USD%2110.26%216.98%21%21%2110.26%216.98%21%40210385a817302099432804513e8da5%2112000038495776113%21rec%21UA%21135267971%21XZ&utparam-url=scene%3ApcDetailTopMoreOtherSeller%7Cquery_from%3A&gatewayAdapt=vnm2glo)) + 3D‑printed case

---

## Part 2: DIY ground station

Components for a Radxa Zero 3W ground station

- **[Radxa Zero 3W](https://shop.allnetchina.cn/collections/rock-3/products/copy-of-radxa-zero-3w?variant=48051150717244)** (2 GB, no eMMC, with headers)
- **Wi‑Fi cards (2 pcs.)**  
  - [RTL8812AU](https://vi.aliexpress.com/item/1005006845799671.html?spm=a2g0o.detail.pcDetailTopMoreOtherSeller.4.39a5JzpRJzpRR6&gps-id=pcDetailTopMoreOtherSeller&scm=1007.40000.327270.0&scm_id=1007.40000.327270.0&scm-url=1007.40000.327270.0&pvid=c35349de-3fbe-430e-901e-1a4e47fbe353&_t=gps-id%3ApcDetailTopMoreOtherSeller%2Cscm-url%3A1007.40000.327270.0%2Cpvid%3Ac35349de-3fbe-430e-901e-1a4e47fbe353%2Ctpp_buckets%3A668%232846%238115%232000&pdp_npi=4%40dis%21USD%2110.26%216.98%21%21%2110.26%216.98%21%40210385a817302099432804513e8da5%2112000038495776113%21rec%21UA%21135267971%21XZ&utparam-url=scene%3ApcDetailTopMoreOtherSeller%7Cquery_from%3A&gatewayAdapt=glo2vnm) – compact and cheap, works at 3.3 V up to 40 MHz
  - [RTL8812EU2](https://vi.aliexpress.com/item/1005006869601109.html?spm=a2g0o.order_list.order_list_main.162.400d1802RMwysw&gatewayAdapt=glo2vnm) – more powerful, needs a USB hub and 5 V power
- **BEC step-down converters**: 5 V and 3.3 V adjustable
- **[USB HAT / hub](https://www.aliexpress.com/item/1005007935543635.html?spm=a2g0o.order_list.order_list_main.51.57101802yWFN0z)**: connect multiple cards
- **Micro‑USB → USB‑C cable** for the HAT
- **[microSD card](https://www.itbox.ua/ua/product/Karta_pam_yati_Samsung_Misro-SDXC_memory_card_64GB_C10_UHS-I_R130MB_s_Evo_Plus_SD_MB-MC64KA_EU-p1000286/)**: ≥ 64 GB (image ~1.5 GB + DVR ~1 GB/10 min)
- **[HDMI‑mini HDMI cable](https://www.aliexpress.com/item/1005005941468774.html?spm=a2g0o.order_list.order_list_main.23.400d1802RMwysw)** or micro‑HDMI→HDMI adapter
- **3D‑printed case** (PETG)
- **[25×25 mm fans](https://www.aliexpress.com/item/1005006523861888.html?spm=a2g0o.order_list.order_list_main.5.73271802wmRLX6)**
- **[Buttons/endstops](https://gfashop.com.ua/ua/p2137785051-mikropereklyuchatel-kontsevoj-kw10.html?source=merchant_center&gad_source=1&gbraid=0AAAAAocjCkCAn_4-BLOcSztkOgFpdc2ei&gclid=Cj0KCQjw_JzABhC2ARIsAPe3ynrcIj_3JLcHAqjhgLDiVNFJhSfRCweJMoTWnR3XIouE41VMSRKMJRgaAlJaEALw_wcB)** for recording and AP mode
- **XT60 (female) connector** for power
- **Antennas (4 pcs.)** — two directional and two patch, LHCP or RHCP
- **RP‑SMA extension cables/adapters**

### Example ground stations

- *Option 1*: USB HAT + 2×RTL8812AU → 227 g without antennas
  <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
    <img src="/images/vrx_radxa1.png" alt="Option 1 — front view" width="400" />
    <img src="/images/vrx_radxa1-1.png" alt="Option 1 — side view" width="400" />
  </div>
<br>
- *Option 2*: USB hub + 2×RTL8812EU → 105 g without antennas
  <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
    <img src="/images/vrx_radxa2.png" alt="Option 2 — front view" width="400" />
    <img src="/images/vrx_radxa2-2.png" alt="Option 2 — side view" width="400" />
  </div>
A 3D model of the case can be found [here](https://www.thingiverse.com/thing:6680584/files)

---
