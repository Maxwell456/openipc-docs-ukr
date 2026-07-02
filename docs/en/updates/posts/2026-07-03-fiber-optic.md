---
title: OpenIPC fiber-optic video link for FPV drones
sidebarTitle: Fiber-optic video link
date: 2026-07-03
description: Added two articles on sending video from an OpenIPC camera over fiber instead of Wi-Fi — link architecture for a fiber-spool drone, component selection (single-mode fiber, BiDi SFP, media converters) and a step-by-step build with an interactive diagram.
tags:
  - OpenIPC
  - fiber optic
  - FPV
  - EW
  - Majestic
  - RTSP
---

# OpenIPC fiber-optic video link for FPV drones

We added two new articles on sending OpenIPC video **over optical fiber** — an alternative to the [WFB-NG](/en/software/wfb-ng) radio link for scenarios where electronic-warfare resistance and stealth matter.

In such a link the drone unspools a thin single-mode fiber, runs on its own battery, and the camera's ordinary IP stream (Majestic over RTSP) travels down the glass. The channel **cannot be jammed** by electronic warfare, barely emits, and has zero packet loss.

---

### 🔹 What's new

- [**OpenIPC Fiber-Optic Video Link: Architecture & Components**](/en/software/fiber-optic) — how it works with an **interactive diagram** of the link, comparison with WFB-NG, component selection (camera with Ethernet, single-mode G.657 fiber, BiDi SFP, media converters), optical budget and latency.
- [**How to Build an OpenIPC Fiber-Optic Video Link**](/en/software/fiber-optic-build) — step-by-step build: Majestic-over-Ethernet setup, airborne module, fiber spool, ground-side RTSP decoding (mpv/GStreamer) and link verification.

---

### 🔹 The technology in brief

- **EW resistance** — the channel is not radio-frequency, so jamming has no effect.
- **Stealth** — fiber does not emit, so the drone is harder to detect.
- **Zero channel latency** — ~5 µs/km, negligible against the codec.
- **Limitation** — a physical tether: the fiber can be cut, and the spool adds weight.

::: info A community solution
The fiber link relies on the OpenIPC camera's native Ethernet output, not the standard WFB-NG. Test the link on the bench before flying and keep optical-budget margin.
:::
