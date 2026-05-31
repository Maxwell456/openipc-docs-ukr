---
title: "OpenIPC 4G firmware for QuadroFleet"
description: "Step-by-step flashing of drone cameras with the QuadroFleet client and 4G modem setup"
---

<h3>Preparing and flashing the OpenIPC firmware</h3>

This guide explains how to compile and flash the OpenIPC firmware with the QuadroFleet Masina client for a drone camera (e.g. SSC30KQ, SSC338Q). Configuring the ECM interface of the 4G modem is also covered.

---

Prerequisites

* A Linux system (Ubuntu 22.04+ recommended)
* Internet access to download repositories and tools
* A TFTP server for flashing (e.g. tftpd-hpa on Ubuntu)
* Optional: a CH341A programmer for direct flashing

---

<h3>Step 1: Compiling the OpenIPC firmware</h3>

Installing dependencies:

```bash
sudo apt update
sudo apt install g++-arm-linux-gnueabihf build-essential git
```

Cloning the repositories:

```bash
git clone https://github.com/OpenIPC/firmware.git
git clone -b opt https://github.com/beep-systems/quadrofleet-masina.git
```

Compiling the Masina client:

```bash
cd quadrofleet-masina/client
make clean
make
```

Copying the client files into the firmware directory:

```bash
cd ..
cp -r quadrofleet-masina/client/drop/* firmware/
```

Compiling the firmware:

```bash
cd firmware
make
```

* Select the target device (SSC30KQ\_4G or SSC338Q\_4G) during compilation
* The output files are in `firmware/output/images` (e.g. `rootfs.squashfs.ssc30kq`, `uImage.ssc30kq`)

---

<h3>Step 2: Flashing via TFTP</h3>

Setting up the TFTP server:

```bash
sudo apt install tftpd-hpa
sudo cp firmware/output/images/* /var/lib/tftpboot/
sudo systemctl restart tftpd-hpa
```

Connect the camera to the TFTP server via Ethernet and access the bootloader (e.g. via minicom).

Setting the environment variables (adjust the file sizes):

```bash
setenv serverip 192.168.178.66
setenv kernsize 0x300000
setenv rootaddr 0x350000
setenv rootsize 0xA00000
setenv rootmtd 10240k
setenv bootargs 'console=ttyS0,115200 panic=20 root=/dev/mtdblock3 init=/init mtdparts=NOR_FLASH:256k(boot),64k(env),3072k(kernel),${rootmtd}(rootfs),-(rootfs_data) LX_MEM=${memlx} mma_heap=mma_heap_name0,miu=0,sz=${memsz}'
saveenv
```

Flashing the kernel and rootfs:

```bash
tftp 0x21000000 uImage.ssc30kq
sf probe 0; sf erase 0x50000 0x300000; sf write 0x21000000 0x50000 0x1fdd68
tftp 0x21000000 rootfs.squashfs.ssc30kq
sf probe 0; sf erase 0x350000 0xA00000; sf write 0x21000000 0x350000 0x8ea000
saveenv
reset
```

---

<h3>Step 3: Alternative flashing with the CH341A</h3>

1. Download the pre-compiled firmware from QuadroFleet.
2. Use the CH341A programmer and NeoProgrammer 2.2.0.10:

   * Device: GD25Q128x \[3.3V]
   * Type: SPI NOR 25xx
   * BitSize: 128 Mbits
   * Manufact: GIGADEVICE
   * Size: 16777216 Bytes
   * Page: 256 Bytes
3. Flash the .bin file.

---

<h3>Step 4: Updating the firmware (optional)</h3>

1. Connect to the camera via Ethernet and access the terminal (SSH or web interface).
2. Download the new firmware files:

```bash
cd /tmp
curl -O http://192.168.178.66/rootfs.squashfs.ssc30kq
curl -O http://192.168.178.66/uImage.ssc30kq
```

3. Apply the update:

```bash
soc=$(fw_printenv -n soc)
sysupgrade --kernel=/tmp/uImage.${soc} --rootfs=/tmp/rootfs.squashfs.${soc} -z --force_ver -n
```

---

<h3>Step 5: Configuring the 4G modem (Quectel EC25)</h3>

1. Connect the modem to a PC via USB.
2. Open a terminal (PuTTY) with the settings:

```
Baud rate: 115200
Data bits: 8
Stop bits: 1
Parity: None
Flow control: None
```

Enable the ECM interface:

```
AT+QCFG="usbnet",1
AT+CFUN=1,1
```


```text
AT+QCFG="usbnet",1
AT+CFUN=1,1
```
::: warning Warning!
Wait for the modem to reboot and for the network device to appear.
:::

---

<h3>Step 6: Verifying the firmware</h3>

* Access the camera's web interface (default IP via DHCP).
* Make sure the QuadroFleet Masina client is running (`ps | grep client`).
* Check the VPN connection and UDP stream through the control app.

---

::: info Notes
- Make sure the TFTP server IP (192.168.178.66) matches your network.
- Back up the camera settings before flashing.
:::
