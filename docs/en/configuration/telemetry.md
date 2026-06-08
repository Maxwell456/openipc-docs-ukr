---
title: VTX MENU
description: VTX Menu for configuring the video transmitter in the OpenIPC FPV system.
---

# VTX MENU

**VTX MENU** is an interactive OSD or CLI-based menu that lets you configure video transmission (VTX) parameters while the device is running — no reflashing or rebooting required.

---

### Main Features

- Channel selection (CH)
- Frequency change (FREQ)
- Transmit power adjustment (TxPower)
- Channel bandwidth toggle
- Encoding selection (LDPC/STBC)
- SD card recording activation
- Transmission profile switching

---

### Installing VTXMenu

1. Install VTXMenu using [Mario Configurator](https://github.com/OpenIPC/configurator/releases).

2. Connect to the camera → Telemetry → Latest YML VTXMENU → press Enter in the command line.

<img src="/images/vtxmenu.webp" alt="vtxmenu_openipc" width="600px"/>

Save and reboot the Air Unit.

---

### How to Enter the Menu

<img src="https://github.com/OpenIPC/msposd/raw/main/pics/vtxmenu.png" alt="" width="600px"/>

**Via OSD:**
- Enable `osd_menu: true` in `majestic.yaml`
- Use the transmitter sticks to navigate the menu (for supported systems)

---

### Example Configuration in `majestic.yaml`

```yaml
osd_menu: true
vtxmenu:
  default_power: 1
  default_bandwidth: 20
  default_mcs: 3
  auto_record: true
```

> The VTX Menu is continuously updated. Check the official OpenIPC repository for the latest documentation.
