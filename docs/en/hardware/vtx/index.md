---
title: Cameras & VTX for OpenFPV
description: Comparison of supported FPV cameras and video transmitters for OpenIPC — Runcam WiFiLink, Mario AIO, OpenIPC Thinker, EMAX Wyvern Link.
faq:
  - q: "Which OpenIPC camera should I choose to start with?"
    a: "Runcam WiFiLink v1 or v2 is the universal choice: IMX415 sensor, SSC338Q SoC, Wi-Fi up to 800 mW and full out-of-the-box OpenIPC firmware support."
  - q: "Which OpenIPC camera fits a TinyWhoop?"
    a: "EMAX Wyvern Link and OpenIPC Thinker v1 with built-in Wi-Fi (100 mW) are the lightest options for TinyWhoop, with a range of up to ~500 m."
  - q: "What is the difference between Thinker v1 with and without Wi-Fi?"
    a: "The version with built-in Wi-Fi (100 mW) is meant for close-range flying like TinyWhoop. The version without Wi-Fi uses an external RTL8812EU2 card and suits DIY builds with longer range."
---

# Cameras & VTX

Supported cameras and video transmitters for the OpenFPV system. All run OpenIPC firmware.

## Comparison Table

| Model | Sensor | SoC | WiFi / power | Weight | Best for |
|---|---|---|---|---|---|
| [Runcam WiFiLink v1](runcamwifilink) | IMX415 | SSC338Q | BL-M8812EU2, up to 800 mW | ~30 g | All-round pick ✅ |
| [Runcam WiFiLink v2](runcamwifilinkv2) | IMX415 | SSC338Q | Built-in EU2 | ~28 g | All-round pick ✅ |
| [Mario AIO](marioaio) | — | SSC338Q | Built-in | Light | Compact AIO builds |
| [Thinker Air Unit](thinkerairunit) | IMX335 / IMX415¹ | SSC338Q | Base: external · Tiny: RTL8731BU | — | DIY, flexible config |
| [Thinker v1 (with WiFi)](thinkerv1-withwifi) | separate¹ | SSC338Q | Built-in 100 mW | — | TinyWhoop (~500 m) |
| [Thinker v1 (no WiFi)](thinkerv1-nowifi) | separate¹ | SSC338Q | External RTL8812EU2 | — | DIY builds |
| [EMAX Wyvern Link](emaxwyvernlink) | — | — | Built-in | Very light | TinyWhoop, 1S–2S |

¹ The sensor module (IMX335 / IMX415) is purchased separately.

::: tip Not sure which to pick?
For most users — **Runcam WiFiLink v1/v2** (ready camera+VTX, IMX415). For TinyWhoop — the light **Thinker v1 (with WiFi)** or **EMAX Wyvern Link**. For custom builds — the modular **Thinker Air Unit**.
:::

## Firmware

All cameras use OpenIPC firmware. Use [Multiconfigurator](/en/configuration/multiconfigurator) for updates.
