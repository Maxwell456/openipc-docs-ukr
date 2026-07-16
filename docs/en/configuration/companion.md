---
title: "Companion — the official OpenIPC configurator"
description: "Complete guide to OpenIPC Companion: installing on Windows, macOS, Linux and Android, connecting to a camera or Radxa, the WFB/Camera/Telemetry/Setup tabs, presets, firmware backup and restore."
faq:
  - q: "What is OpenIPC Companion?"
    a: "Companion is the official cross-platform configuration tool for OpenIPC cameras, built with Avalonia UI. It connects to a camera or a Radxa ground station over SSH and lets you configure WFB-NG, camera settings, telemetry, apply presets and update firmware."
  - q: "How is Companion different from the Multiconfigurator?"
    a: "It is the same app under a new name. The official configurator was called OpenIPC Config (the community calls it the multiconfigurator) and was renamed to Companion — since v0.7.14 the release files are named Companion-*, and the openipc-configurator repository redirects to OpenIPC/companion."
  - q: "What password does Companion need to connect to a camera?"
    a: "Companion always connects as the root user — you only enter the password. On stock OpenIPC firmware it is 12345 and the SSH port is 22."
  - q: "Can I back up firmware with Companion?"
    a: "Yes. On the Firmware tab, under Backup / Restore, the app dumps every /dev/mtdblock* partition with dd, generates MD5 checksums and downloads a .tar.gz archive to your machine. Restoring from that archive is done in the same place."
  - q: "Companion fails to connect with a hostname error — what should I do?"
    a: "Add your device hostname to the DeviceHostnameMapping section of appsettings.json (Windows: %APPDATA%\\Local\\Companion, macOS: ~/Library/Application Support/Companion, Linux: ~/.config)."
  - q: "How do I update OpenIPC firmware with the configurator?"
    a: "Download Companion (the former OpenIPC multiconfigurator), connect to your device, open the 'Firmware' tab, select your device and start flashing. Make sure the drone has stable power before flashing."
  - q: "What should I do if the device failed to flash?"
    a: "If the blue Connect button does not appear within 5 minutes, the flash failed. Follow the UART recovery guide to restore the device."
  - q: "How do I factory reset OpenIPC without reflashing the firmware?"
    a: "Run the firstboot command via SSH or terminal. This restores factory settings without reinstalling the firmware."
---

# Companion — the official OpenIPC configurator

**Companion** is the official cross-platform application for configuring OpenIPC cameras, built with **Avalonia UI**. It connects to the device over SSH and gives you a GUI for everything you would otherwise edit by hand in config files: WFB-NG parameters, camera settings, telemetry, presets and firmware.

<img src="/images/companion-app.png" alt="OpenIPC Companion main window" width="1000px"/>

*The Companion main window. This screenshot is from an early build — the set of tabs has changed since; see the current list [below](#application-tabs).*

What Companion does:

- **Camera settings** — resolution, frame rate, exposure
- **Telemetry** — real-time metrics (temperature, voltage, signal strength)
- **Setup wizards** — guided device and network configuration
- **Presets** — save and apply ready-made setting bundles
- **Firmware** — updates, plus backup and restore
- **Cross-platform** — Windows, macOS, Linux; Android and iOS builds are in progress

::: warning NVR is not supported
Companion does not work with NVRs yet. For NVR support use [OpenIPC Config by MarioFPV](https://github.com/OpenIPC/configurator).
:::

::: info Companion *is* the "Multiconfigurator"
This is not a separate new app — it is **the same official configurator under a new name**. It used to be called OpenIPC Config, and the community calls it the "multiconfigurator"; since release `v0.7.14` (January 2026) the builds are named `Companion-*`. The `openipc-configurator` repository was renamed too, so old links redirect to [OpenIPC/companion](https://github.com/OpenIPC/companion) and open the same releases.

So there is no separate "multiconfigurator" page any more — everything lives here, including the [step-by-step camera flashing](#flashing-a-camera).

Do not confuse it with [OpenIPC Config by MarioFPV](https://github.com/OpenIPC/configurator) — that is a separate tool for NVR and URLLC devices.
:::

## What you need

| Component | Requirements |
|---|---|
| Device | A camera running [OpenIPC](/en/software/wfb-ng) firmware, or a [Radxa](/en/hardware/vrx/radxa-zero-3w) ground station |
| Network | Computer and device on the same network (Ethernet, Wi-Fi or USB-NCM) |
| Access | Working SSH on the device, known IP and root password |
| OS | Windows, macOS or Linux (x64 or arm64) |

## Installation

Prebuilt binaries are available on the [Companion releases page](https://github.com/OpenIPC/companion/releases). You do not need to build from source — just pick the archive for your system.

| System | File | How to run |
|---|---|---|
| Windows | `Companion-windows-x64.zip` or `Companion-windows-arm64.zip` | Extract the archive and run `Companion.Desktop.exe` |
| macOS | `Companion-macos-x64.dmg` or `Companion-macos-arm64.dmg` | Mount the `.dmg` and drag **Companion.app** into Applications |
| Linux | `Companion-linux-x64.zip` or `Companion-linux-arm64.zip` | Extract and run `./Companion.DesktopApp` (`chmod +x` if needed) |

::: tip Which archive to pick
`arm64` is for Apple Silicon (M1–M4), Windows on ARM and single-board computers. For regular Intel/AMD desktops and laptops, use `x64`.
:::

### Building from source

If you need the latest `master` or a platform with no prebuilt archive, you will need the **.NET SDK 8.0**:

```bash
git clone https://github.com/OpenIPC/companion.git
cd companion

dotnet build Companion.Desktop/Companion.Desktop.csproj -c Release
dotnet run --project Companion.Desktop/Companion.Desktop.csproj
```

On Ubuntu/Debian, install the dependencies with:

```bash
sudo apt-get install -y dotnet-sdk-8.0 dotnet-runtime-8.0
```

### Android

An Android build exists but is still **alpha**. Known issue: when working through a tunnel on Radxa the app can hang — the developers link this to a command waiting on a broken connection.

## Connecting to a device

Companion works over SSH and always connects as **root** — there is no username field, only a password.

1. Power on the camera (or Radxa) and make sure it is reachable, e.g. `ping 192.168.1.10`
2. Launch Companion
3. Fill in the fields at the top of the window:
   - **IP Address** — the device address (typically `192.168.1.10` for a camera)
   - **Port** — the SSH port, `22` by default
   - **Password** — the root password (`12345` on stock OpenIPC firmware)
4. Pick the device type with the radio buttons: **Camera** or **Radxa**
5. Click **Connect**

::: tip Don't know the camera's IP
The app has a built-in network scanner that sweeps the subnet and lists the OpenIPC devices it finds. Used addresses are cached, so next time you can just pick the IP from the list.
:::

## Application tabs

Which tabs you get depends on the device type you selected when connecting.

### Camera

| Tab | Purpose |
|---|---|
| **WFB** | [WFB-NG](/en/software/wfb-ng-config) parameters: channel, bandwidth, TX power, encryption key |
| **Camera** | Video settings: resolution, FPS, bitrate, codec, exposure |
| **Telemetry** | Telemetry and [OSD](/en/configuration/telemetry) settings: port, UART baud rate, protocol |
| **Setup** | Device and network setup wizards, maintenance operations |
| **Firmware** | Firmware updates, backup and restore |
| **Preferences** | Settings for the app itself |

### Radxa (ground station)

| Tab | Purpose |
|---|---|
| **WFB** | WFB-NG parameters on the ground station side |
| **Setup** | Ground station setup wizard |
| **Preferences** | App settings |

::: info Firmware Focused Mode
In Preferences you can enable **Firmware Focused Mode** — this hides every tab except **Firmware** and **Preferences**. Handy when you only use Companion as a flashing tool.
:::

Below the main window there is a log panel you can drag open by the splitter. It shows the actual SSH commands and errors, so it is the first place to look whenever something goes wrong.

## Flashing a camera

The most common reason to open the configurator.

::: tip If you only need a settings reset
When you do not need a firmware update but only a full factory reset, run the `firstboot` command on the device (over SSH or in a terminal). It restores factory settings without reinstalling the firmware.
:::

1. **Make sure you have a stable connection to the device (Air Unit)** — see [Connecting to a device](#connecting-to-a-device) above
2. **Open the Firmware tab and select your device** — manufacturer, model and firmware type

<img src="/images/multiconf2.webp" alt="The Firmware tab in Companion" width="1000px"/>

*The Firmware tab (screenshot from v0.7.2). There are three ways to pick firmware — automatically by manufacturer and model (recommended), from the image list, or from a local file.*

::: warning Warning!
Always check the drone's power supply quality before starting the flash process!  
If power is cut during flashing you may **brick** your device.
:::

3. **Wait a few minutes** until a ping to the device appears (the blue **Connect** button in the configurator)

4. **If no connection appears within 5 minutes** — the device did not flash. Proceed to the recovery guide: [General UART Flashing Guide](/en/configuration/uart-flash)

::: tip Back up before flashing
A [backup](#firmware-backup) of the stock firmware takes a few minutes and saves you from most failed experiments.
:::

## Presets

A preset is a ready-made bundle of settings (channel, TX power, camera parameters) applied in one click. The official collection lives in the [OpenIPC/fpv-presets](https://github.com/OpenIPC/fpv-presets) repository.

::: warning The Presets tab is temporarily hidden
Up to v0.7.15 presets had their own tab (you can still see it in screenshots of older builds), but it was hidden in January 2026: the preset mechanism is being redesigned and the format and behaviour will still change. In current releases you cannot apply a preset from the app — the format below is documented for the future.
:::

Each preset is a self-contained folder with a `preset-config.yaml` file:

```yaml
name: "High Power FPV"
author: "OpenIPC"
description: "Optimized settings for high-power FPV."
sensor: "milos-sensor.bin"
files:
  wfb.yaml:
    wireless.txpower: "30"
    wireless.channel: "161"
  majestic.yaml:
    fpv.enabled: "true"
    system.logLevel: "info"
```

What it defines:

- **Metadata** — `name`, `author`, `description`, `category`
- **`files`** — which files on the device to change and which keys to overwrite in them
- **`sensor`** — an optional sensor binary to transfer to the device

Preset folder structure:

```
presets/
├── high_power_fpv/
│   ├── preset-config.yaml
│   ├── sensor/
│       └── milos-sensor.bin
```

The mechanism: the app scans the `presets/` directory, parses each `preset-config.yaml` and builds from it the list of modifications to apply to the device. To contribute your own preset, submit a pull request to [fpv-presets](https://github.com/OpenIPC/fpv-presets).

## Firmware backup

This is Companion's most valuable feature: before experimenting with anything, take a full dump of the camera's flash.

On the **Firmware** tab, expand **Backup / Restore** and start a backup. The app will:

1. Kill the streamer and other large processes to free RAM
2. Dump every `/dev/mtdblock*` partition using `dd`
3. Generate MD5 checksums for every `.bin` file
4. Package it all into a `.tar.gz` archive and download it to your machine

Inside the archive:

```
backup-<chiptype>-<timestamp>/
  mtdblock0.bin   # bootloader (U-Boot)
  mtdblock1.bin   # bootloader environment
  mtdblock2.bin   # kernel
  mtdblock3.bin   # rootfs
  mtdblock4.bin   # rootfs_data (user settings)
  md5sums.txt     # checksums
```

Partition names and count vary by SoC. The `rootfs_data` partition holds your settings — restoring it overwrites anything you changed after the backup was made.

### Partition reference

| Partition | Device node | Contents |
|---|---|---|
| boot | `/dev/mtd0` | U-Boot bootloader |
| env | `/dev/mtd1` | U-Boot environment variables |
| kernel | `/dev/mtd2` | Linux kernel (uImage) |
| rootfs | `/dev/mtd3` | Root filesystem (SquashFS) |
| rootfs_data | `/dev/mtd4` | Overlay with user config |

Layout and numbering vary by SoC and vendor. Always verify against `/proc/mtd` on your specific device before flashing.

## Firmware restore

::: danger Destructive operation
Restoring firmware is an **irreversible** operation. Flashing incorrect data or losing power mid-flash can permanently brick your device. Proceed only if you understand the risks and have a verified backup.
:::

### With Companion (recommended)

This works as long as the device still boots and is reachable over SSH.

1. Open the **Firmware** tab → **Backup / Restore**
2. Check **"I accept the risk of permanently bricking this device"**
3. Click **Restore from Backup** and select your `.tar.gz` archive
4. Confirm the warning dialog

The app then extracts the archive, verifies the MD5 checksums locally, reads `/proc/mtd` from the device to confirm the partition layout, uploads and `flashcp`s each partition in order, and reboots the device. If checksum verification fails, the restore is aborted **before** anything is written to the device.

### Manually over SSH

If you cannot use the app but the device is still SSH-accessible:

```bash
# 1. Extract the backup archive
tar -xzf backup-<chiptype>-<timestamp>.tar.gz
cd backup-<chiptype>-<timestamp>

# 2. Verify checksums
md5sum -c md5sums.txt

# 3. Copy partitions to the device
scp mtdblock*.bin root@<device-ip>:/tmp/

# 4. Flash each partition
ssh root@<device-ip>

flashcp -v /tmp/mtdblock0.bin /dev/mtd0   # bootloader
flashcp -v /tmp/mtdblock1.bin /dev/mtd1   # env
flashcp -v /tmp/mtdblock2.bin /dev/mtd2   # kernel
flashcp -v /tmp/mtdblock3.bin /dev/mtd3   # rootfs
flashcp -v /tmp/mtdblock4.bin /dev/mtd4   # rootfs_data

reboot
```

::: warning flashcp only
`flashcp` erases and writes atomically. **Do not use `dd`** to write back to MTD partitions — it does not erase first. Match the partition numbers to your device's actual `/proc/mtd` layout.
:::

To flash only the kernel and rootfs, leaving the bootloader and settings intact:

```bash
flashcp -v /tmp/mtdblock2.bin /dev/mtd2
flashcp -v /tmp/mtdblock3.bin /dev/mtd3
reboot
```

### If the device won't boot

When the kernel or rootfs is corrupted and Linux cannot start, hardware routes remain:

- **Via U-Boot and TFTP** — requires a UART adapter and a TFTP server. Flash addresses and partition sizes depend on your exact SoC, so follow the [general UART flashing guide](/en/configuration/uart-flash).
- **From an SD card** — on SigmaStar and Ingenic the bootloader initialises the SD card itself and looks for a `boot.scr` script on it, so recovery is possible without UART.
- **Corrupted bootloader (mtd0)** — the device produces no serial output and cannot be recovered in software. You need a hardware programmer (e.g. CH341A) wired directly to the SPI NOR chip.

## Config files and logs

The app stores its own settings in `appsettings.json` — update checks, logging, device hostname mappings and preset repositories are configured there.

| System | `appsettings.json` | Logs |
|---|---|---|
| Windows | `%APPDATA%\Local\Companion\appsettings.json` | `%APPDATA%\Local\Companion\Logs` |
| macOS | `$HOME/Library/Application Support/Companion/appsettings.json` | `$HOME/Library/Application Support/Companion/Logs` |
| Linux | `~/.config/appsettings.json` | `~/.config/companion.log` |
| Android | — | `/data/user/0/org.openipc.Companion/files/.config/companion.log` |

Logging is configured through Serilog — see the [configuration reference](https://github.com/serilog/serilog/wiki/Configuration-Basics).

## Troubleshooting

**Hostname error when connecting**

Companion identifies the device type by its hostname. If yours is not on the list, add it to the `DeviceHostnameMapping` section of `appsettings.json`:

```json
"DeviceHostnameMapping": {
  "Camera": [
    "openipc-ssc338q",
    "openipc-ssc30kq"
  ],
  "Radxa": [
    "radxa",
    "raspberrypi"
  ],
  "NVR": [
    "openipc-hi3536dv100"
  ]
}
```

**Won't connect at all**

1. ✅ The device responds to ping from your computer
2. ✅ The IP and port are correct (`22` by default)
3. ✅ The root password is correct (`12345` on stock firmware)
4. ✅ The right device type is selected (Camera / Radxa)
5. ✅ Check the log panel at the bottom of the window — the SSH error text will be there

**macOS won't launch the app**

Update to the latest release: `v0.9.4` fixed startup of the signed app on macOS by adding .NET entitlements.

**Android hangs**

A known issue in the alpha build when working through a tunnel on Radxa. Use the desktop version for now.

## Useful links

- [Companion on GitHub](https://github.com/OpenIPC/companion) — source, issues, documentation
- [Companion releases](https://github.com/OpenIPC/companion/releases) — prebuilt binaries for all platforms
- [Demo on YouTube](https://www.youtube.com/watch?v=iJXXMcnOC7w) — a walkthrough of the app
- [fpv-presets](https://github.com/OpenIPC/fpv-presets) — the official preset collection
- [Flashing via UART](/en/configuration/uart-flash) — recovering a device that won't boot
- [Firmware update (sysupgrade)](/en/configuration/upgrading-firmware) — the same thing by hand from the terminal
- [WFB-NG configuration](/en/software/wfb-ng-config) — what the WFB tab parameters actually change
