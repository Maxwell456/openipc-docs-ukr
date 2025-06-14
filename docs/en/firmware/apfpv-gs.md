---
title: Radxa Zero 3W with APPFV OpenIPC v0.0.1
description: Ready-made image for FPV video streaming from Radxa Zero 3W using OpenIPC's APPFV firmware
---

# Radxa Zero 3W with APPFV OpenIPC v0.0.1

This is a pre-built image for the **Radxa Zero 3W**, enabling OpenIPC video streaming using the **APPFV** firmware.

!!! warning "Attention!"
    You need to connect a 2.4GHz or 5.8GHz antenna to the UFL port on the Radxa board!

This firmware utilizes the **AIC8800** built-in Wi-Fi module on the Radxa Zero 3W board and automatically connects to APPFV OpenIPC.

The image is pre-configured to connect to the APPFV firmware's wireless network using default credentials.

---

### Setup Instructions

**Step 1.** Download the `.xz` file and unpack it. Write the resulting `.img` image to a microSD card.

**Step 2.** After writing, insert the card back into your computer — the `/config` partition will mount. Open the `setup.txt` file in a text editor and edit:

- **Resolution and Frame Rate:**
  Specify the format `WxH@fps`, for example:
  `1920x1080@60`, `1280x720@120`
  Choose either the maximum supported resolution or frame rate.

- **DVR fps:**
```
rec_fps=60
```
Set the DVR frame rate according to your camera: 60, 90, 120, etc.

- **GPIO Layout:**
```
layout=Ruby
```
Accepted values: `Ruby`, `Bonnet`, `Runcam`, `Custom`

Previous pinout file in ```/config/scripts/gpio/custom.yaml```

- **For Ground Station with MSPOSD:**
```
osd=ground
```

**Step 3.** Connect the antenna (2.4GHz or 5.8GHz), insert the microSD into the Radxa, and power it on. If all settings are correct, the `openipc` firmware will start and automatically connect to your camera.

---

### Notes on Version 0.0.1

- This is the **first release**. USB Wi-Fi drivers are included but not yet activated.
- All settings are configured in a single `setup.txt` file in `/config/`.
- To access CLI: temporarily delete or rename `setup.txt`.
- GPIO has 2 functions:
- Short press — start/stop DVR recording
- Long press (3+ sec) — enable **AP Mode**
- **AP Mode**:
SSID: `OpenIPC GS`
Password: `openipcgs`

---

### DVR Access

- **Via SD card:**
Insert the card into a PC — the `/dvr` partition will mount.
- **In AP mode:**
Go to `http://radxa-zero3.local` in your browser.
- **Via home network (Samba):**
Connect via login/password:
`root/root` or `radxa/radxa`


