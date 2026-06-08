---
title: RTL8731BU / RTL8733BU — Wi-Fi network card
description: Specifications and pinout of RTL8731BU and RTL8733BU based network cards for FPV systems
---

### RTL873xBU

RTL8731BU and RTL8733BU are very small WiFi chips, so network cards based on them are really compact. Because of that they are extremely popular for **tinywhoop** builds.

::: danger Important
RTL873xBU-based net cards **AREN'T SUITABLE FOR LONG RANGE AND RX USE**.
:::

Supported modes: **5 MHz**, **10 MHz**, **20 MHz**, **40 MHz**.

::: warning Note on 40 MHz mode
40 MHz mode is supported by the driver, but **your** specific card might not support this mode. Please contact the seller before buying.

If you don't receive an image after switching to 40 MHz mode, please read the relevant troubleshooting article.
:::

---

### BL-M8731BU3

**BL-M8731BU3** is one of the most common modules based on the RTL8731BU chip. Its microscopic size makes it ideal for minimalist FPV builds.

---

### Pinout

| Pin | Function  |
|-----|-----------|
| 1   | GND       |
| 2   | NC        |
| 3   | VDD 3.3V  |
| 4   | DM−       |
| 5   | DP+       |
| 6   | GND       |

::: danger Warning
The module operates at **3.3V**! Applying **5V** may damage it.
:::

---

### Specifications

| Parameter          | Value                                                    |
|--------------------|----------------------------------------------------------|
| **Host interface** | USB 2.0                                                  |
| **Power supply**   | DC 3.3V                                                  |
| **Antenna**        | IPEX connector                                           |
| **Power output**   | ≤ 17 dBm (≤ 50 mW) @ 5G / ≤ 21 dBm (≤ 125 mW) @ 2.4G  |
| **Supported modes**| 5 MHz, 10 MHz, 20 MHz, 40 MHz                            |
