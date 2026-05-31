---
title: "Map navigation - OpenIPC 4G/LTE"
description: "Guide to using the interactive map in the QuadroFleet system"
---

This section explains how to use the interactive map window in the control applications. The map shows the drone's current position in real time and lets you mark waypoints for navigation.

Before continuing, make sure the application is correctly installed and configured. If the setup is not yet complete, refer to the following guide: [Update Settings](/en/software/update-settings)

<center><img src="/images/map.jpg" alt="OpenIPC LTE Map" width="2000px"/></center>


<h3>Launching the map</h3>

When the desktop version of the drone control app starts, an icon appears in the **system tray** next to the main video stream window.

Right-click this icon and select **Map** — this opens the **Navigation Map** browser window, which shows the drone's current position based on GPS sensor data.

<h3>Information widgets</h3>

In the top-left corner of the map window three widgets are shown:

1. **Pitch, roll and yaw indicators**, together with an artificial **horizon**
2. **Battery status** and current **voltage**
3. **Drone heading** based on the compass

<h3>Working with waypoints</h3>

Waypoints can be **added, changed and deleted** directly on the map:

* **Left-click on an empty area** adds a new waypoint of type *Point of Interest*.
* **Clicking an existing Point of Interest** switches its type to *Home*. The icon updates and shows a house symbol.
* **Clicking the Home point again** removes it from the map.

<h3>Synchronization with OSD</h3>

All waypoint changes are instantly reflected in the **video stream OSD**, both in the **waypoint list with distances** and on the **compass overlay**, which provides directional guidance.
