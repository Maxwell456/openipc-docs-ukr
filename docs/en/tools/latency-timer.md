---
title: Video Latency Timer (glass-to-glass)
description: High-resolution online timer for measuring end-to-end latency of an OpenIPC FPV video link using the glass-to-glass method.
---

# Video Latency Timer

A high-resolution timer for measuring end-to-end video link latency ("glass-to-glass") — from an event in front of the camera to the picture in your goggles or on the ground station screen.

<LatencyTimer />

## How to measure latency

1. Open this page on a monitor or laptop — the timer starts automatically. The **Fullscreen** button removes everything else from the frame.
2. Point the drone camera at the screen so the digits fill most of the frame and are in focus.
3. Place the ground station screen (or goggles with an external display) next to the monitor so both images are visible at once.
4. Photograph both screens **in a single shot** — with a phone at a short exposure.
5. Subtract the number on the ground station screen from the number on the monitor — the difference is the latency in milliseconds.
6. Repeat 5–10 times and average the results: a single shot may land in different phases of the screens' refresh cycles.

::: tip Measurement accuracy
The digits update at your display's refresh rate: at 60 Hz that is every ~16.7 ms, so a single measurement carries up to one frame of error on each side. A 120/144 Hz monitor cuts that in half or better — the **fps** counter on the timer shows the actual rate. The frame counter next to the milliseconds gives a cross-check: frame difference × ms/frame ≈ latency.
:::

::: warning Common mistakes
- **Long exposure** — the digits smear across two frames. Shoot at 1/500 s or faster (use your phone's Pro mode).
- **Browser throttling fps** — laptop power-saving modes can cap the frame rate. Verify the fps counter matches your display's refresh rate.
- **Measuring from a video recording** — the recording has its own frame rate and adds uncertainty. Use photos.
:::

## What affects latency

End-to-end latency is the sum of: camera sensor exposure and ISP, encoding (bitrate and codec settings), the radio link ([WFB-NG](/en/software/wfb-ng-config), FEC buffers), ground station decoding and display output. If your result is too high, start with bitrate settings and [Adaptive-Link](/en/configuration/adaptive-link).
