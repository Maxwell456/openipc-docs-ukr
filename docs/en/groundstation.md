---
title: Runcam WifiLink VRX Setup Guide
description: Step-by-step guide for configuring the Runcam WifiLink VRX: connection, WebUI, channels, DVR, and RSSI monitoring
---

# VRX Configuration Guide

## Runcam WifiLink Receiver

<div style="text-align: center;">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/BP7Ns7H9wvI?si=sUkZiTPDYfQbjkLS" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

!!! warning "Attention"
    Do not power on the VRx if the HDMI cable is connected and the HDMI source is turned off — this may damage the HDMI output!

1. Connect **DC 9–30V** power and a **miniHDMI-to-HDMI** cable to your goggles or headset.
2. Use the **HID joystick** to configure the link channel (default is `161 → 5.8 GHz`).
3. Power on the drone and VRX. By default, both are set to channel `161` and resolution `1920×1080` — the image should appear within **10 seconds**.

<br>

💡 ***That's it! You're ready to fly digital with OpenIPC.***

---

## Additional Runcam VRX Settings

### 1. Accessing the WebUI

To change VRX resolution (FullHD or HD), enter **AP Mode (Wi-Fi Access Point mode)**:  
Hold the VRX joystick until you see **"AP mode ON"** on screen.

📶 A Wi-Fi network will appear: `RadxaGroundStation`  
🔑 Password: `radxaopenipc`

Then open a browser and go to:

http://radxa-zero3.local/

> In the WebUI you can:  
> • change communication channels  
> • download or view DVR footage  
> • configure Adaptive Link  
> • select video resolution  
> • monitor the RSSI graph

---

### 2. Main WebUI Features

<img src="/images/homegs.png" alt="alink" width="1000px"/>

- **DVR**
- **VRX Settings**
- **Camera Settings**
- **RSSI Graph** *(available when there's a link between VRX and Air Unit)*

---

### 3. Setting Resolution

Navigate to **Groundstation Editor → Screen-mode → Edit**  
Set the resolution, for example: `1280×720` — it must **match the Air Unit settings**.

<img src="/images/gs-edit.png" alt="alink" width="1000px"/>

---

### 4. Setting Communication Channel

Go to **Groundstation Editor → wifibroadcast.cfg → Edit**  
Set a different communication channel (e.g., `140`, `64`, etc.) —  
**it must match the channel on the Air Unit**.

<img src="/images/gs-channel.png" alt="alink" width="1000px"/>

#### 📡 5.8 GHz Communication Channel Table (20 MHz)

<table style="width:100%; border-collapse: collapse; margin: 15px 0;">
  <thead>
    <tr>
      <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">№ каналу</th>
      <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Частота (MHz)</th>
      <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Примітка</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">36</td><td style="padding: 8px; border: 1px solid #ddd;">5180</td><td style="padding: 8px; border: 1px solid #ddd;">Wi-Fi</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">40</td><td style="padding: 8px; border: 1px solid #ddd;">5200</td><td style="padding: 8px; border: 1px solid #ddd;">Wi-Fi</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">44</td><td style="padding: 8px; border: 1px solid #ddd;">5220</td><td style="padding: 8px; border: 1px solid #ddd;">Wi-Fi</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">48</td><td style="padding: 8px; border: 1px solid #ddd;">5240</td><td style="padding: 8px; border: 1px solid #ddd;">Wi-Fi</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">52</td><td style="padding: 8px; border: 1px solid #ddd;">5260</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">56</td><td style="padding: 8px; border: 1px solid #ddd;">5280</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">60</td><td style="padding: 8px; border: 1px solid #ddd;">5300</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">64</td><td style="padding: 8px; border: 1px solid #ddd;">5320</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">100</td><td style="padding: 8px; border: 1px solid #ddd;">5500</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">104</td><td style="padding: 8px; border: 1px solid #ddd;">5520</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">108</td><td style="padding: 8px; border: 1px solid #ddd;">5540</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">112</td><td style="padding: 8px; border: 1px solid #ddd;">5560</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">116</td><td style="padding: 8px; border: 1px solid #ddd;">5580</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">120</td><td style="padding: 8px; border: 1px solid #ddd;">5600</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">124</td><td style="padding: 8px; border: 1px solid #ddd;">5620</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">128</td><td style="padding: 8px; border: 1px solid #ddd;">5640</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">132</td><td style="padding: 8px; border: 1px solid #ddd;">5660</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">136</td><td style="padding: 8px; border: 1px solid #ddd;">5680</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">140</td><td style="padding: 8px; border: 1px solid #ddd;">5700</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">144</td><td style="padding: 8px; border: 1px solid #ddd;">5720</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">149</td><td style="padding: 8px; border: 1px solid #ddd;">5745</td><td style="padding: 8px; border: 1px solid #ddd;">Without DFS (usually allowed)</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">153</td><td style="padding: 8px; border: 1px solid #ddd;">5765</td><td style="padding: 8px; border: 1px solid #ddd;">Without DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">157</td><td style="padding: 8px; border: 1px solid #ddd;">5785</td><td style="padding: 8px; border: 1px solid #ddd;">Without DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">161</td><td style="padding: 8px; border: 1px solid #ddd;">5805</td><td style="padding: 8px; border: 1px solid #ddd;">Most popular</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">165</td><td style="padding: 8px; border: 1px solid #ddd;">5825</td><td style="padding: 8px; border: 1px solid #ddd;">Without DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">169</td><td style="padding: 8px; border: 1px solid #ddd;">5845</td><td style="padding: 8px; border: 1px solid #ddd;"><em>Non-standard</em></td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">173</td><td style="padding: 8px; border: 1px solid #ddd;">5865</td><td style="padding: 8px; border: 1px solid #ddd;"><em>Non-standard</em></td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">177</td><td style="padding: 8px; border: 1px solid #ddd;">5885</td><td style="padding: 8px; border: 1px solid #ddd;"><em>Non-standard</em></td></tr>
  </tbody>
</table>

> **❗ What is DFS (Dynamic Frequency Selection):**  
> DFS allows Wi-Fi or FPV devices to operate on frequencies that may overlap with radar systems (e.g., military or weather).  
> If radar activity is detected, the device will automatically switch to another channel.

---

### 5. Camera (Air Unit) Configuration

Navigate to:  
**Camera Settings → Load Current Config**

- Wait for the camera settings to load  
- Make necessary changes  
- Save  
- Reboot **Majestic**

<img src="/images/gs-majestic.png" alt="alink" width="1000px"/>
<img src="/images/gs-majestic1.png" alt="alink" width="1000px"/>

---

### 6. RSSI Graph

The **RSSI** graph shows real-time signal strength and link quality.  
This helps evaluate antenna placement and link stability.

<img src="/images/gs-rssi.png" alt="alink" width="1000px"/>

---

### 7. DVR

Download or delete your flight recordings.

<img src="/images/dvr.png" alt="alink" width="1000px"/>

---

### 8. Connecting Radxa to a Home Network

 **Required Software**

1. Win32 Disk Imager  
2. SD Memory Card Formatter  
3. PuTTY (SSH)  
4. WinSCP (FTP)  

 **Initial Radxa Setup**

1. Write the Radxa image (version 1.9.9) to a microSD card using Win32 Disk Imager.
2. Insert the card, connect a keyboard and monitor, and power off the Wi-Fi module (⚠️important).
3. Power on the board, log in via SSH (root/root).
4. Use `nmtui` to connect to your home Wi-Fi → reboot.
5. (Optional) AP Mode → access WebUI at radxa-zero3.local.

<img src="/images/multiconf.png" alt="alink" width="800px"/><br>

**Runcam WiFiLink v1/v2 Camera Setup**

 1. Connect the network cable to the router or PC (IP 192.168.1.10).
 2. Launch OpenIPC Configurator → Connect → select your camera.
 3. **Camera**: set resolution (1920×1080 or 1280×720) → Bitrate (e.g. 12,228 kbps; with Alink – auto)
 4. **Telemetry**: enable UART0 + Mavlink → restart
 5. **Firmware**: update firmware → Update
 6. **Advanced**: enable Alink → check logs

