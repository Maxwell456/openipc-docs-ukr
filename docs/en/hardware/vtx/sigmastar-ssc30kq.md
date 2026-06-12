---
title: SSC30KQ + IMX335 Camera — Specs, Video Modes and OpenIPC Flashing
description: Full guide to the OpenIPC camera on SigmaStar SSC30KQ with the Sony IMX335 sensor — video modes, latency, connector pinout and step-by-step flashing for lightweight FPV builds
---
# SSC30KQ + IMX335 Camera

<img src="/images/ssc30kq.jpg" alt="OpenIPC FPV camera on SigmaStar SSC30KQ" width="420" height="356"/>

**SSC30KQ** is a budget single-core SoC from SigmaStar — essentially a cut-down [SSC338Q](/en/hardware/vtx/sigmastar-ssc338q) (1 core instead of 2). Paired with the 5 MP **Sony IMX335** sensor, it became one of the most popular options for **light and cheap OpenIPC FPV cameras**: a ready-made module (e.g. Anjoy MCL12 / L12B) costs around **$11**.

Thanks to its low power draw and small weight, the SSC30KQ is a great fit for **compact drones, whoops and 4G/LTE builds** ([QuadroFleet](/en/software/openipc-4g)). The bigger [SSC338Q](/en/hardware/vtx/sigmastar-ssc338q) handles 4K and peak performance, while the SSC30KQ is all about **minimum cost and weight**.

::: tip In short
- **Cheap** (~$11 for a ready module) and **light** — for small builds
- The **IMX335** sensor does up to **1080p\@60** and even **720p\@120** for smooth video
- Latency around **80 ms** (1080p\@60) and **60 ms** (720p\@60)
:::

## Specifications

| Parameter | Value |
|---|---|
| **SoC** | SigmaStar SSC30KQ, ARM Cortex-A7 (1 core) |
| **Sensor** | Sony IMX335, 1/2.8″, 5 MP, Starlight (low-light) |
| **Encoding** | H.265 / H.264, audio embedded in the stream |
| **Bitrate (FPV)** | from ~15 Mbit/s H.265 (depends on settings) |
| **Latency** | ~80 ms (1080p\@60), ~60 ms (720p\@60) |
| **Network** | Ethernet 100 Mbps |
| **Wi-Fi** | via external USB adapter ([network cards](/en/hardware/network-cards)) |
| **Flash** | NOR 8/16 MB or NAND (depending on version) |
| **Power** | DC 5V or 12V (board-dependent) |
| **OpenIPC support** | Yes (FPV, Majestic, WFB-NG) |

## IMX335 video modes

The IMX335 driver in OpenIPC supports several modes — trade resolution for smoothness:

| Resolution | Frame rate | Use case |
|---|---|---|
| 1920×1080 | 60 fps | maximum detail |
| 1600×904 | 80 fps | balance of clarity and smoothness |
| 1424×800 | 100 fps | fast flying |
| 1280×720 | 120 fps | maximum smoothness, racing |

::: info Higher FPS = lower latency
For dynamic flight, 720p\@120 feels much "crisper" than 1080p\@60, even though the resolution is lower.
:::

## Connector pinout

<img src="/images/ssc30kq-pinout.jpg" alt="OpenIPC SSC30KQ camera connector pinout" width="420" height="420"/>

Typical connector pinout of an OpenIPC IP camera (verify against the markings of your exact board):

| Group | Contacts |
|---|---|
| **LAN / Ethernet** | TX+ (1), TX− (2), RX+ (3), RX− (6) |
| **Power** | GND, +12V |
| **Audio** | GND, In, Out |
| **Alarm** | GND, In |
| **LEDs** | Green+, Amber+ |
| **Other** | IRC (IR-cut), D/N (day/night) |

::: warning Before flashing
Flashing needs the **UART (RX / TX / GND)** contacts. On many SSC30KQ boards these are exposed as separate pads — locate them by the `RX`/`TX`/`GND` markings.
:::

## How to flash OpenIPC firmware

1. **Download the firmware** for SSC30KQ from the [OpenIPC builder releases](https://github.com/OpenIPC/builder/releases/tag/latest) — look for files like `openipc.ssc30kq-nor-fpv.tgz` (for NOR flash) or `...-nand-...` (for NAND).
2. **Flash the camera** one of two ways:
   - over **UART** — see the detailed [UART flashing guide](/en/configuration/uart-flash);
   - or with the [Multiconfigurator](https://github.com/OpenIPC/openipc-configurator/releases) (easier).
3. For the **APFPV** firmware (direct Wi-Fi, no ground station) see the [APFPV guide](/en/software/apfpv).

::: danger Caution
Do not cut power during flashing — it can brick the camera.
:::

## SSC30KQ or SSC338Q?

| | **SSC30KQ** | **SSC338Q** |
|---|---|---|
| Cores | 1 | 2 |
| Sensor | IMX335 (5 MP) | IMX415 (8 MP) |
| Max video | 1080p\@60 / 720p\@120 | up to 4K |
| Weight / price | lower | higher |
| For | light and budget builds | maximum quality |

➡️ If you want it light and cheap — **SSC30KQ**. If you want the best image — [**SSC338Q + IMX415**](/en/hardware/vtx/sigmastar-ssc338q).

## Useful links

- [SSC30KQ SoC on openipc.org](https://openipc.org/cameras/vendors/sigmastar/socs/ssc30kq)
- [OpenIPC firmware releases](https://github.com/OpenIPC/builder/releases/tag/latest)
- [SSC338Q + IMX415 camera](/en/hardware/vtx/sigmastar-ssc338q)
- [UART flashing](/en/configuration/uart-flash)
