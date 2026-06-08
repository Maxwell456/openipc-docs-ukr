---
title: "QuadroFleet OpenIPC — 4G/LTE FPV Platform"
description: "QuadroFleet — an open modular platform for controlling FPV drones over mobile networks. Low-latency video, GPS tracking, secure VPN, OSD and gamepad support for hobby and professional use."
---

# QuadroFleet OpenIPC — 4G/LTE FPV Platform

<img src="/images/quadrofleet.svg" alt="OpenIPC 4G" width="500px"/>

---

[**QuadroFleet**](https://quadrofleet.com/) is a modular open-source platform for controlling FPV drones over mobile networks.
It integrates low-latency video streaming, secure communication and reliable safety features, making it suitable for both hobby and professional applications.

<a href="https://github.com/beep-systems/quadrofleet.github.io/raw/refs/heads/master/downloads/quadrofleet.msi"><img src="/images/Download-Windows-blue.svg" alt="Download Windows" height="50"></a>
<a href="https://quadrofleet.com/downloads/quadrofleet.deb"><img src="/images/Download-Linux-green.svg" alt="Download Linux" height="50"></a>
<a href="https://play.google.com/store/apps/details?id=systems.beep.christof&hl=en"><img src="/images/gp.png" alt="Download Android" width="140" height="45"></a>

---

::: warning Note!
This section is prepared as part of the **QuadroFleet** and **OpenFPV** project collaboration and is the official information source for the Ukrainian community.
:::

---

### Features

- **Low-latency video**: FPV streaming with &lt;100 ms latency using H.265.
- **Link loss handling**: configurable failsafe modes (hover, land or RTH) when signal is lost.
- **Live GPS tracking**: displays drone position on an interactive OpenStreetMap.
- **Extended range**: using 4G/5G networks allows flying far beyond traditional 2.4 GHz systems.
- **OSD (On-Screen Display)**: telemetry overlay (battery voltage, GPS coordinates, speed, altitude, compass) on the video stream.
- **Cross-platform control**: support for XBOX, PlayStation or RC controllers via USB.

---

### System Architecture

**QuadroFleet** operates on a client-server model where components communicate through a secure WireGuard VPN, using UDP for minimal latency.

### Drone Module

**Hardware:**

- OpenIPC-based IP camera (e.g. SSC30KQ, SSC338Q) for video and telemetry processing.
- 4G/5G modem (e.g. Quectel EC25, EP06) for internet access.
- Flight controller (e.g. SpeedyBee F405) connected via UART with CRSF protocol.

**Functionality:**

- H.265 streaming over UDP without additional synchronisation for reduced latency.
- Receiving CRSF control frames and forwarding them to the flight controller.
- Collecting and transmitting telemetry (battery, GPS, etc.) to the ground station.

---

### Ground Station (Operator Side)

**Hardware:** PC or smartphone with the QuadroFleet app.

**Functionality:**

- Connecting to the drone via WireGuard VPN tunnel.
- Reading joystick signals from a gamepad or RC transmitter.
- Encoding signals into CRSF frames and transmitting them over UDP.
- Decoding telemetry and overlaying it on the video stream.
- Displaying the drone's position in real time on an OpenStreetMap.

---

### VPN Server

**Purpose:** provides a secure, direct channel between the drone and the ground station.

**Setup:** WireGuard runs on a VPS or local PC and requires minimal configuration.

**Benefits:** simplifies network setup and ensures data privacy.

---

### Safety & Redundancy

- **Link loss:**
after 250 ms (configurable) the drone enters hover mode;
after 5 seconds (configurable) it lands or performs RTH according to the flight controller settings.

- **Redundancy:** optional ELRS (ExpressLRS) support for local control in case of mobile network failure.

<center><img src="/images/overview.webp" alt="OpenIPC 4G" width="800px"/></center>

### FPV Drone Module

The drone module combines:

- OpenIPC camera: connects to the flight controller via UART using CRSF for telemetry and control. Streams H.265 video over UDP.
- 4G/5G modem: provides internet connectivity for VPN and data transmission.
- Power management: a DC-DC step-down converter supplies stable 5V to the camera and modem.

<center><img src="/images/over2.webp" alt="OpenIPC LTE" width="800px"/></center>

### VPN Server

The VPN server creates a virtual private network that enables data exchange without additional network configuration.
In this setup the VPN connection allows the operator to quickly and easily connect directly to the drone.

<center><img src="/images/over3.webp" alt="OpenIPC LTE" width="800px"/></center>

### Operator App

The **QuadroFleet** control application is a Java-based program that includes:

- **SDL framework**: supports gamepad input (XBOX, PlayStation or RC controllers).
- **Web server**: runs a local interface that displays:
  - live video with OSD telemetry;
  - an interactive map for GPS tracking.
- **UDP communication**: sends control commands and receives telemetry/video.

Download the app:
- [**QuadroFleet for Windows (.msi)**](https://github.com/beep-systems/quadrofleet.github.io/raw/refs/heads/master/downloads/quadrofleet.msi)
- [**QuadroFleet for Linux (.deb)**](https://quadrofleet.com/downloads/quadrofleet.deb)
- [**QuadroFleet for Android (Google Play)**](https://play.google.com/store/apps/details?id=systems.beep.christof&hl=en)

<center><img src="/images/over4.webp" alt="OpenIPC LTE" width="800px"/></center>
