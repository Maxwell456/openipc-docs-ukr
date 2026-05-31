---
title: Radxa Zero 3W with APPFV OpenIPC v0.0.1
description: A ready-made image for streaming FPV video from the Radxa Zero 3W using the APPFV firmware from OpenIPC
---

# Radxa Zero 3W with APPFV OpenIPC v0.0.1

This is a pre-built image for the **Radxa Zero 3W** that lets you stream OpenIPC video using the **APPFV** firmware.

::: warning Warning!
You need to connect a 2.4GHz or 5.8GHz antenna to the UFL port on the Radxa board!
:::

This firmware uses the built-in **AIC8800** Wi-Fi module on the Radxa Zero 3W board and automatically connects to APPFV OpenIPC.

The image is pre-configured to connect to the APPFV firmware's wireless network using the default credentials.

---

### Setup guide

**Step 1.** Download the `.xz` file and unpack it. Write the resulting `.img` image to a microSD card.

**Step 2.** After writing, put the card back into the computer — the `/config` partition will be mounted. Open the `setup.txt` file in a text editor and edit it:

- **Resolution and frame rate:**  
  Specify the format `WxH@fps`, for example:  
  `1920x1080@60`, `1280x720@120`  
  Choose either the maximum supported resolution or frame rate.

- **DVR fps:**  
  ```
  rec_fps=60
  ```
  Set the DVR frame rate to match the camera: 60, 90, 120, etc.

- **GPIO layout:**  
  ```
  layout=Ruby
  ```
  Accepted values: `Ruby`, `Bonnet`, `Runcam`, `Custom`

  The pinout file is in ```/config/scripts/gpio/custom.yaml```

- **For a ground station with MSPOSD:**  
  ```
  osd=ground
  ```

**Step 3.** Connect the antenna (2.4GHz or 5.8GHz), insert the microSD into the Radxa and power it on. If all settings are correct, the `openipc` firmware will start and automatically connect to your camera.

---

### Notes for version 0.0.1

- This is the **first release**. USB Wi-Fi drivers are included but not yet activated.
- All settings are made in a single `setup.txt` file in `/config/`.
- For CLI access: temporarily delete or rename `setup.txt`.
- The GPIO has 2 functions:
  - short press — start/stop DVR recording
  - long press (3+ sec) — enable **AP Mode**
- **AP Mode**:  
  SSID: `OpenIPC GS`  
  Password: `openipcgs`

---

### Accessing the DVR

- **Via the SD card:**  
  Insert the card into a PC — the `/dvr` partition will be mounted
- **In AP mode:**  
  Go to `http://radxa-zero3.local` in your browser
- **Through the home network (Samba):**  
  Connect with login/password:  
  `root/root` or `radxa/radxa`

[⬇️ Download the release from Github](https://github.com/OpenIPC/sbc-groundstations/releases/tag/zero3w-apfpv-v0.0.1)
