---
title: "Greg's APFPV"
description: "A special version of APFPV with adaptive bitrate for FPV/GPS drones and planes."
---

::: danger Warning!
**APFPV is ALPHA software.** Use at your own risk. We are not responsible for possible loss of control due to interference or link failures.
:::

APFPV (**Access Point FPV**) is the simplest possible way to transmit digital video from a drone to a smartphone, tablet or computer over standard Wi-Fi. Your drone becomes an access point that you connect to directly, like an ordinary router.

---

::: info
This version includes the **a-link** adaptive streaming solution developed by [Greg Sparks](https://github.com/sickgreg/) and [Joakim](https://github.com/snokvist/), which dynamically adjusts video quality based on real-time network conditions.
:::

| For viewing (ground station) | VTX hardware |
| :--- | :--- |
| • **Android**: PixelPilot app (rec.)<br>• **Computer**: any web browser<br>• **Professional**: WiFi equipment (TP-Link, Ubiquiti)<br>• **Radxa GS**: WFB-ng / APFPV switching<br>• **Any device** with RTP support | • **RTL8812AU** or **EU** modules<br>• **RunCam WiFi Link** V1/V2<br>• **EMAX Wyvern Link**<br>• **DIY SSC338Q** (Thinker SD + NIC) |

::: info
**For optimal performance it is strongly recommended to use RTL8812EU-based WiFi modules on both the transmitter and the receiver.**
:::

---

**Step-by-step setup**

| Step 1: Preparation | Step 2: SSH connection | Step 3: Installation |
| :--- | :--- | :--- |
| Connect to the internet and configure the network. | Remote control via the PC console. | Run the command and update the firmware. |

---

**STEP 1: Connecting the VTX to the internet**

Connect your VTX to a computer using an Ethernet cable, a USB adapter or a UART adapter. Power on the device and wait 1-2 minutes for the system to fully boot.

To download the firmware, the VTX must have internet access through your home WiFi router. The connection is configured via an SSH connection following the instructions in the next step.

---

**STEP 2: SSH connection to the VTX**

SSH (Secure Shell) lets you run commands on your VTX remotely from a computer. To establish a connection you need to know the device's IP address on your local network.

**Establishing the connection:**

<details markdown="1">
<summary><strong>Windows</strong></summary>

1. Download and install [PuTTY](https://www.putty.org/)
2. Launch the program and enter the VTX IP address in the "Host Name" field
3. Set the port to `22` and the connection type to `SSH`
4. Click "Open" to connect
5. Log in: username `root`, password `12345`

</details>

<details markdown="1">
<summary><strong>Mac / Linux</strong></summary>

Open a terminal and run the command:

```bash
ssh root@[VTX-IP-address]
```

Enter the password `12345` when prompted.

</details>

---

**Determining the VTX IP address:**

**Method 1: Through the router admin panel (recommended)**

Open a web browser and enter your router's address:
```
192.168.1.1
192.168.0.1
192.168.1.254
10.0.0.1
http://routerlogin.net (Netgear)
http://my.router
```

<details markdown="1">
<summary>How to find the router's address</summary>

The gateway address is shown in the system network settings as "Default Gateway".

**Windows:** Open the command prompt and run `ipconfig`. Find "Default Gateway".

**Mac:** System Settings → Network → Advanced → TCP/IP → Router.

**Linux:** Run `ip route | grep default` in the terminal.

</details>

Log in to the router's control panel. The default credentials are usually printed on a sticker on the router. Typical combinations: `admin/admin`, `admin/password`, or `admin/[empty field]`.

Find the connected devices section. Possible names for the section:

- Connected Devices
- Device List
- Attached Devices
- DHCP Clients
- LAN Settings

Find the device named **Sigmastar** — that's your VTX. Copy the displayed IP address.

**Method 2: Network scanning**

An alternative method is to use mobile network-scanning apps (Fing, Network Analyzer). Typical default IP addresses:
```
192.168.1.24
192.168.0.24
```

---

**STEP 3: Installing the firmware**

After a successful SSH connection and internet access, run the installation command in the VTX console:
```bash
curl -L -o /tmp/openipc.ssc338q-nor-apfpv-greg08RC2.tgz \
https://github.com/sickgreg/OpenIPC_sickgregFPV_apfpv/raw/main/openipc.ssc338q-nor-apfpv-greg08RC2.tgz && \
sysupgrade --archive=/tmp/openipc.ssc338q-nor-apfpv-greg08RC2.tgz -f -n
```

Press `Enter` to start the process.

**Installation process:**
```
[1/4] Downloading firmware...
[2/4] Verifying integrity...
[3/4] Installing system...
[4/4] Rebooting...
```

Process duration: 5-10 minutes. The VTX will reboot automatically when finished.

::: warning Important
Disconnect the Ethernet cable after installation is complete for the video stream to work correctly.
:::

---

**Further configuration**

The APFPV firmware is installed. Further configuration follows the standard OpenIPC APFPV structure and conventions.

Detailed information is available in the repository: [OpenIPC_sickgregFPV_apfpv](https://github.com/sickgreg/OpenIPC_sickgregFPV_apfpv)
