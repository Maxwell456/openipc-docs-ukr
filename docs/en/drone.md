---
title: Building an FPV Drone with Runcam WifiLink
description: Step-by-step guide to connecting and configuring the Runcam WifiLink v1/v2 Air Unit for FPV drones.
---

# Drone Assembly and Setup Guide

1. Mount the Air Unit at the rear of the drone as your VTX.
2. Connect the Air Unit to the FC (DJI port) using the included cable from the Runcam WifiLink v1/v2 kit.
3. Connect to the FC using a Type-C cable and go to *Betaflight -> Ports - UART 2 - ON*  
**IMPORTANT!** In the *Peripherals* section, set to *VTX (MSP+DisplayPort)*  

<img src="/images/drone-bf.png" alt="alink" width="1000px"/>

> If your FC doesn't have a dedicated connector, solder RX to TX, TX to RX manually, and power it directly from the ESC, as the cameras have built-in BECs.

4. Take an Ethernet RJ45 cable and connect one end to your laptop or router and the other to the Air Unit.
5. If using a router, access the web interface of the router and find the IP address assigned to your Air Unit.
6. Download the [Multi-configurator](https://github.com/OpenIPC/openipc-configurator/releases/) to your PC.
7. Connect to the Air Unit using the IP address and the default password `12345`.

<img src="/images/multiconf.png" alt="alink" width="1000px"/>

8. Configure TX Power (max 50, min 1).  
**Do not set to 50 on the bench — it may burn out!**  
Enable STBC and LDPC.  
Set MCS to 2 and save the settings.

9. Go to the *Camera* section -> Set Bitrate to `8192` -> Save.  
You can also customize resolution (FullHD, HD) and FPS as needed.

<img src="/images/multiconf1.png" alt="alink" width="1000px"/>

10. Telemetry is configured using Betaflight.
11. To access new features or beta tests, firmware updates for the camera can be flashed here:

<img src="/images/multiconf2.png" alt="alink" width="1000px"/>

12. **Unofficial Configurator** by Mariofpv is available [here](https://github.com/OpenIPC/configurator/releases)
