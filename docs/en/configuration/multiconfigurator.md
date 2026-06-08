---
title: "Updating via Multiconfigurator"
description: "Guide for updating firmware using the OpenIPC configurator"
faq:
  - q: "How do I update OpenIPC firmware using Multiconfigurator?"
    a: "Download the OpenIPC Multiconfigurator, connect to your device, open the 'Firmware' section, select your device and start flashing. Make sure the drone has stable power before flashing."
  - q: "What should I do if the device failed to flash?"
    a: "If the blue Connect button does not appear within 5 minutes, the flash failed. Follow the UART recovery guide to restore the device."
  - q: "How do I factory reset OpenIPC without reflashing the firmware?"
    a: "Run the firstboot command via SSH or terminal. This restores factory settings without reinstalling the firmware."
---

# Updating via Multiconfigurator

1. **Make sure you have a stable connection to your device (Air Unit).**

2. **If you only need a full factory reset without a firmware update:**

   Simply run the command:
   `firstboot`
   This will restore the device to factory settings without reinstalling the firmware.

3. **If you need to update the device:**

   Download the official [OpenIPC Multiconfigurator](https://github.com/OpenIPC/openipc-configurator/releases/).

4. **Open the "Firmware" section and select your device.**

<img src="/images/multiconf2.webp" alt="multiconf" width="1000px"/>

::: warning Warning!
Always check the drone's power supply quality before starting the flash process!
If power is cut during flashing you may **brick** your device.
:::

5. **Wait a few minutes** until a ping to the device appears (blue "Connect" button in the configurator).

6. **If no connection appears within 5 minutes:**

::: warning Warning!
**The device did not flash.**
:::

Proceed to the recovery guide: [General UART Flashing Guide](/en/configuration/uart-flash)
