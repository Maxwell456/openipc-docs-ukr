---
title: Network Cards for OpenFPV
description: RTL8812EU, RTL8812AU, RTL8812BU — selection and setup of WiFi cards for FPV ground stations.
faq:
  - q: "Which Wi-Fi card should I choose for an OpenIPC ground station?"
    a: "RTL8812AU is the most common choice for DIY ground stations: compact, powered from 3.3V, and connects directly to a Radxa Zero 3W without a USB hub."
  - q: "What is the difference between RTL8812EU2 and RTL8812AU?"
    a: "RTL8812EU2 is more powerful but needs 5V power and a USB hub — it is the card used in the RunCam WiFiLink-RX. RTL8812AU is simpler to wire and cheaper."
  - q: "Do I need to install drivers for the Wi-Fi cards?"
    a: "No. Drivers for RTL8812AU/EU2/BU are already included in the ground station firmware images for Radxa Zero 3W — no manual installation needed."
---

# Network Cards & Drivers

## Comparison

| Card | Voltage | Frequency | Notes |
|------|---------|-----------|-------|
| **RTL8812AU** | 3.3V | up to 40 MHz | Compact, affordable, fits Radxa HAT |
| **RTL8812EU2** | 5V | up to 40 MHz | More powerful, requires USB hub |
| **RTL8812BU** | 5V | up to 40 MHz | Alternative to EU2 |

## RTL8812AU

The most common choice for DIY ground stations.

- [Buy on AliExpress](https://vi.aliexpress.com/item/1005006845799671.html)
- Connects directly to Radxa Zero 3W (no hub needed)
- Compatible with the Radxa Zero 3W HAT

## RTL8812EU2

More powerful option, requires a USB hub and 5V power.

- [Buy on AliExpress](https://vi.aliexpress.com/item/1005006869601109.html)
- Used in the RunCam WiFiLink-RX

## Driver Installation

Drivers are already included in the firmware images for Radxa Zero 3W. Manual installation is not required.
