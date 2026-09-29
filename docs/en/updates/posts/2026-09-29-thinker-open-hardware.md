---
title: OpenIPC Thinker open hardware — schematics and Gerbers for Thinker338Q and Thinker378
sidebarTitle: Thinker schematics & Gerbers
date: 2026-09-29
description: The OpenIPC Thinker developer published schematics, Gerber files and 3D models for the Thinker338Q (SSC338Q) and Thinker378 (SSC378QE) boards. What's in the repositories, what's missing, and where to find the key components on AliExpress to build your own air unit.
tags:
  - OpenIPC
  - Thinker
  - SSC338Q
  - SSC378QE
  - open hardware
  - Gerber
  - DIY
  - AliExpress
---

# OpenIPC Thinker open hardware: schematics and Gerbers for Thinker338Q and Thinker378

If you've dreamed of building an **OpenIPC air unit yourself** — now you have the chance. The developer of the Thinker boards has published the schematics and PCB fabrication files:

- [**KennyPlus/Thinker338Q**](https://github.com/KennyPlus/Thinker338Q) — the **SigmaStar SSC338Q** board, the same one used in the production [OpenIPC Thinker Air Unit](/en/hardware/vtx/thinkerairunit)
- [**KennyPlus/Thinker378**](https://github.com/KennyPlus/Thinker378) — a new board built on the **SigmaStar SSC378QE** (Infinity6C), already supported by [Waybeam](/en/software/waybeam-venc)

---

### 🔹 Download the files

All files from the repositories can be downloaded straight from our site:

| File | Thinker338Q | Thinker378 |
| --- | --- | --- |
| 📄 Schematic | [PDF, 151 KB](/downloads/thinker/thinker338q-schematic.pdf) | [PDF, 151 KB](/downloads/thinker/thinker378-schematic.pdf) |
| 📦 Gerber + drill | [ZIP, 2 MB](/downloads/thinker/thinker338q-gerber.zip) | [ZIP, 96 KB](/downloads/thinker/thinker378-gerber.zip) |
| 🔝 Board, top | [PDF](/downloads/thinker/thinker338q-top.pdf) | [PDF](/downloads/thinker/thinker378-top.pdf) |
| 🔙 Board, bottom | [PDF](/downloads/thinker/thinker338q-bottom.pdf) | [PDF](/downloads/thinker/thinker378-bottom.pdf) |
| 🧊 3D model (STEP) | [ZIP, 1.6 MB](/downloads/thinker/thinker338q-3d-step.zip) | [ZIP, 1.4 MB](/downloads/thinker/thinker378-3d-step.zip) |
| PCB layers | 6 | 6 |

The STEP model is handy for designing an enclosure or a mount for your frame before you order boards. The originals live in the author's [Thinker338Q](https://github.com/KennyPlus/Thinker338Q) and [Thinker378](https://github.com/KennyPlus/Thinker378) repositories — check them if the author publishes a new board revision.

::: warning What the repositories don't include
There is no **BOM**, no **pick-and-place** file and no editable CAD projects — only PDF, Gerber and STEP. You'll have to build the parts list from the schematic yourself, and a one-click assembled order at JLCPCB/PCBWay isn't possible. The author hasn't specified a license yet either.
:::

---

### 🔹 Key components (from the schematics)

Below are the main ICs and connectors we pulled from the schematics. This is **not a full BOM**: passives (resistors, capacitors, ferrite beads, 24 MHz and 32.768 kHz crystals) are in the PDFs. Some rows link to specific listings, the rest to AliExpress search. Before buying, check the full part number and package against the datasheet and the schematic.

| Component | Purpose | Thinker338Q | Thinker378 | Where to look |
| --- | --- | :-: | :-: | --- |
| **SigmaStar SSC338Q** | SoC (in-package DDR) | ✅ | — | [AliExpress](https://s.click.aliexpress.com/e/_c4mR4sL7) |
| **SigmaStar SSC378QE** | SoC (in-package DDR). The link is an IMX415 + SSC378QE camera module — a chip donor, or a source for the IMX415 camera | — | ✅ | [AliExpress](https://s.click.aliexpress.com/e/_c4XcJzoZ) |
| **W25Q128JVPIQ** | 16 MB SPI NOR flash for firmware | ✅ | ✅ | [AliExpress](https://s.click.aliexpress.com/e/_c3O7yjNb) |
| **TPS54335ADRCR** | Buck DC-DC from 2–6S battery to 5 V (BEC) | ✅ | ✅ | [AliExpress](https://s.click.aliexpress.com/e/_c3QtxZ0D) |
| **SPM4020T-4R7M-LR** | 4.7 µH inductor for the BEC | ✅ | ✅ | [AliExpress](https://www.aliexpress.com/w/wholesale-SPM4020T-4R7M.html) |
| **TPS62065DSGR** | DC-DC for core, DDR and 3.3 V | — | ✅ (×3) | [AliExpress](https://s.click.aliexpress.com/e/_c3y99zEN) |
| **IM6001** | DC-DC for SoC rails | ✅ | — | [AliExpress](https://www.aliexpress.com/w/wholesale-IM6001.html) |
| **RS3236** | LDO regulator | ✅ | ✅ | [AliExpress](https://s.click.aliexpress.com/e/_c2xy0mf7) |
| **BL-M8731BU** ([RTL8731BU](/en/hardware/net-cards/rtl8731bu)) | Onboard Wi-Fi — Tiny variant only, left unpopulated otherwise | opt. | opt. | [AliExpress](https://www.aliexpress.com/w/wholesale-BL-M8731BU.html) |
| **Hirose DF56C-26S-0.3V(51)** | MIPI camera connector, 26 pin | ✅ | ✅ | [AliExpress](https://s.click.aliexpress.com/e/_c2zPIoaD) |
| **JST SM06B-SRSS-TB** | SH 1.0 mm 6-pin connectors (power/UART, Ethernet/UART0) | ✅ | ✅ | [AliExpress](https://www.aliexpress.com/w/wholesale-SM06B-SRSS-TB.html) |
| microSD slot | Video recording | ✅ | ✅ | [AliExpress](https://www.aliexpress.com/w/wholesale-micro-SD-card-socket-push-push.html) |

Everything else for a complete air unit comes from the same places as for the production Thinker:

- **Camera** — IMX335 / IMX415 modules with a MIPI ribbon, see the [Thinker Air Unit page](/en/hardware/vtx/thinkerairunit#cameras)
- **External Wi-Fi card** (if you skip the BL-M8731BU) — [RTL8812AU](/en/hardware/net-cards/rtl8812au) or [RTL8812EU2](/en/hardware/net-cards/rtl8812eu)
- **Heatsink** — the board is 25×25 mm with a 20×20 mm mounting pattern; an aluminium heatsink for that form factor will fit

---

### 🔹 Ordering the boards

1. Download the Gerber archive and check it in a viewer (e.g. the built-in JLCPCB or PCBWay viewer).
2. Order a **6-layer** board. Check the minimum clearances and hole sizes in the drill file to pick a matching process.
3. The SoC is a **high-pin-count QFN** and the DF56C connector has a 0.3 mm pitch — hard to place without a stencil, solder paste and a hot-air station, so add a stencil to the order.
4. Before connecting a battery, check the 5 V, 3.3 V, 1.8 V and core rails for shorts, and do the first power-up from a current-limited bench supply.

::: tip Firmware
The SSC338Q runs the regular OpenIPC FPV firmware, same as the production Thinker — see [camera firmware](/en/software/firmware) and [Thinker firmware update](/en/hardware/vtx/thinkerairunit#firmware-update). For the SSC378QE, see support in [Waybeam](/en/software/waybeam-venc).
:::

::: info This is a DIY build
The files are provided as-is: the author asks you to confirm the board revision and fabrication requirements before ordering. Connector pinouts, wiring and cooling are in the [Thinker Air Unit guide](/en/hardware/vtx/thinkerairunit).
:::
