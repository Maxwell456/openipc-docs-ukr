---
title: "How to Build an OpenIPC Fiber-Optic Video Link"
description: Step-by-step build of a fiber-optic video link for an OpenIPC camera — Majestic-over-Ethernet setup, airborne module, fiber spool, ground-side RTSP decoding (mpv/GStreamer) and link verification.
sidebarTitle: "Fiber optic: build"
faq:
  - q: What IP address does the OpenIPC camera use?
    a: 192.168.1.10 by default. Give the ground device an address in the same subnet, e.g. 192.168.1.2, and the RTSP stream is available at rtsp://192.168.1.10/.
  - q: Do I need PixelPilot for fiber?
    a: No. PixelPilot targets WFB-NG. Over fiber the camera serves an ordinary RTSP stream, so any low-latency player works — mpv, ffplay or a GStreamer pipeline.
  - q: Can I disable Wi-Fi on the camera?
    a: Yes, and you should — with a fiber link the radio is not needed. Disabling it saves power and removes stray emission. Just make sure Ethernet access to the camera is kept.
  - q: Why does the link drop under load?
    a: The most common cause is a power sag on the media converter. Power it from a stable BEC and add a capacitor on the supply; unstable voltage upsets the optical module.
  - q: No Link LED on the converters — what should I check?
    a: Confirm the SFP modules are mirrored (opposite Tx/Rx wavelengths), clean the fiber end-faces and connectors, and measure the route loss. The most common mechanical cause is too small a bend radius.
---

# How to Build an OpenIPC Fiber-Optic Video Link

Step-by-step assembly of a link where an OpenIPC camera sends video to the ground over a single single-mode fiber. For the theory, component selection and optical budget see the overview: [OpenIPC fiber-optic video link for FPV drones](/en/software/fiber-optic).

::: warning Experimental setup
This is not an out-of-the-box OpenIPC feature but a community configuration. Test the link on the bench (a short patch cord) before flying, and always keep optical-budget margin.
:::

## What you need

| Component | Purpose |
|-----------|---------|
| OpenIPC camera with working Ethernet (e.g. SSC338Q/SSC30KQ) | Video source (Majestic RTSP/IP) |
| 2× Fast Ethernet media converters with SFP slot | Ethernet ↔ optics on both ends |
| 2× BiDi SFP (single-strand, mirrored 1310/1550 pair) | Transmission over one fiber |
| Single-mode G.657 fiber on a spool | Physical channel |
| BEC / power regulator for the airborne module | Powers camera + converter |
| Laptop or SBC on the ground | Decoding and display |

## Step 1. Configure the OpenIPC camera

The goal is a stable IP stream over Ethernet with a static address.

1. Connect the camera over Ethernet and log in via SSH (typically `192.168.1.10`, user `root`).
2. Set a **static IP address** (so you do not depend on DHCP in flight). In `/etc/network/interfaces` or via `fw_setenv` — depending on the build.
3. Confirm [Majestic](/en/software/wfb-ng) serves RTSP. The key settings live in `/etc/majestic.yaml`:

```yaml
# /etc/majestic.yaml (fragment)
video0:
  enabled: true
  codec: h265        # h265 is more efficient; h264 is more compatible
  fps: 60
  bitrate: 8192
rtsp:
  enabled: true
  port: 554
```

4. **Disable Wi-Fi** if present — with a fiber link it only draws current and emits.
5. Verify the stream locally before assembly:

```bash
# on a PC in the same subnet
ping 192.168.1.10
mpv --profile=low-latency --no-cache rtsp://192.168.1.10/
```

::: tip Exact RTSP address
The main Majestic stream is usually available at `rtsp://192.168.1.10/`. The exact path and whether a substream exists depend on your `majestic.yaml`.
:::

## Step 2. Airborne module

Assemble the **camera → media converter → SFP → fiber** chain on the drone.

1. Connect the camera's Ethernet output to the media converter's RJ45 with a short patch (or directly to RMII if the converter supports it).
2. Insert the airborne **BiDi SFP** into the converter slot.
3. Power the converter from a **BEC** of the correct voltage (usually 5 V). Do not power it "however" — a voltage sag drops the link.
4. Mount everything so vibration does not tug the optical connector, and the fiber exits toward the spool **without sharp bends**.

::: warning Bend radius
The most common cause of signal loss is too small a bend radius in the mount. Keep the radius larger than the minimum for your fiber (a few millimetres for G.657, but larger is better).
:::

## Step 3. Fiber and spool

- Wind the fiber so it **feeds off freely in flight** without tension (payout).
- Terminate the fiber ends by splicing to SFP-connector pigtails or with field connectors (LC/SC depending on the SFP).
- After termination, **measure the loss** (OTDR, or at least a power meter): actual loss must fit the optical budget with ≥ 3 dB margin.

## Step 4. Ground side

1. Insert the ground **BiDi SFP** (mirror of the airborne one: if the drone is Tx1310/Rx1550, the ground is Tx1550/Rx1310) into the second media converter.
2. Route the fiber from the spool into this SFP.
3. Connect the converter's RJ45 to a laptop or SBC.
4. Power the converter.

The **Link** LED on both converters should light up — the first sign the optics came up.

## Step 5. Network and IP

This is now an ordinary point-to-point Ethernet network:

- Camera: `192.168.1.10` (static).
- Ground device: `192.168.1.2/24`.
- Control/telemetry "up" (e.g. MAVLink from the flight controller) travel the **same IP channel** — the fiber is full-duplex. Put the controller in the same subnet or bridge it onboard.

```bash
# on the ground device
sudo ip addr add 192.168.1.2/24 dev eth0
ping 192.168.1.10   # should reply
```

## Step 6. Receiving and decoding

An ordinary RTSP stream arrives over the fiber — any low-latency player works.

**mpv (simplest):**

```bash
mpv --profile=low-latency --no-cache --untimed rtsp://192.168.1.10/
```

**GStreamer (minimal latency, H.265):**

```bash
gst-launch-1.0 rtspsrc location=rtsp://192.168.1.10/ latency=0 ! \
  rtph265depay ! h265parse ! avdec_h265 ! autovideosink sync=false
```

::: tip PixelPilot not needed here
[PixelPilot](/en/software/pixelpilot) targets WFB-NG. For plain RTSP over fiber use mpv, ffplay or GStreamer.
:::

## Step 7. Verification

- **Link** is lit on both converters.
- `ping 192.168.1.10` is stable, no loss.
- Received optical power is within SFP sensitivity (check via DDM/DOM if the SFP supports it).
- Video is smooth, no tearing — over fiber there should be no tearing at all; if there is, the problem is the codec/network, not the channel.

## Troubleshooting

| Symptom | Likely cause | What to do |
|---------|--------------|------------|
| No **Link** on converters | SFPs not mirrored; break/bad connector; dirty end-face | Check the Tx/Rx pair; clean the end-faces; measure loss |
| Link up but no `ping` | Different subnets; IP conflict | Bring addresses to one subnet; check the camera's static IP |
| `ping` works, no video | RTSP disabled; wrong URL | Check `rtsp:` in `majestic.yaml`; try `rtsp://192.168.1.10/` |
| High attenuation | Small bend radius; bad splice | Increase the radius; re-splice; measure with OTDR |
| Link drops under load | Converter power sag | Stable BEC, capacitor on the supply |

## FAQ

<Faq />

## Next

- [OpenIPC fiber-optic video link for FPV drones — principle and components](/en/software/fiber-optic) — theory and component selection.
- [Drone setup](/en/getting-started/drone) · [Troubleshooting](/en/getting-started/troubleshooting)
