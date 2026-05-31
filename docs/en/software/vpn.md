---
title: "VPN setup for OpenIPC 4G"
description: "VPN for OpenIPC 4G — a detailed WireGuard setup guide to ensure low latency and secure drone control"
---
<img src="/images/WireGuard-Logo.wine.svg" alt="WireGuard Logo" width="320" height="120" style="object-fit: contain;">

**WireGuard VPN** provides secure, low-latency communication between the QuadroFleet drone and the operator's device.
This guide covers setting up the VPN server and configuring the clients.

---

**Prerequisites**

* A virtual private server (VPS) or a local PC with a public IP address.
* Administrator rights to install WireGuard.
* A PC or smartphone for the operator control application.
* An OpenIPC drone camera with a 4G/5G modem and a SIM card.

---

### Step 1: Installing WireGuard on the VPN server

On a VPS or local PC (Ubuntu/Debian recommended):

```bash
sudo apt update
sudo apt install wireguard
```

Generate the private and public keys:

```bash
wg genkey | tee /etc/wireguard/privatekey | wg pubkey > /etc/wireguard/publickey
```

Example keys:

* VPN server private key: `sHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxFM=`
* VPN server public key: `lYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx08=`

Similarly, generate keys for the operator device and the drone:

* `yIxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxG4=` — operator device private key
* `VGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxnk=` — operator device public key
* `QExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxXY=` — drone (OpenIPC Camera) private key
* `TmxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxEc=` — drone public key

---

WireGuard configuration file (`/etc/wireguard/wg0.conf`):

```ini
[Interface]
Address = 10.253.0.1/24
ListenPort = 51820
PrivateKey = sHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxFM=

[Peer]
# Operator device (PC/phone)
PublicKey = VGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxnk=
AllowedIPs = 10.253.0.3/32

[Peer]
# Drone (OpenIPC Camera)
PublicKey = TmxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxEc=
AllowedIPs = 10.253.0.2/32
```

Start the WireGuard service:

```bash
sudo systemctl enable wg-quick@wg0
sudo systemctl start wg-quick@wg0
```

Open the firewall port (51820/UDP):

```bash
sudo ufw allow 51820/udp
```

---

### Step 2: Operator device configuration

Install WireGuard on your PC or smartphone:

* Ubuntu/Debian: `sudo apt install wireguard`
* Windows/macOS: download from [WireGuard](https://www.wireguard.com/install/)
* Android/iOS: install the WireGuard app from Google Play / App Store

Create a client configuration file:

```ini
[Interface]
PrivateKey = yIxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxG4=
Address = 10.253.0.3/24

[Peer]
PublicKey = lYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx08=
AllowedIPs = 10.253.0.0/24
Endpoint = <VPS_PUBLIC_IP>:51820
PersistentKeepalive = 25
```

* Replace `PrivateKey` and `PublicKey` with your own values.
* Replace `<VPS_PUBLIC_IP>` with the VPS public IP address.

Activate the VPN tunnel:

* **Windows:** launch WireGuard and activate the new connection
* **Linux:** `wg-quick up ./client.conf`
* **Mobile:** import the config into the WireGuard app and activate

---

### Step 3: OpenIPC drone camera configuration

1. Log in to the camera's web interface (default IP via DHCP).
2. Go to **Extensions > WireGuard** and set:

```ini
[Interface]
PrivateKey = QExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxXY=

[Peer]
PublicKey = lYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx08=
AllowedIPs = 10.253.0.0/24
Endpoint = <VPS_PUBLIC_IP>:51820
PersistentKeepalive = 25
```

* Replace `PrivateKey` and `PublicKey` with your own values.
* Replace `<VPS_PUBLIC_IP>` with the VPS public IP address.

Update the network interface configuration:

```bash
auto wg0
iface wg0 inet static
   address 10.253.0.2
   netmask 255.255.255.0
   pre-up modprobe wireguard
   pre-up ip link add dev wg0 type wireguard
   pre-up wg setconf wg0 /etc/wireguard.conf
   post-down ip link del dev wg0
```

::: info Note
Reboot the camera to apply the changes.
:::

---

### Step 4: Verifying the connection

* Ping the drone's VPN IP (10.253.0.2) from the operator device (10.253.0.3).
* Check access to the camera web interface over the VPN.
* Test UDP communication in the QuadroFleet app (PC or mobile).

---

::: info Notes
- Use a low-latency VPS (for example, one located in Kyiv or as close to your location as possible) for optimal performance. 
- Installing the VPN server on a local PC reduces latency but complicates the configuration. 
- If the server is on a local PC — set up **port forwarding** (51820/UDP) on the router.
- Make sure the SIM card supports 4G/5G and has enough data.
:::
