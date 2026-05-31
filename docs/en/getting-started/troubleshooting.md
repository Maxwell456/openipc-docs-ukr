---
title: Troubleshooting
description: Common problems and solutions for OpenIPC FPV systems.
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
