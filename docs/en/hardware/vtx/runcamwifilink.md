---
title: Runcam WiFiLink v1 — Specs and Setup
description: Guide for connecting, basic setup and use of the Runcam WiFiLink v1 camera for a digital FPV system.
---

# Runcam WiFiLink 1
<img src="/images/runcam_wifilink-v1.webp" alt="Runcam WiFiLink v1" width="400" height="400"/>

---

### Specifications

| Parameter | Value |
|-----------|-------|
| Image Sensor | IMX415 |
| Field of View | FOV 160° |
| Power Input | DC 9–30V (BEC recommended. Avoid direct LiPo connection) |
| Lens Module Size | 19×19 mm / M12 lens / MIPI cable 200/130 mm (MIPI cable is proprietary — contact manufacturer if damaged) |
| Mounting Hole Spacing | 25.5×25.5 mm |
| Board Size | 30×30 mm (338Q), 32×32 mm (WiFi) |
| Weight | 30 g |
| Antenna Connector | IPEX |
| PA Output | 29 dBm (800 mW) |
| WiFi Chip | BL-M8812EU2 (5 MHz, 10 MHz, 20 MHz) |
| UARTs | 1 |
| SoC | SigmaStar SSC338Q |
| Firmware | ssc338q_fpv_openipc_urllc_aio_nor.tgz |

### Board Layout

**Motherboard (top)**

![Board layout top](/images/wifilinkv1.webp)

**Motherboard (bottom)**

![Board layout bottom](/images/wifilinkv1-1.webp)

---

### Basic Setup

> For advanced configuration see [Advanced Settings](/en/configuration/advanced).

### Required Components

- Flight controller with Betaflight, INAV or Ardupilot firmware
- Runcam WiFiLink 1 and the [Pixelpilot](https://github.com/Runcam-PixelPilot) app
- RTL8812AU Wi-Fi adapter (included with WiFiLink-G)
- USB-C OTG adapter (included with WiFiLink-G)
- Modern Android 13 or 14 smartphone (with powerful CPU for minimal latency)
- Internet connection

### Hardware Preparation

1. Attach the antennas to the Runcam.
2. Connect the 4-pin cable to the UART on the flight controller designated for digital VTX (see image), or solder directly to the UART on the FC. **Note**: wire colors may only match on one end — verify GND to GND, VCC to VCC, etc.
3. Insert a formatted microSD card into the Runcam slot (located on the bottom under the fan).
4. Connect the included Ethernet cable to the device.

### Getting the gs.key

1. Insert an empty, formatted microSD card into the Runcam (contacts facing the board). You may need to disassemble the housing.
2. On first boot the device will create `user` and `gs.key` files. Remove the card and copy `gs.key` to your VRX (Android, PC, etc.).

### Connecting to Android GS

1. Install the Pixelpilot app.
2. Copy the `gs.key` file to your smartphone.
3. Connect the RTL8812AU Wi-Fi adapter to your smartphone.
4. Launch Pixelpilot when the pop-up appears.
5. Tap ⚙️ (gear) and set:
   - **Channel**: 161
   - **Bandwidth**: 20
6. Select WFB-NG → **gs.key** and choose the copied file.
7. Power on the VTX.

**If video does not appear within 30 seconds:**
- Restart Pixelpilot
- Check the lens cap
- Verify the `gs.key` file
- Restart both the smartphone and the VTX

### Summary

After basic setup you will have access to an affordable digital FPV system. OSD is displayed by default on the AIR Unit — to configure OSD on the VRX see [OSD Configuration](/en/configuration/telemetry). For the official manufacturer guide see [Runcam documentation](https://store-m8o52p.mybigcommerce.com/product_images/img_runcam_wifilink/runcam-wifilink-manual-en.pdf).
