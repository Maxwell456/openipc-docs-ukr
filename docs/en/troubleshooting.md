---
title: Firmware and Recovery of Runcam VRX
description: Step-by-step guide on how to flash or recover Runcam VRX using an SD card and RKDevTool.
---

## How to Flash Runcam VRX Using an SD Card

<div style="text-align:;">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/jAmCpTOFpfY?si=P_2oop5EI2jQZ8eb" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

This is a short guide on how to flash RunCam VRX using an SD card.

**Step 1:** Download the firmware image - <a href="https://github.com/OpenIPC/sbc-groundstations/releases/download/zero3w-v1.9.9/radxa_1-9-9_emmc_flasher.img.xz" target="_blank">Download from GitHub</a> 

**Step 2:** Write the image to the SD card

- Extract the archive with the image.
- Use <a href="https://sourceforge.net/projects/win32diskimager/" target="_blank">Win32 Disk Imager</a> to write the image to the SD card.

**Step 3:** Insert the memory card into RunCam VRX

- Insert the prepared SD card into the slot on the device.
- Connect the battery to the VRX.

**Step 4:** Activate the flashing process

- Push the **"20/40 MHz" button once to the right** on the joystick.

**Step 5:** Completion

- Wait until the flashing is complete (the indicator will stop or the device will reboot).
- Disconnect the battery.
- Remove the SD card.

> ⚠️ Attention: Do not turn off the power during flashing!

---

## How to Recover Runcam VRX After a Failed Flash

If the internal memory (eMMC) was completely erased during a failed firmware flash, the VRX device may not even boot to the command line. But don’t worry — you can easily recover or “unlock” your VRX using this guide.

**Step 1: Prepare the firmware**

- Make sure you have the correct firmware image for your device (Ruby or SBC). It should be a regular image, **NOT** an `emmc_flasher`.
- SBC groundstation - <a href="https://github.com/OpenIPC/sbc-groundstations/releases" target="_blank"><strong>latest releases</strong></a>

**Step 2: Download required tools**

- Download <a href="https://chipsee.com/docs/PCs/ARM/RK3568/Manuals/Software/Buildroot_Linux_Qt_5_15.html" target="_blank"><strong>RKDevTool</strong></a> and the driver from Chipsee’s official website.

**Step 3: Install the driver**

- Before using RKDevTool, install the driver for the device.

<img src="/images/vrx-runcam.png" alt="alink" width="600px"/><br>

**Step 4: Configure RKDevTool**

1. Open the configuration file in the `RKDevTool_Release_v2.93` folder.
2. Change `Selected=1` to `Selected=2` to switch the interface language to English.

<img src="/images/vrx-runcam1.png" alt="alink" width="500px"/><br>

3. Right-click in the program window and choose "Clear items" to clean the list.

<img src="/images/vrx-runcam2.png" alt="alink" width="600px"/><br>

**Step 5: Add the loader**

1. Make sure the file name is `loader`.

<img src="/images/vrx-runcam3.png" alt="alink" width="600px"/>

2. Download the <a href="https://dl.radxa.com/rock3/images/loader/rock-3a/" target="_blank"><strong>loader .bin file</strong></a> from the official Radxa website.

<img src="/images/vrx-runcam4.png" alt="alink" width="600px"/>

3. Right-click in the program and select "Add item" to add the loader file.

<img src="/images/vrx-runcam5.png" alt="alink" width="600px"/>

**Step 6: Add the firmware image**

1. Provide the path to your firmware image.
2. Double-click on the `storage` field and choose `EMMC`.
3. Make sure both items are checked, and that "write by address" is enabled.

<img src="/images/vrx-runcam6.png" alt="alink" width="600px"/>

**Step 7: Switch the VRX to bootloader mode**

1. At the bottom of the device near the HDMI port, locate the small button.
2. Press and hold it using a needle or paperclip.
3. While holding, connect the power to the VRX, wait 2 seconds, then release the button.
4. Connect the VRX to the PC via USB Type-C. The program should detect the device.

<img src="/images/vrx-runcam7.png" alt="alink" width="600px"/>

**Step 8: Start flashing**

1. Click the "Run" button in RKDevTool.
2. Wait until the process completes. Once done, a **Download complete** message will appear.

<img src="/images/vrx-runcam8.png" alt="alink" width="600px"/>

**Step 9: Final Steps**

1. Turn off the power and disconnect VRX from the PC.
2. Turn the device back on. VRX should now boot in normal mode.
