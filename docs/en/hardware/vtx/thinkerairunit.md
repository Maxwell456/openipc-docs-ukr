---
title: "FPV OpenIPC Thinker Air Unit"
description: "OpenIPC Thinker: technical specifications and installation"
---

OpenIPC Thinker is a compact camera and video transmission unit that easily integrates with various RC devices.

Two versions are available:

- **Base** ([Store](https://store.openipc.org/OpenIPC-Thinker-v1-0-Base-with-SD-p711054393)) — SD card slot, requires an external Wi-Fi module
- **Tiny** ([Store](https://store.openipc.org/OpenIPC-Thinker-v1-0-Tiny-with-WiFi-p633445803)) — integrated RTL8731BU Wi-Fi module[^1], but without an SD card

>RTL8731BU: 50mW @ 5G, 125mW @ 2.4G

![Thinker kit](https://raw.githubusercontent.com/OpenIPC/docs/refs/heads/main/src/assets/images/aio-thinker/thinker-webshop-photo.jpg)

<h3>Specifications</h3>

- SoC SSC338Q
- Power: 2–6S
- Built-in 3A BEC
- MEMS microphone
- Interfaces:
  - 3x UART
  - 1x MIPI for the camera
  - 1x USB for Wi-Fi (5V/3.3V)
  - 1x Ethernet
  - 1x power

<h3>Physical parameters</h3>

- Board size: 25×25 mm
- Weight:
  - Without heatsink: ~8.8 g
  - With heatsink: ~13.4 g
- Holes:
  - PCB: 20×20 mm
  - With heatsink: 25.5×25.5 mm
- Cooling: aluminium heatsink

 <h3>Cameras</h3>

**IMX335** ([Store](https://store.openipc.org/OpenIPC-IMX335-v2-module-without-cable-p721231276))

- 14×14 mm, aluminium housing
- Lens: 140°, f/2.8
- IMX335 sensor with IMU

**IMX415** ([Store](https://store.openipc.org/OpenIPC-IMX415-v2-module-without-cable-p721152215)) — a different sensor with the same hardware

---

<h3>Hardware installation</h3>

Connecting power and the flight controller

1. Find the 6-wire power/UART (JST) cable: black, black, yellow, green, red, red
2. Black — to power minus, red — to plus
3. Green → TX, yellow → RX (on the FC)
4. TX to RX, RX to TX
5. Connect the cable to the power/UART2 connector (the heatsink side)

Connecting the Wi-Fi module (Base version only)

1. The Tiny version does not require this step
2. Use the USB cable: red (+), blue (D-), yellow (D+), black (GND)
3. Connect according to the pinout: GND → GND, red → VCC, yellow → D+, blue → D-

Replacing the camera

1. By default an IMX335 is installed
2. Remove the heatsink (4 screws), carefully
3. Disconnect the camera and connect the new one
4. Put the heatsink back (do not remove the thermal pad!)

Ethernet for configuration and updates

1. Take the Ethernet cable: 6-pin JST ↔ RJ45
2. Connect the JST to Ethernet/UART0 (the side without a heatsink)
3. Connect the RJ45 to a PC or router

![Thinker components](https://raw.githubusercontent.com/OpenIPC/docs/refs/heads/main/src/assets/images/aio-thinker/thinker-connectivity.png)

----


<table style="width:100%; border-collapse: collapse; margin: 15px 0;">
  <thead>
    <tr>
      <th style="padding: 10px; border: 1px solid #ddd;">Section</th>
      <th style="padding: 10px; border: 1px solid #ddd;">Pin name</th>
      <th style="padding: 10px; border: 1px solid #ddd;">Direction</th>
      <th style="padding: 10px; border: 1px solid #ddd;">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr><td rowspan="6" style="padding: 8px; border: 1px solid #ddd;"><strong>RJ45 / UART0 Header</strong></td><td style="padding: 8px; border: 1px solid #ddd;">UART0 RX</td><td style="padding: 8px; border: 1px solid #ddd;">Input</td><td style="padding: 8px; border: 1px solid #ddd;">UART0 receive line</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">UART0 TX</td><td style="padding: 8px; border: 1px solid #ddd;">Output</td><td style="padding: 8px; border: 1px solid #ddd;">UART0 transmit line</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">RJ45 TX+</td><td style="padding: 8px; border: 1px solid #ddd;">Output</td><td style="padding: 8px; border: 1px solid #ddd;">Ethernet transmit TX+</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">RJ45 TX-</td><td style="padding: 8px; border: 1px solid #ddd;">Output</td><td style="padding: 8px; border: 1px solid #ddd;">Ethernet transmit TX-</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">RJ45 RX+</td><td style="padding: 8px; border: 1px solid #ddd;">Input</td><td style="padding: 8px; border: 1px solid #ddd;">Ethernet receive RX+</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">RJ45 RX-</td><td style="padding: 8px; border: 1px solid #ddd;">Input</td><td style="padding: 8px; border: 1px solid #ddd;">Ethernet receive RX-</td></tr>

    <tr><td rowspan="4" style="padding: 8px; border: 1px solid #ddd;"><strong>USB Header</strong></td><td style="padding: 8px; border: 1px solid #ddd;">Vd</td><td style="padding: 8px; border: 1px solid #ddd;">Output</td><td style="padding: 8px; border: 1px solid #ddd;">Power for the external Wi-Fi module</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">DM</td><td style="padding: 8px; border: 1px solid #ddd;">I/O</td><td style="padding: 8px; border: 1px solid #ddd;">USB Data− (D−)</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">DP</td><td style="padding: 8px; border: 1px solid #ddd;">I/O</td><td style="padding: 8px; border: 1px solid #ddd;">USB Data+ (D+)</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">GND</td><td style="padding: 8px; border: 1px solid #ddd;">—</td><td style="padding: 8px; border: 1px solid #ddd;">Ground</td></tr>

    <tr><td rowspan="6" style="padding: 8px; border: 1px solid #ddd;"><strong>Power / UART2 Header</strong></td><td style="padding: 8px; border: 1px solid #ddd;">Vcc</td><td style="padding: 8px; border: 1px solid #ddd;">Input</td><td style="padding: 8px; border: 1px solid #ddd;">Power input</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">Vcc (dup)</td><td style="padding: 8px; border: 1px solid #ddd;">Input</td><td style="padding: 8px; border: 1px solid #ddd;">Duplicate power pin (joined)</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">RX</td><td style="padding: 8px; border: 1px solid #ddd;">Input</td><td style="padding: 8px; border: 1px solid #ddd;">UART2 receive (to flight controller)</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">TX</td><td style="padding: 8px; border: 1px solid #ddd;">Output</td><td style="padding: 8px; border: 1px solid #ddd;">UART2 transmit (to flight controller)</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">GND</td><td style="padding: 8px; border: 1px solid #ddd;">—</td><td style="padding: 8px; border: 1px solid #ddd;">Ground</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">GND (dup)</td><td style="padding: 8px; border: 1px solid #ddd;">—</td><td style="padding: 8px; border: 1px solid #ddd;">Duplicate ground pin (joined)</td></tr>

    <tr><td rowspan="2" style="padding: 8px; border: 1px solid #ddd;"><strong>UART1 (solder pads)</strong></td><td style="padding: 8px; border: 1px solid #ddd;">RX</td><td style="padding: 8px; border: 1px solid #ddd;">Input</td><td style="padding: 8px; border: 1px solid #ddd;">UART1 receive</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">TX</td><td style="padding: 8px; border: 1px solid #ddd;">Output</td><td style="padding: 8px; border: 1px solid #ddd;">UART1 transmit</td></tr>
  </tbody>
</table>

----
::: info Tips
:::

    - Do not supply power through USB Vd.  
    - Do not remove the thermal pad from the heatsink.  
    - For 3.3V Wi-Fi — remove the voltage-select resistor.  
    - High-consumption modules can be powered separately.


---

<h3>Software configuration</h3>

 **Accessing the Web UI**

- DHCP: connect to the network and find the IP on the router
- Static IP: 192.168.1.10 (manually configure the PC interface)

> Default login:
> - User: `root`
> - Password: `12345`

<h3>Firmware update</h3>

- Via the Web UI (internet required)
- Via the [OpenIPC Configurator](https://github.com/OpenIPC/openipc-configurator)

**Firmware:**

- [Standard](https://github.com/OpenIPC/builder/releases/download/latest/ssc338q_fpv_openipc-thinker-aio-nor.tgz)
- [For RTL8812EU](https://github.com/OpenIPC/builder/releases/download/latest/ssc338q_fpv_openipc-urllc-aio-nor.tgz)

**Additional**

Use the [OpenIPC Configurator](https://github.com/OpenIPC/openipc-configurator)
