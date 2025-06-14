---
title: Building a Ground Station on Radxa Zero 3W for FPV
description: Guide to building ground station with Radxa Zero 3W
---

# Ground Station: Building Your Own Radxa Setup

> When we talk about Radxa, it looks approximately like this:

<img src="/images/radxa.jpg" alt="Radxa Board" width="500px"/>
<br/>
<img src="/images/radxa-pin.png" alt="Radxa Pinout" width="500px"/>

Components for Radxa Zero 3W Ground Station

- **[Radxa Zero 3W](https://shop.allnetchina.cn/collections/rock-3/products/copy-of-radxa-zero-3w?variant=48051150717244)** (2 GB, no eMMC, with headers)
- **Wi-Fi cards (2 units)**
  - [RTL8812AU](https://vi.aliexpress.com/item/1005006845799671.html): compact, cheap, operates at 3.3V up to 40 MHz
  - [RTL8812EU2](https://vi.aliexpress.com/item/1005006869601109.html): more powerful, requires USB hub and 5V power
- **BEC (voltage regulators)**: 5V and 3.3V adjustable
- **[USB hub](https://www.aliexpress.com/item/1005007935543635.html)**: for multiple card connections
- **Micro-USB → USB-C cable**: for HAT
- **[microSD card](https://www.itbox.ua/ua/product/.../)**: ≥ 64 GB (image ~1.5 GB + DVR ~1 GB/10 min)
- **[HDMI–mini HDMI cable](https://www.aliexpress.com/item/1005005941468774.html)** or micro-HDMI→HDMI adapter
- **3D printed case** (PETG)
- **[25×25 mm fans](https://www.aliexpress.com/item/1005006523861888.html)**
- **[Buttons/switches](https://gfashop.com.ua/ua/p2137785051-mikropereklyuchatel-kontsevoj-kw10.html)** for DVR recording and AP mode
- **XT60 (female) connector** for power input
- **4 antennas** (2 directional + 2 patch, LHCP or RHCP)
- **RP-SMA extension/adapters**

---

**Power Supply**

There are two powering options:

- Via **Type-C** (`Pow` on the diagram)
- Via **header pins** — supplying **5V from the back**, using Dupont cables

---

**Assembly Notes**

A little soldering won’t hurt 😉  
Here’s how **Ostap** did it:

1. Took an **XT60 connector**
2. Wired power from it to **each BEC separately**

---

**Power Wiring Diagram**

> Here's a rough sketch of the power scheme:

<img src="/images/shema.png" alt="Power diagram" width="500px"/>

---

**Case + USB Hub Options**

🔸 **Option 1**  
> Internal setup using [USB-HAT](https://arduino.ua/prod2536-4-h-portovii-usb-hub-hat-dlya-raspberry-pi)

<img src="/images/usb-hat.png" alt="USB HAT" width="500px"/>

---

🔸 **Option 2**  
- No BECs needed for **8812EU2** Wi-Fi cards  
- Just route **USB + power** to each card **from USB hub**

---

**Examples of Assembled Ground Stations**

- *Option 1*: USB-HAT + 2×RTL8812AU → 227 g without antennas  
  <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
    <img src="/images/vrx_radxa1.png" alt="Option 1 — front view" width="400" />
    <img src="/images/vrx_radxa1-1.png" alt="Option 1 — side view" width="400" />
  </div>  
<br>

- *Option 2*: USB hub + 2×RTL8812EU → 105 g without antennas  
  <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
    <img src="/images/vrx_radxa2.png" alt="Option 2 — front view" width="400" />
    <img src="/images/vrx_radxa2-2.png" alt="Option 2 — side view" width="400" />
  </div>

🔗 3D-printable case model available [here](https://www.thingiverse.com/thing:6680584/files)

---

<h3>Wi-Fi Card Wiring</h3>

🟣 8812AU

<img src="/images/af1.png" alt="8812AU wiring" width="500px"/>

---

🔵 8812EU2

<img src="/images/eu2.png" alt="8812EU2 wiring" width="500px"/>
