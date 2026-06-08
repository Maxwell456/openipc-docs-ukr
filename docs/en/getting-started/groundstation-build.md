---
title: Building a Radxa Zero 3W ground station for FPV
description: A guide to building a VRX station based on the Radxa Zero 3W — choosing components, power, connecting Wi‑Fi cards
---

#  Ground station: how to build a Radxa yourself

> When we talk about the "Radxa", it looks roughly like this:

<img src="/images/radxa.webp" alt="Radxa Board" width="500px"/>
<br/>
<img src="/images/radxa-pin.webp" alt="Radxa Pinout" width="500px"/>

Components for a Radxa Zero 3W ground station

- **[Radxa Zero 3W](https://shop.allnetchina.cn/collections/rock-3/products/copy-of-radxa-zero-3w?variant=48051150717244)** (2 GB, no eMMC, with header)
- **Wi‑Fi cards (2 pcs.)**
  - [RTL8812AU](https://vi.aliexpress.com/item/1005006845799671.html): compact, cheap, run on 3.3 V, up to 40 MHz
  - [RTL8812EU2](https://vi.aliexpress.com/item/1005006869601109.html): more powerful, require a USB hub and 5 V power
- **BEC (step-down converters)**: 5 V and 3.3 V regulated
- **[USB hub](https://www.aliexpress.com/item/1005007935543635.html)**: to connect multiple cards
- **Micro-USB → USB‑C cable**: for the HAT
- **[microSD card](https://www.itbox.ua/ua/product/Karta_pam_yati_Samsung_Misro-SDXC_memory_card_64GB_C10_UHS-I_R130MB_s_Evo_Plus_SD_MB-MC64KA_EU-p1000286/)**: ≥ 64 GB (image ~1.5 GB + DVR ~1 GB/10 min)
- **[HDMI–mini HDMI cable](https://www.aliexpress.com/item/1005005941468774.html)** or a micro‑HDMI→HDMI adapter
- **3D-printed enclosure** (PETG)
- **[25×25 mm fans](https://www.aliexpress.com/item/1005006523861888.html)**
- **[Buttons / limit switches](https://gfashop.com.ua/ua/p2137785051-mikropereklyuchatel-kontsevoj-kw10.html)** for recording and AP mode
- **XT60 (female) connector** for power
- **Antennas, 4 pcs.** (2 directional + 2 patch, LHCP or RHCP)
- **RP‑SMA extensions / adapters**
 
***Power***

Power can be supplied in two ways:

- Through **Type-C** (`Pow` in the picture)
- Through the **header pins** — supplying **5V at the back**, using dupont cables

***Assembly***

A bit of soldering won't hurt 😉  
Here's how **Ostap** did it:

1. Took an **XT60 connector**
2. Routed power from it to **each BEC separately**

***Power diagram***

> Let me sketch the diagram to the best of my artistic ability:

<img src="/images/shema.webp" alt="Power diagram" width="500px"/>

---

 ***Enclosure + USB hub:***

 🔸 Option 1

> the inner universe with a [USB-HAT](https://arduino.ua/prod2536-4-h-portovii-usb-hub-hat-dlya-raspberry-pi)

<img src="/images/usb-hat.webp" alt="USB HAT" width="500px"/>

***Option 2***

- No BECs needed for **8812EU2** Wi-Fi cards
- You only need to route **USB + power** to each card **from the USB hub**

---

**Examples of an assembled ground station**

- *Option 1*: USB‑HAT + 2×RTL8812AU → 227 g without antennas  
  <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
    <img src="/images/vrx_radxa1.webp" alt="Option 1 — front view" width="400" />
    <img src="/images/vrx_radxa1-1.webp" alt="Option 1 — side view" width="400" />
  </div>  
<br>
- *Option 2*: USB‑hub + 2×RTL8812EU → 105 g without antennas  
  <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
    <img src="/images/vrx_radxa2.webp" alt="Option 2 — front view" width="400" />
    <img src="/images/vrx_radxa2-2.webp" alt="Option 2 — side view" width="400" />
  </div>
The 3D model of the enclosure can be found  - [here](https://www.thingiverse.com/thing:6680584/files)

***Connecting the Wi-Fi cards***

***🟣 8812AU***

<img src="/images/af1.webp" alt="8812AU diagram" width="500px"/>

***🔵 8812EU2***

<img src="/images/eu2.webp" alt="8812EU2 diagram" width="500px"/>
