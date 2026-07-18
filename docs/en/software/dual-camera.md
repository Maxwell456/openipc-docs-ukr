---
title: "AI Dual Camera — OpenIPC FPV"
description: "AI Dual Camera in OpenIPC FPV: a day camera + thermal camera with in-flight switching, onboard object detection (YOLOv8n on the SigmaStar IPU) and MAVLink OSD on the VRX. Ready-made file archive and exact commands."
---

# AI Dual Camera

A "two camera" scenario in OpenIPC FPV: a **day camera** (OpenIPC) and a **thermal camera** (via a Raspberry Pi) run on the same drone, and the pilot **switches between them in flight**. Both streams are merged into a **single WFB transmitter** through `socat`, and **onboard object detection** is overlaid on the day camera — the **YOLOv8n** model running on the SigmaStar hardware **IPU** accelerator.

::: tip 📦 Installation files
All required binaries, configs and scripts are bundled in a single archive.

**➜ [Download the "AI Dual Camera" archive](/downloads/OpenIPC_AI_Object_Detection_Dual_Cam.7z)**

Extract the archive and run the commands below **from the folder where you extracted the files**.
:::

::: danger Advanced users only
This guide is highly technical and modifies system files on both the camera and the ground station. It is intended for **experienced users and developers**. Everything you do is **at your own risk**.
:::

---

## How it works

- Two cameras, **one WFB link**, in-flight switching via the **`socat`** utility.
- The **day camera** (OpenIPC) sends its stream to port **`5500`**.
- The **thermal camera** (via Raspberry Pi, **H.264**) sends its stream to port **`5600`**.
- Depending on the switch, `socat` takes the stream from `5500` **or** `5600` and forwards it to a local **Unix RTP** socket → **WFB** → transmission to the ground station.
- Instead of Majestic, the **`venc`** streamer runs with object detection (implemented by Milos): it runs **per frame, before encoding**, using the **YOLOv8n (352px)** model on the **IPU** driver (`mi_ipu.ko`).

<figure style="margin:1.75rem 0;overflow-x:auto">
<svg viewBox="0 0 680 224" role="img" aria-labelledby="dcflow-t2 dcflow-d2" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:680px;height:auto;display:block;margin:0 auto;font-family:var(--vp-font-family-base,system-ui,sans-serif)">
<title id="dcflow-t2">Two-camera data flow</title>
<desc id="dcflow-d2">The day camera and thermal camera send streams to socat, which switches between them and transmits over WFB to the VRX.</desc>
<defs>
<marker id="dc-arrow2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--vp-c-text-3,#8b949e)"/></marker>
</defs>
<path id="p-day2" d="M196,52 C242,52 250,116 286,116" fill="none" style="stroke:var(--vp-c-divider,#d0d7de);stroke-width:1.5" marker-end="url(#dc-arrow2)"/>
<path id="p-th2" d="M196,180 C242,180 250,116 286,116" fill="none" style="stroke:var(--vp-c-divider,#d0d7de);stroke-width:1.5" marker-end="url(#dc-arrow2)"/>
<path id="p-sw2" d="M378,116 L436,116" fill="none" style="stroke:var(--vp-c-divider,#d0d7de);stroke-width:1.5" marker-end="url(#dc-arrow2)"/>
<path id="p-wv2" d="M520,116 L580,116" fill="none" style="stroke:var(--vp-c-divider,#d0d7de);stroke-width:1.5" marker-end="url(#dc-arrow2)"/>
<circle r="4" style="fill:var(--vp-c-brand-1,#3451b2)"><animateMotion dur="1.9s" repeatCount="indefinite"><mpath href="#p-day2"/></animateMotion></circle>
<circle r="4" style="fill:var(--vp-c-brand-1,#3451b2)"><animateMotion dur="1.9s" begin="-0.95s" repeatCount="indefinite"><mpath href="#p-day2"/></animateMotion></circle>
<circle r="4" style="fill:#f0883e"><animateMotion dur="1.9s" repeatCount="indefinite"><mpath href="#p-th2"/></animateMotion></circle>
<circle r="4" style="fill:#f0883e"><animateMotion dur="1.9s" begin="-0.95s" repeatCount="indefinite"><mpath href="#p-th2"/></animateMotion></circle>
<circle r="4" style="fill:var(--vp-c-brand-1,#3451b2)"><animateMotion dur="1.1s" repeatCount="indefinite"><mpath href="#p-sw2"/></animateMotion></circle>
<circle r="4" style="fill:var(--vp-c-brand-1,#3451b2)"><animateMotion dur="1.1s" begin="-0.55s" repeatCount="indefinite"><mpath href="#p-sw2"/></animateMotion></circle>
<circle r="4" style="fill:var(--vp-c-brand-1,#3451b2)"><animateMotion dur="1.1s" repeatCount="indefinite"><mpath href="#p-wv2"/></animateMotion></circle>
<circle r="4" style="fill:var(--vp-c-brand-1,#3451b2)"><animateMotion dur="1.1s" begin="-0.55s" repeatCount="indefinite"><mpath href="#p-wv2"/></animateMotion></circle>
<rect x="14" y="24" width="182" height="56" rx="11" style="fill:var(--vp-c-bg-soft,#f6f8fa);stroke:var(--vp-c-divider,#d0d7de);stroke-width:1.5"/>
<text x="105" y="49" text-anchor="middle" style="font-size:13px;font-weight:600;fill:var(--vp-c-text-1,#1f2328)">Day camera</text>
<text x="105" y="66" text-anchor="middle" style="font-size:9.5px;fill:var(--vp-c-text-2,#636c76)">OpenIPC · venc + YOLOv8n</text>
<rect x="14" y="152" width="182" height="56" rx="11" style="fill:var(--vp-c-bg-soft,#f6f8fa);stroke:var(--vp-c-divider,#d0d7de);stroke-width:1.5"/>
<text x="105" y="177" text-anchor="middle" style="font-size:13px;font-weight:600;fill:var(--vp-c-text-1,#1f2328)">Thermal camera</text>
<text x="105" y="194" text-anchor="middle" style="font-size:9.5px;fill:var(--vp-c-text-2,#636c76)">Raspberry Pi · H.264</text>
<rect x="286" y="94" width="92" height="44" rx="11" style="fill:var(--vp-c-brand-soft,rgba(100,108,255,0.14));stroke:var(--vp-c-brand-1,#3451b2);stroke-width:1.8"><animate attributeName="stroke-width" values="1.8;3;1.8" dur="1.9s" repeatCount="indefinite"/></rect>
<text x="332" y="112" text-anchor="middle" style="font-size:13px;font-weight:600;fill:var(--vp-c-text-1,#1f2328)">socat</text>
<text x="332" y="128" text-anchor="middle" style="font-size:9px;fill:var(--vp-c-text-2,#636c76)">switch</text>
<rect x="436" y="94" width="84" height="44" rx="11" style="fill:var(--vp-c-bg-soft,#f6f8fa);stroke:var(--vp-c-divider,#d0d7de);stroke-width:1.5"/>
<text x="478" y="120" text-anchor="middle" style="font-size:13px;font-weight:600;fill:var(--vp-c-text-1,#1f2328)">WFB</text>
<rect x="580" y="94" width="86" height="44" rx="11" style="fill:var(--vp-c-bg-soft,#f6f8fa);stroke:var(--vp-c-divider,#d0d7de);stroke-width:1.5"/>
<text x="623" y="120" text-anchor="middle" style="font-size:13px;font-weight:600;fill:var(--vp-c-text-1,#1f2328)">VRX</text>
<text x="246" y="70" text-anchor="middle" style="font-size:10px;font-weight:500;fill:var(--vp-c-text-2,#636c76)">RTP :5500</text>
<text x="246" y="166" text-anchor="middle" style="font-size:10px;font-weight:500;fill:var(--vp-c-text-2,#636c76)">Ethernet :5600</text>
<text x="407" y="108" text-anchor="middle" style="font-size:10px;font-weight:500;fill:var(--vp-c-text-2,#636c76)">Unix RTP</text>
<text x="550" y="108" text-anchor="middle" style="font-size:10px;font-weight:500;fill:var(--vp-c-text-2,#636c76)">RF</text>
</svg>
<figcaption style="margin-top:.5rem;text-align:center;font-size:.8rem;color:var(--vp-c-text-2)">Data flow: two cameras → <strong>socat</strong> (switch) → WFB → VRX</figcaption>
</figure>

---

## Hardware (example build)

| Component | What was used |
| :--- | :--- |
| **Day camera + VTX** | EMAX Wi-Fi Link (v1) + the Wi-Fi adapter from a RunCam Wi-Fi Link (v1). **Any OpenIPC camera on SigmaStar** works |
| **Thermal camera** | USB thermal module → **Raspberry Pi Zero 2W** ("3B mini") with an **SPI-Ethernet** adapter; SD card with a **URLLC AIO (OR)** image |
| **Wired link** | Ethernet between the Raspberry Pi and the OpenIPC camera (via the SPI adapter) |
| **Flight controller** | Betaflight (12/2025) + **GPS** for position hold |
| **Ground station (VRX)** | the new EMAX VRX (or RunCam VRX / Eachine VRX / old EMAX VRX) |

---

## What you'll need

- **PuTTY** — the `plink` and `pscp` tools in PATH (the commands below are for Windows). On Mac/Linux use the `ssh` / `scp` equivalents.
- The [**"AI Dual Camera" archive**](/downloads/OpenIPC_AI_Object_Detection_Dual_Cam.7z) with the binaries, configs and scripts.
- An OpenIPC camera on **SigmaStar (SSC338Q)** with SSH access (`root` / `12345`).

---

## Step 0. Preparation

1. Extract the archive, open **CMD** and navigate to the folder with the extracted files.
2. Connect the camera to your laptop **directly with an Ethernet cable** (not through a router).
3. Set the laptop's Ethernet adapter IP to **`192.168.1.11`** (mask `255.255.255.0`). The camera has address **`192.168.1.10`**.
4. *(If needed)* reset the camera to its original state with `firstboot` in its console. **Do not interrupt** the process.

---

## Step 1. Install files onto the camera (VTX)

Run the commands **one by one** from the folder with the extracted archive:

```bash
plink -ssh root@192.168.1.10 -pw 12345 killall majestic "&&" rm /usr/bin/majestic "&&" mkdir /config "&&" mkdir /config/dla "&&" mkdir /root/models/
pscp -scp -pw 12345 mi_ipu.ko root@192.168.1.10:/lib/modules/4.9.84/sigmastar/
pscp -scp -pw 12345 ipu_firmware.bin root@192.168.1.10:/config/dla/
pscp -scp -pw 12345 yolov8n352drone.img root@192.168.1.10:/root/models/
pscp -scp -pw 12345 libipu_yolo_worker.so root@192.168.1.10:/root/
pscp -scp -pw 12345 venc socat mavlink-routerd channels.sh root@192.168.1.10:/usr/bin
pscp -scp -pw 12345 venc.json txprofiles.conf root@192.168.1.10:/etc
plink -ssh root@192.168.1.10 -pw 12345 dos2unix /etc/venc.json "&&" dos2unix /etc/txprofiles.conf "&&" dos2unix /usr/bin/channels.sh "&&" chmod +x /usr/bin/channels.sh "&&" chmod +x /usr/bin/venc "&&" chmod +x /usr/bin/socat "&&" chmod +x /usr/bin/mavlink-routerd
pscp -scp -pw 12345 libmi_vif.so libmi_isp.so libcus3a.so libispalgo.so libmi_vpe.so libmi_sensor.so libmi_venc.so libmi_ipu.so libcam_fs_wrapper.so root@192.168.1.10:/usr/lib
```

---

## Step 2. Edit files on the camera

Three files are edited manually. The archive itself contains ready-made `wifibroadcast` and `S95majestic` files you can use as a reference.

### `/usr/bin/wifibroadcast`

In the `start_telemetry` function, under the `mavfwd` command, add the `mavlink-routerd &` line:

```bash
if [ "$router" = "mavfwd" ]; then
                mavfwd -b 115200 -c 8 -p 100 -a 15 -t -m /dev/"$serial" \
                        -o 127.0.0.1:14552 -i 127.0.0.1:"$port_rx" > /dev/null &
                mavlink-routerd &
```

### `/etc/init.d/S95majestic`

Make the beginning of the file look like this (the `venc` streamer + loading the IPU driver):

```bash
#!/bin/sh

DAEMON="venc"
PIDFILE="/var/run/$DAEMON.pid"
DAEMON_ARGS="-s"

start() {
        echo -n "Starting $DAEMON: "
        insmod /lib/modules/4.9.84/sigmastar/mi_ipu.ko
        start-stop-daemon -b -m -S -q -p "$PIDFILE" -x "$DAEMON" -- $DAEMON_ARGS
        if [ $? -eq 0 ]; then
                echo "OK"
        else
                echo "FAIL"
        fi
}
```

### `/etc/mavlink.conf` (create a new file)

```ini
[General]
TcpServerPort = 0

[UdpEndpoint telemetry_tx]
Mode = Normal
Address = 127.0.0.1
Port = 14551

[UdpEndpoint telemetry_tx2]
Mode = Normal
Address = 192.168.1.50
Port = 14551

[UdpEndpoint telemetry_rx]
Mode = Server
Address = 127.0.0.1
Port = 14552
```

---

## Step 3. Ground station menu (gsmenu)

In the GS menu, change three parameters:

1. **Router** (the *Telemetry* submenu) → `mavfwd`
2. **txpower** (the *Alink* submenu) → `3` or `4`
3. **Mlink** (the *WFB-NG* submenu) → `2000`

---

## Step 4. Thermal camera on the Raspberry Pi

1. Flash the SD card with the **URLLC AIO (OR)** image and insert it into the **Raspberry Pi Zero 2W**.
2. Connect the **USB thermal camera** to the Raspberry Pi.
3. A wired **Ethernet link** (via the SPI adapter) connects the Raspberry Pi to the OpenIPC camera — the thermal stream (H.264) arrives on port **`5600`**.

---

## Step 5. VRX: MAVLink OSD + PixelPilot auto-decoder

Since MAVLink is now in use, OSD can't be shown on the camera side — we display it on the VRX.

Enable the **WiFi Hotspot** in the VRX gsmenu and connect a computer to the **`OpenIPC GS`** network (password `12345678`). Then, from CMD:

```bash
plink -ssh root@192.168.4.1 -pw 12345 killall pixelpilot
pscp -scp -pw 12345 pixelpilot gsmenu.sh root@192.168.4.1:/usr/bin/
pscp -scp -pw 12345 h264.png h265.png h264.svg h265.svg root@192.168.4.1:/usr/share/pixelpilot/
pscp -scp -pw 12345 osd.json root@192.168.4.1:/etc/pixelpilot/
plink -ssh root@192.168.4.1 -pw 12345 dos2unix /etc/pixelpilot/osd.json "&&" dos2unix /usr/bin/gsmenu.sh "&&" chmod +x /usr/bin/pixelpilot "&&" chmod +x /usr/bin/gsmenu.sh "&&" reboot
```

::: info
The first three commands (`killall pixelpilot` and copying `pixelpilot` / `gsmenu.sh` / the icons) are **not required** if your SBC Buildroot is updated to a build from **11/07/2026** or newer.
:::

Then SSH into the VRX SBC Buildroot (`192.168.4.1`, `root` / `12345`) and in the new gsmenu change **codec** to **`auto`**, then reboot.

---

## Result

- The **thermal** switch → picture from the thermal camera.
- The **day** switch → video from the EMAX/RunCam VTX with **object detection overlaid**.
- On the VRX — **MAVLink OSD** with telemetry; PixelPilot auto-detects the codec (**H.265** from OpenIPC or **H.264** from the Raspberry Pi).

---

## Limitations

- This is **switching** between two cameras (one on air at a time), not two simultaneous streams.
- The commands are for **Windows** (PuTTY: `plink` / `pscp`); on Mac/Linux use `ssh` / `scp`.
- The streamer, scripts and images are **third-party**; always test everything **on the ground** first.

---

## Related

[Greg's APFPV](/en/software/apfpv-greg) · [OpenIPC Mario AIO](/en/hardware/vtx/marioaio) · [PixelPilot](/en/software/pixelpilot)
