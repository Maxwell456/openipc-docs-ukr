---
title: SSC338Q + IMX415 Cameras
description: Technical specifications of an IP camera based on the SigmaStar SSC338Q with a Sony IMX415 sensor
---

# SSC338Q + IMX415 Cameras

<img 
  src="/images/ssc338q.png" 
  alt="main image" 
  width="400px" 
/>

### SSC338Q + IMX415 camera specifications

| Parameter                 | Value                                         |
|---------------------------|-----------------------------------------------|
| **Processor (SoC)**       | SigmaStar SSC338Q                            |
| **Sensor**                | Sony IMX415, 1/2.8" 8 MP                      |
| **Resolution**            | Up to 3840×2160 (4K UHD)                      |
| **Video encoding**        | H.265 / H.264                                 |
| **Frame rate**            | Up to 30 fps at 4K                           |
| **IR filter**             | Mechanical IR-Cut (ICR)                       |
| **Interfaces**            | Ethernet 100 Mbps, USB 2.0 (Wi-Fi support)    |
| **Audio**                 | Microphone or line input (depending on version) |
| **RTSP stream**           | rtsp://&lt;ip&gt;:554/av0_0                         |
| **Power**                 | DC 12V or PoE (optional)                     |
| **Wi-Fi support**         | Via external USB Wi-Fi module (e.g. AUF1, EU2) |
| **OpenIPC support**       | Yes                                           |
| **IQTool support**        | Yes                                           |
| **Protocols**             | RTSP, ONVIF, HTTP, SSH                        |
| **Form factor**           | Modular board (no enclosure)                 |

### Pinout

<img 
  src="/images/ssc338q-1.png" 
  alt="main image" 
  width="400px" 
/>

### How to flash with FPV firmware?

1. We are interested in the RJ45, GND and 12V pins
2. Connect the RJ45 + Ethernet cable to the camera and to a router or laptop + supply DC 12V power
::: danger WARNING!
The camera is powered by 12V
:::
3. At the address 192.168.0.123 — 123456, the standard camera access and web interface (it is a standard surveillance camera by default).
4. We are interested in UART RX + TX + GND (find them in the picture)
::: warning Warning
After you solder to the UART, fix the pads together with the wires using hot glue — this is the Achilles heel of this camera.
:::

 Use the [flashing via UART](/en/configuration/uart-flash) instructions.  

 The next step after flashing the ssc338q is ultimate - 16M. We can safely flash using the [Multiconfigurator](https://github.com/OpenIPC/openipc-configurator/releases).

### How to flash the SSC338Q using firmware files and SCP

1. First, go here — [https://github.com/OpenIPC/builder/releases/tag/latest](https://github.com/OpenIPC/builder/releases/tag/latest)   
2. Next, find the firmware required for our camera; in our case there are several  
[openipc.ssc338q-nand-fpv.tgz](https://github.com/OpenIPC/builder/releases/download/latest/openipc.ssc338q-nand-fpv.tgz)  
[openipc.ssc338q-nor-fpv.tgz](https://github.com/OpenIPC/builder/releases/download/latest/openipc.ssc338q-nor-fpv.tgz)  
![ssc338q](/images/ssc338q-3.png)
3. Unpack on your PC and, using WinSCP, upload to the camera into the ```/tmp/``` directory
4. Run the following commands, one command at a time:  
```soc=$(fw_printenv -n soc)```   
```sysupgrade --kernel=/mnt/mmcblk0p1/uImage.${soc} --rootfs=/mnt/mmcblk0p1/rootfs.squashfs.${soc} --force_ver -z```
::: warning Warning
Do not turn off the power during flashing!
:::

5. Next, set the U-Boot auto-update URL with the command    
```fw_setenv upgrade_url https://github.com/OpenIPC/builder/releases/download/latest/ssc338q_fpv_openipc-urllc-aio-nor.tgz```
6. And verify that the build and the link are set.   
```fw_printenv upgrade```  
```grep -e BUILD_OPTION /etc/os-release```
