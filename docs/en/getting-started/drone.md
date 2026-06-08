---
title: Building an FPV Drone with Runcam WifiLink
description: Step-by-step guide for connecting and configuring the Runcam WifiLink v1/v2 Air Unit on an FPV drone.
---

# Drone Assembly and Configuration Guide

1. Mount the Air Unit in the rear of the drone for VTX.
2. Connect the Air Unit to the FC (DJI connector) using the supplied cable from Runcam WifiLink v1/v2.
3. Connect to the FC via Type-C, open *Betaflight → Ports → UART 2 → ON*.<br>
**REQUIRED!** Under *Peripherals → VTX (MSP+DisplayPort)*.<br><br>
<img src="/images/drone-bf.png" alt="betaflight" width="1000" height="250"/><br>
> If your FC has no connector, solder RX/TX to TX/RX and power directly to ESC — cameras have internal BECs on board.<br>
4. Take an Ethernet RJ-45 cable and connect one end to your laptop or home router, the other end to the Air Unit.
5. If using a router, open the router's web interface and find the IP address of your Air Unit.
6. Download to your PC — [Multiconfigurator](https://github.com/OpenIPC/openipc-configurator/releases/).
7. Connect to the Air Unit using its IP and password `12345`.<br><br>
<img src="/images/multiconf.png" alt="multiconf" width="1000" height="675"/><br>
8. Set TX Power (max 50, min 1). **Do not set 50 on the bench — it will burn out!**
Enable STBC and LDPC.
Set MCS 2 → Save.
9. Go to Camera → Bitrate → 8192 → Save. You can also adjust resolution (FullHD, HD) and FPS.<br><br>
<img src="/images/multiconf1.png" alt="multiconf1" width="1000" height="682"/>
10. Telemetry is configured via Betaflight.
11. To use new features or beta firmware, flash the camera here.<br><br>
<img src="/images/multiconf2.png" alt="multiconf2" width="1000" height="678"/>
12. **Unofficial configurator** by Mariofpv can be downloaded [here](https://github.com/OpenIPC/configurator/releases).
