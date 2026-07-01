---
title: Troubleshooting
description: Common problems and solutions for OpenIPC FPV systems.
faq:
  - q: "Why is there no video in PixelPilot?"
    a: "Check that the lens cap is removed, that gs.key matches on the camera and ground station, and that channel and bandwidth are correct (e.g. 161 / 20 MHz). Then restart PixelPilot and reboot the camera."
  - q: "Why does the FPV video have artifacts?"
    a: "Check antenna distance and orientation, make sure both antennas use the same polarization (LHCP ↔ LHCP), and try reducing the bitrate in camera settings."
  - q: "The camera is not responding via SSH. What should I do?"
    a: "The default IP is 192.168.1.10 — try pinging it first. If there is no response, connect to the camera over UART."
---

# Troubleshooting

## No video in PixelPilot

1. ✅ Check that the lens cap is removed
2. ✅ Verify `gs.key` matches on camera and GS
3. ✅ Check channel and bandwidth (161 / 20 MHz)
4. ✅ Restart PixelPilot
5. ✅ Reboot the camera

## Video with artifacts

- Check antenna distance and orientation
- Verify antenna polarization (LHCP ↔ LHCP)
- Reduce bitrate in camera settings

## Camera not responding via SSH

- Default IP: `192.168.1.10`
- Try: `ping 192.168.1.10`
- If no response — use UART connection
