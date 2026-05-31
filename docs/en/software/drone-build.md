---
title: "OpenIPC 4G firmware for QuadroFleet"
description: "Step-by-step flashing of drone cameras with the QuadroFleet client and 4G modem setup"
---

# OpenIPC 4G firmware for QuadroFleet

Drone build

This guide describes the components and steps for assembling the **QuadroFleet** drone module. The system is designed to be compatible with off-the-shelf FPV components, which reduces cost and ensures performance.

Specification

<table>
  <thead>
    <tr>
      <th>Category</th>
      <th>Component</th>
      <th>Approx. price (€)</th>
      <th>Link</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="5"><strong>Frame and drone core</strong></td>
      <td>Mark4 7-inch frame</td>
      <td>16</td>
      <td><a href="https://aliexpress.com/item/1005007050005578.html">AliExpress</a></td>
    </tr>
    <tr>
      <td>iFlight XING E Pro 2207 1800KV 6S (4x)</td>
      <td>50</td>
      <td><a href="https://aliexpress.com/item/1005006356256645.html">AliExpress</a></td>
    </tr>
    <tr>
      <td>SpeedyBee F405 V4 FC + 55A ESC Stack</td>
      <td>80</td>
      <td><a href="https://aliexpress.com/item/1005006809684035.html">AliExpress</a></td>
    </tr>
    <tr>
      <td>Gemfan Hurrikan MCK v2 (2 pairs)</td>
      <td>3</td>
      <td><a href="https://aliexpress.com/item/1005006741863428.html">AliExpress</a></td>
    </tr>
    <tr>
      <td>GEP-M10Q GPS (optional, recommended)</td>
      <td>25</td>
      <td><a href="https://aliexpress.com/item/1005004752373178.html">AliExpress</a></td>
    </tr>
    <tr>
      <td rowspan="3"><strong>Video system</strong></td>
      <td>SSC30KQ Camera + 1.7mm Lens (OpenIPC)</td>
      <td>27</td>
      <td><a href="https://de.aliexpress.com/item/1005006835439125.html">AliExpress</a></td>
    </tr>
    <tr>
      <td>Quectel EC25 4G Modem</td>
      <td>40</td>
      <td><a href="https://de.aliexpress.com/item/1005002330780040.html">AliExpress</a></td>
    </tr>
    <tr>
      <td>4G FPC-Antenna Signal Booster</td>
      <td>2</td>
      <td><a href="https://de.aliexpress.com/item/1005004592746304.html">AliExpress</a></td>
    </tr>
    <tr>
      <td rowspan="2"><strong>Power system</strong></td>
      <td>DC-DC 12V-5V 3A Buck Converter</td>
      <td>2</td>
      <td><a href="https://de.aliexpress.com/item/1005002163078645.html">AliExpress</a></td>
    </tr>
    <tr>
      <td>3S/6S LiPo Battery Pack (3000–6000mAh)</td>
      <td>20–90</td>
      <td>Various</td>
    </tr>
    <tr>
      <td><strong>Misc</strong></td>
      <td>Wires, XT60/XT30 connectors, mounts</td>
      <td>~10</td>
      <td>Local/Various</td>
    </tr>
    <tr>
      <td><strong>Control</strong></td>
      <td>XBOX/PlayStation/FPV RC Controller (USB)</td>
      <td>Varies</td>
      <td>Local/Various</td>
    </tr>
    <tr>
      <td><strong>Connectivity</strong></td>
      <td>SIM card with mobile data (4G/5G)</td>
      <td>Varies</td>
      <td>Local carrier</td>
    </tr>
  </tbody>
</table>

**Estimated total cost:** €275–345 (excluding the controller and SIM card).
::: info Note
 If the component links are no longer available, try searching by name.  
**5G modems:** You can also use 5G modems, but they are currently significantly more expensive than 4G.
:::

---

### Assembly steps

Frame and core

**Preparing the main drone components and installing the base systems**

- Assemble the **Mark4 7-inch** frame according to the manufacturer's instructions
- Install the **iFlight XING E Pro 2207** motors (4 pcs.) and secure them to the frame
- Place the **SpeedyBee F405 V4 FC + ESC stack** in the center, keeping the UART ports accessible
- *(Optional)* Install the **GEP-M10Q GPS module** for improved tracking
- *(Optional)* Print cases for the **SSC30KQ** and the GPS module (STL files available at the link)

---

### Video and connectivity

**Setting up the video transmission system and network connectivity**

- Install the **SSC30KQ** camera with a **1.7mm** lens, ensuring a clear forward view
- Connect the camera to a **UART port** of the flight controller (e.g. UART2) for CRSF telemetry
- Connect the **DC-DC buck converter** to power the camera and modem (5V, 3A)
- Install the **Quectel EC25 4G modem** and connect the **4G FPC antenna** for optimal signal

---

### Power system

**Providing reliable power to all system components**

- Connect the **3S/6S** battery to the **ESC** via the **XT60** connector
- Connect the buck converter to the battery (12V input → 5V output for the camera and modem)
- Make sure all connections are insulated to avoid short circuits

---

### Wiring

**Wiring diagram and cable management**

**Main connections:**

- **Camera ↔ Flight controller:** UART (TX/RX) for the CRSF protocol
- **Modem ↔ Camera:** USB for data transfer  
- **Buck converter:** Battery → 12V input, 5V output to the modem
::: warning Important!
 Secure the wires with zip ties to minimize the risk of vibration damage.
:::

<center><img src="/images/bilddrone.png" alt="OpenIPC 4G" width="1000px"/></center>

### Testing

1. Power on the drone and verify that the flight controller boots correctly.  
2. Check the camera connection (or flash it first) through the **OpenIPC** web interface (default IP via DHCP).  
3. Test the modem connection: insert the SIM card and confirm there is a **4G/5G** signal.  
4. Install the **Gemfan Hurrikan MCK v2** propellers, checking the correct rotation direction (**CW/CCW**).  
