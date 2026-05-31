---
title: General guide to flashing via UART
description: A universal guide to flashing via UART using FTDI and TFTP
---
# How to recover absolutely any Air Unit on OpenIPC?  
**What you'll need**

- An FTDI FT232RL adapter  
- A miniUSB - USB cable  
- A few jumper wires

**Software**

- Download and install [**Putty**](https://www.putty.org/)
- Download and install [**Tftpd64**](https://tftpd32.jounin.net/)

---

**Flashing steps**

1. Open **CMD** or the Windows console and enter the command:

   ```
   ipconfig
   ```

   ![ipconfig](/images/runcamv1ip.png)

   Find your **IPv4 address**.

2. Run **Tftpd64**:

   ![Tftpd64](/images/tftpd.png)

   [Link to the guide](https://openipc.org/cameras/vendors/sigmastar/socs/ssc338q?locale=en)

3. Generate a **MAC address**, and in the **TFTP server** field enter your computer's IP address.

4. Click **Generate Instructions**.

5. Check the FTDI connection:

   ![FTDI](/images/ftdi.png)

   - **RX** → **TX**  
   - **TX** → **RX**  
   - **GND** → **GND**

::: warning Warning
Before powering on, make sure all UART connections are correct.  
An incorrect connection can damage the device.
:::

::: tip Tip
Find the correct UART interface according to your hardware's documentation.
:::

6. Solder the FTDI outputs to the UART pins on the board.

7. Open **Device Manager**, plug in the FTDI USB and find the COM port (e.g. **COM3**).

8. Run Putty with the appropriate COM port:

```bash
putty.exe -serial COM3 -sercfg 115200,8,n,1,N   
```
9. A **Putty** window will open.

10. Connect power to the FTDI and to the Runcam v1.

::: tip Tip
Open Putty **before** powering on, so you can see the device boot log.
:::

11. If everything is connected correctly, you will see the log in Putty:

   ![Putty log](/images/runcamv1putty.png)

12. Go to the instructions page:  
[https://openipc.org/cameras/vendors/sigmastar/socs/ssc338q](https://openipc.org/cameras/vendors/sigmastar/socs/ssc338q)

13. Copy the `.bin` firmware file into the TFTP folder:

   ![Firmware file](/images/runcamv1tftp1.png)

14. Run the commands from the site **one line at a time**, do not paste everything at once:

   ![Flashing commands](/images/runcamv1firmware.png)

::: tip Tip
Run one line at a time, do not paste several commands at once.
:::

15. **If after the third command the download does not happen** — check the TFTP server settings.

::: tip Tip
Make sure a firewall or antivirus is not blocking the TFTP server.
:::

16. **Example IP address configuration:**
   - Device IP: `192.168.0.123`
   - Computer IP: `192.168.0.40`

17. After a successful boot via UART you can flash the **WiFiLink firmware** via the [Multiconfigurator](https://github.com/OpenIPC/openipc-configurator/releases/)
