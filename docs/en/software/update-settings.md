---
title: "Updating OpenIPC settings with the QuadroFleet firmware"
description: "Step-by-step QuadroFleet update"
---

This guide covers configuring the OpenIPC camera and the Masina client app for optimal QuadroFleet operation.

Prerequisites

* An OpenIPC camera with the QuadroFleet firmware.
* A running WireGuard VPN server (see VPN Setup).
* The QuadroFleet control app installed on a PC or smartphone.

<h3>Step 1: Configuring the OpenIPC camera</h3>

1. Access the camera's web interface via its IP address (`http://10.253.0.2/` if the VPN is configured).
2. Go to **Extensions** > **WireGuard** and configure:

```
host=10.253.0.3
LOCAL_TIMEOUT=300000
FAILSAFE_TIMEOUT=10000
STABILIZE_TIMEOUT=250
ELRS_SWITCH_PIN=0
CONTROL_PORT=2223
CAM_INFO_PORT=2224
```

   * `host`: IP address of the operator device (e.g. PC/phone) on the VPN.
   * `LOCAL_TIMEOUT`: Time (ms) before switching to ELRS mode (optional, set to 0 if not used).
   * `FAILSAFE_TIMEOUT`: Time (ms) before entering failsafe mode (e.g. RTH).
   * `STABILIZE_TIMEOUT`: Time (ms) before entering hover mode on connection loss.
   * `ELRS_SWITCH_PIN`: GPIO pin for the ELRS switch (0 if not used).
   * `CONTROL_PORT`: **remote and local** UDP port for control commands.
   * `CAM_INFO_PORT`: remote UDP port for camera telemetry.

3. Save and reboot the camera.

<h3>Step 2: Configuring the video stream</h3>

1. In the web interface, go to **Majestic** > **Settings**.
2. Configure the **Video0** parameters:

```
Video codec: h265
Video resolution: 960x720
Video frame rate: 60
Video bitrate: 256 kbps
```

3. Alternatively, use the runtime settings:

```
FPS: 60
Bitrate: 256 kbps
Video resolution: 960x720 4:3
```

4. Apply the changes and check the video stream through the control app.
5. Restart Majestic.

<h3>Step 3: Launching the control app</h3>

1. Launch the QuadroFleet app on your PC or smartphone.
2. Make sure the VPN tunnel is active (see VPN Setup).
3. Verify that the app receives video and telemetry:
   * Check the OSD for battery, GPS and speed data.
   * Confirm that the interactive map shows the drone's position.
