---
title: Mario AIO
description: Connection, setup and firmware update guide for the OpenIPC Mario AIO module for FPV.
---

# OpenIPC Mario AIO

<img src="/images/mario.jpg" alt="" width="400px"/>

**OpenIPC Mario AIO** is a compact module for a digital FPV system that combines a camera, a transmitter (VTX) and a system-on-chip (SoC). It is designed for use in drones and other FPV projects, providing high image quality and low video latency.

---

### Key specifications

<table style="width:100%; border-collapse: collapse; margin: 15px 0;">
  <thead>
    <tr>
      <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Specification</th>
      <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">Board size</td>
      <td style="padding: 8px; border: 1px solid #ddd;">30×32 mm</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">Mounting holes</td>
      <td style="padding: 8px; border: 1px solid #ddd;">4× M2</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">Heatsink holes</td>
      <td style="padding: 8px; border: 1px solid #ddd;">20×20 mm</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">Power</td>
      <td style="padding: 8px; border: 1px solid #ddd;">2S–6S LiPo</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">BEC output (RF)</td>
      <td style="padding: 8px; border: 1px solid #ddd;">5V up to 3A</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">BEC output (MSIC)</td>
      <td style="padding: 8px; border: 1px solid #ddd;">5V up to 2A</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">Interfaces</td>
      <td style="padding: 8px; border: 1px solid #ddd;">UART, USB, Ethernet</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">SD card support</td>
      <td style="padding: 8px; border: 1px solid #ddd;">Yes</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">Cooling</td>
      <td style="padding: 8px; border: 1px solid #ddd;">Built-in heatsink and fan</td>
    </tr>
  </tbody>
</table>


<img src="https://github.com/user-attachments/assets/ad675599-61ce-4cec-a9bf-5933d907c53a" alt="" width="600px"/>


---

### Power and connection

- Powered by a 2S–6S battery
- For low voltage (2S–3S) it is recommended to connect **4 power wires** through a separate connector — more current is required.
- For 4S and above you can use the standard **2-wire** connection.
- To lower the minimum supply voltage to ~5.4 V you **can remove two resistors** on the board.

---

### UART pads and entering U-Boot

To enter U-Boot boot mode (debug mode) use the UART:  
**R0 / T0** — pads on the top of the board.

---

### LED indicators

- **Red blinking** — battery power is on
- **Red solid** — Ethernet/USB connection
- **Blue blinking** — RF transmitter active
- **Green** — TBD (not implemented or changing)

---

<img src="https://github.com/user-attachments/assets/e10e6671-553f-4840-aacd-16816be0813b" alt="" width="600px"/>

---

### Connecting to the flight controller

To connect the Mario AIO to a flight controller (e.g. SpeedyBee F405 WING) use the following connections:

- **GND** → GND on the controller
- **VCC** → VCC (check voltage compatibility)
- **RX** → TX on the controller
- **TX** → RX on the controller

>⚠️ Before powering on, make sure all connections are correct.

---

### Setup and firmware update

### Connecting via USB

1. Connect the Mario AIO to your computer with a USB cable.
2. If the device is not recognized, install the [**corechip-sr9900**](https://github.com/user-attachments/files/16829005/corechip-sr9900-usb20-to-fast-ethernet-adapter-1750095.zip) driver.
3. Configure the USB network adapter:
   - IP address: `192.168.1.11`
   - Subnet mask: `255.255.255.0`
4. Connect to the Mario AIO via SSH:
   - IP address: `192.168.1.10`
   - Login: `root`
   - Password: `12345`

### Updating the firmware

1. Download the [Multiplatform Configurator](https://github.com/OpenIPC/openipc-configurator/releases/).
2. Firmware - OpenIPC - MarioAIO - click Update.


>⚠️ Before updating the firmware it is recommended to back up your settings.

---

### RF settings

- **Maximum RF power**: 18 dBm
- **Recommended settings**:
  - `stbc=1`, `ldpc=1`
  - `mcs` index: 1 or 3
  - Video bitrate: 4096 / 8192 / 12688


>⚠️ It is recommended to limit Txpower to 1 when powering via USB only.

---

###  Additional resources

- [OpenIPC Wiki](https://github.com/OpenIPC/wiki)
- [OpenIPC Configurator](https://github.com/OpenIPC/configurator)
- [Mario AIO video review](https://www.youtube.com/watch?v=bgfCEThN3Kg)
