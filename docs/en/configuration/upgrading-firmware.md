# Upgrading firmware

This article explains how to perform an update manually from a terminal window using the ```sysupgrade``` command.

::: info **Note**
By default sysupgrade will reboot the camera to finish the update. If you don't want it to, use the -x option (see sysupgrade --help for all options).
:::

<h3>Updating from the latest GitHub release</h3>

By default, running sysupgrade will try to download the latest software for your camera model from the github sources.

Other options are available so you can use a local copy of the Linux kernel (uImage) and the camera software (rootfs.squashfs).

For older firmware it is enough to run sysupgrade with no parameters. For newer firmware you need to run sysupgrade -k -r to update both the kernel and the rootfs.

::: warning **WARNING!**
A firmware update may "brick" your camera. Make sure you are ready, both mentally and professionally. Have a rescue SD card and/or a UART adapter ready. Be prepared to desolder and reprogram the flash chip as a last resort. Do not update working cameras unless it is absolutely necessary!
:::

<h3>Using sysupgrade</h3>

Normally running sysupgrade gives you the latest release for your camera, as described above; however, if you want to roll back to a previous image or load your own updates, use any of the options described below.

Remember that when you're ready to run sysupgrade, you must use the syntax:

```bash
sysupgrade --kernel=/tmp/uImage.${soc} --rootfs=/tmp/rootfs.squashfs.${soc} -z
```

where '${soc}' is your camera-specific soc, e.g. gk7205v300, otherwise the latest release from Github will be downloaded.

## Using a TFTP server

### On your host machine:

If you don't already have a TFTP server running on your host machine, see the Wiki article "Setting up a TFTP server".

If you don't already have uImage and rootfs.squashfs images for your camera, go to https://github.com/OpenIPC/firmware/releases/tag/latest and download the latest firmware package for your SoC, then extract the package contents into the root directory of your TFTP server.

```bash
tar xvf <firmware.tgz>
```

If you built your own versions using a copy of the firmware repository, your uImage and rootfs.squashfs images will be in the output/images folder. Copy them to the root of your tftp server.

### On the camera:

You can update the images either from a Linux terminal session or from the U-Boot prompt if you have a UART serial connection and interrupted the Linux boot.

Check that your camera's environment variable for the TFTP server is correct by looking for the serverip entry when listing them with fw_printenv.

If you need to update it, use the command `fw_setenv serverip <your.tftp.ip.address>`.

### From Linux

```bash
soc=$(fw_printenv -n soc)
serverip=$(fw_printenv -n serverip)
cd /tmp
busybox tftp -r rootfs.squashfs.${soc} -g ${serverip}
busybox tftp -r uImage.${soc} -g ${serverip}
sysupgrade --kernel=/tmp/uImage.${soc} --rootfs=/tmp/rootfs.squashfs.${soc} -z
```

### From U-Boot

**For an 8MB image:**

```bash
tftp ${baseaddr} uImage.${soc}
sf probe 0; sf erase 0x50000 0x200000; sf write ${baseaddr} 0x50000 ${filesize}

tftp ${baseaddr} rootfs.squashfs.${soc}
sf probe 0; sf erase 0x250000 0x500000; sf write ${baseaddr} 0x250000 ${filesize}
```

**For a 16MB image:**

```bash
tftp ${baseaddr} uImage.${soc}
sf probe 0; sf erase 0x50000 0x200000; sf write ${baseaddr} 0x50000 ${filesize}

tftp ${baseaddr} rootfs.squashfs.${soc}
sf probe 0; sf erase 0x250000 0xA00000; sf write ${baseaddr} 0x250000 ${filesize}
```

Now restart the camera to boot the new images.

## Using SCP

### On your host machine:

If you don't already have uImage and rootfs.squashfs images for your camera, go to [https://github.com/OpenIPC/firmware/releases/tag/latest](https://github.com/OpenIPC/firmware/releases/tag/latest) and download the latest firmware package for your SoC, then extract the contents.

```bash
tar xvf <firmware.tgz>
```

If you built your own versions using a copy of the firmware repository, your uImage and rootfs.squashfs images will be in the output/images folder.

Now copy them to the camera using scp.

```bash
scp uImage* rootfs* root@<yourcameraip>:/tmp/
```

::: info **Note**
If you get an error that '/usr/libexec/sftp-server could not be found', it's because later versions of scp now use sftp under the hood, and this is not built into the current busybox implementation. To force scp to use the legacy behaviour, use the -O option:
:::

```bash
scp -O uImage* rootfs* root@<yourcameraip>:/tmp/
```

### On the camera:

Now create a terminal session with the camera, e.g. `ssh root@192.168.1.10`, and run the sysupgrade command pointing to your new images in /tmp.

```bash
soc=$(fw_printenv -n soc)
sysupgrade --kernel=/tmp/uImage.${soc} --rootfs=/tmp/rootfs.squashfs.${soc} -z
```

## Updating from an SD card

### On your host machine

If you don't already have uImage and rootfs.squashfs images for your camera, go to https://github.com/OpenIPC/firmware/releases/tag/latest and download the latest firmware package for your SoC, then extract the contents.

If you built your own versions using a copy of the firmware repository, your uImage and rootfs.squashfs images will be in the output/images folder.

Insert the SD card into your host machine and copy the uImage and squashfs files to the card, e.g.:

```bash
cp uImage* rootfs* /media/<username>/<card-id>/
```

### On your camera

Insert the SD card into the camera.

Create a terminal session and run the following:

```bash
soc=$(fw_printenv -n soc)
sysupgrade --kernel=/mnt/mmcblk0p1/uImage.${soc} --rootfs=/mnt/mmcblk0p1/rootfs.squashfs.${soc} --force_ver -z
```

### SD card: alternatively, from U-Boot

**For an 8MB image:**

```bash
mw.b ${baseaddr} 0xff 0x200000
fatload mmc 0:1 ${baseaddr} uImage.${soc}
sf probe 0; sf erase 0x50000 0x200000; sf write ${baseaddr} 0x50000 ${filesize}

mw.b ${baseaddr} 0xff 0x500000
fatload mmc 0:1 ${baseaddr} rootfs.squashfs.${soc}
sf probe 0; sf erase 0x250000 0x500000; sf write ${baseaddr} 0x250000 ${filesize}
```

**For a 16MB image:**

```bash
mw.b ${baseaddr} 0xff 0x300000
fatload mmc 0:1 ${baseaddr} uImage.${soc}
sf probe 0; sf erase 0x50000 0x300000; sf write ${baseaddr} 0x50000 ${filesize}

mw.b ${baseaddr} 0xff 0x500000
fatload mmc 0:1 ${baseaddr} rootfs.squashfs.${soc}
sf probe 0; sf erase 0x350000 0xa00000; sf write ${baseaddr} 0x350000 ${filesize}
```

### Flashing U-Boot via ymodem

Clear 320K of RAM and load the bootloader file into it:

```bash
mw.b ${baseaddr} 0xff 0x50000
loady
```

(press "Ctrl-a", then ":", then enter)

```bash
exec !! sz --ymodem u-boot.bin
```

After the file is loaded, write it to ROM:

```bash
sf probe 0
sf erase 0x0 0x50000
sf write ${baseaddr} 0x0 ${filesize}
```

## Troubleshooting

If you get this error:

```
losetup: /tmp/rootfs.squashfs.${soc}: No such file or directory
Rootfs: Unable to get hostname, execution was interrupted...
```

first try updating only the kernel: `sysupgrade -k`

If that doesn't help, use the --force option: `sysupgrade -r --force`

If you hit a glitch, get the newest version of the utility:

```bash
curl -k -L -o /usr/sbin/sysupgrade "https://raw.githubusercontent.com/OpenIPC/firmware/master/general/overlay/usr/sbin/sysupgrade"
```
