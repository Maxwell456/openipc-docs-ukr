---
title: Runcam WiFiLink v2 — Specs and Setup
description: Guide for connecting, configuring and using the Runcam WiFiLink v2 camera for a digital FPV system.
---

# Runcam WiFiLink 2
<img
  src="https://raw.githubusercontent.com/OpenIPC/docs/refs/heads/main/src/assets/images/runcam-wifilink-v2-main-photo.png"
  alt="main photo"
  width="400px"
/>

<h3>Specifications</h3>

- Image Sensor: Sony IMX415
- Field of View (FOV): 160°
- Power Input: DC 9–22V (BEC recommended; direct LiPo connection not recommended)
- Lens Module Size: 19×19 mm (M12), MIPI cable 130 mm (proprietary)
- Mounting Hole Spacing: 25.5×25.5 mm
- Board Size: 30.6×33 mm
- Weight: 30 g (with fan) / 25 g (without fan)
- Antenna Connector: IPEX
- PA Output: 28 dBm (FCC), 20 dBm (CE) / 630 mW (FCC), 100 mW (CE)
- Wi-Fi Chip: Runcam custom RTL8812EU (5, 10, 20 MHz)
- UART: 1
- SoC: SigmaStar SSC338Q
- Firmware: `ssc338q_fpv_openipc_urllc_aio_nor.tgz` ([docs.openipc.org](https://docs.openipc.org/hardware/runcam/vtx/runcam-wifilink-v2/))

<h3>Board Layout</h3>

![Board layout bottom 1](https://raw.githubusercontent.com/OpenIPC/docs/refs/heads/main/src/assets/images/runcam-wifilink-2-motherboard-down-dark.png)
![Board layout bottom 2](https://raw.githubusercontent.com/OpenIPC/docs/refs/heads/main/src/assets/images/runcam-wifilink-2-motherboard-up-dark.png)

<h3>Basic Setup</h3>

<h3>Required Components</h3>

- Flight controller with Betaflight, INAV or Ardupilot firmware
- Runcam WiFiLink 2 and the [PixelPilot](https://github.com/openipc/pixelpilot) app
- RTL8812AU Wi-Fi adapter (included with WiFiLink2-G)
- USB-C OTG adapter (included with WiFiLink2-G)
- Android 13 or 14 smartphone with a powerful CPU
- Internet connection ([docs.openipc.org](https://docs.openipc.org/hardware/runcam/vtx/runcam-wifilink-v2/))

<h3>Hardware Connection</h3>

1. Attach the antennas to the VTX.
2. Connect the 4-pin cable to the UART on the FC (or solder directly), powering from the FC BEC; verify GND↔GND, VCC↔VCC.
3. Insert a formatted microSD card into the slot on the bottom of the VTX (fan on top).
4. Connect the included Ethernet cable to the device. ([docs.openipc.org](https://docs.openipc.org/hardware/runcam/vtx/runcam-wifilink-v2/))

<h3>Getting the `gs.key` File</h3>

1. Insert an empty, formatted microSD card into the VTX (contacts facing the board); disassemble the housing if needed.
2. On first boot the device will create `user` and `gs.key`; copy `gs.key` to your VRX (Android, PC, etc.). ([docs.openipc.org](https://docs.openipc.org/hardware/runcam/vtx/runcam-wifilink-v2/))

<h3>Connecting to Android Ground Station</h3>

1. Install [PixelPilot](https://github.com/openipc/pixelpilot).
2. Copy `gs.key` to your Android device.
3. Connect the RTL8812AU Wi-Fi adapter to Android.
4. Open PixelPilot via the pop-up.
5. Tap the gear icon and set: Channel – 161; Bandwidth – 20.
6. Add `gs.key`: Gear → WFB-NG → gs.key → select the copied file.
7. Power on the VTX.
8. If video does not appear within 30 seconds, restart PixelPilot. If the issue persists:
   - Check the lens cap
   - Verify `gs.key`
   - Restart Android and the VTX ([docs.openipc.org](https://docs.openipc.org/hardware/runcam/vtx/runcam-wifilink-v2/))

<h3>LED Status</h3>

| LED State | Meaning |
|-----------|---------|
| Green off | Audio disabled |
| Green on | Audio enabled |
| Green fast blinking | Firmware update |
| Green slow blinking | Recording |
| Blue on | Booting |
| Blue fast blinking | Wi-Fi error |
| Blue and green alternating | Warning: overheating (> 90 °C) |

<h3>Summary</h3>

After basic setup you will have a modern digital FPV system, but without OSD. To configure OSD see the [Advanced Settings guide](/en/configuration/advanced). For manufacturer instructions see the [official documentation](https://store-m8o52p.mybigcommerce.com).
