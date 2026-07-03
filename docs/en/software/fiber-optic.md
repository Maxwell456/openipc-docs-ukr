---
title: "OpenIPC Fiber-Optic Video Link for FPV Drones"
description: How to send video from an OpenIPC camera over fiber instead of Wi-Fi — link architecture for a fiber-spool FPV drone, component selection (single-mode fiber, BiDi SFP, media converters), optical budget and latency.
sidebarTitle: "Fiber optic: architecture"
faq:
  - q: Is this the same as WFB-NG?
    a: No. WFB-NG sends video over raw Wi-Fi. The fiber link uses the OpenIPC camera's native Ethernet output (the Majestic RTSP/IP stream) and replaces the radio channel with glass. No radio is involved in the video path at all.
  - q: How much latency does fiber add?
    a: About 5 microseconds per kilometre (the speed of light in glass). Even at 20 km that is ~100 us — two orders of magnitude below the video encode/decode latency. In practice fiber adds no latency.
  - q: Why single-mode fiber and not multi-mode?
    a: Single-mode has lower attenuation (~0.2-0.35 dB/km) and works over tens of kilometres on one thin strand. Multi-mode is thicker, heavier and limited to hundreds of metres — unsuitable for a drone spool.
  - q: What is the maximum range of a fiber-optic video link?
    a: It is set by the SFP module's optical budget — 20, 40, 80 and 120 km options exist. In practice the limit is not the optics but the weight of the fiber spool the drone must lift.
  - q: Can a fiber-optic link be jammed by electronic warfare?
    a: No. The channel is not radio-frequency, so EW jamming does not affect it, and the drone barely emits. The only vulnerability is a physical break of the fiber.
  - q: How much does the fiber weigh?
    a: Bare 250 um single-mode fiber weighs about 0.05 g/m. So 10 km is ~0.5 kg of glass plus the spool. This weight, not the optics, limits practical range.
---

# OpenIPC Fiber-Optic Video Link for FPV Drones

Instead of broadcasting video over radio (like [WFB-NG](/en/software/wfb-ng)), an OpenIPC camera can be connected to the ground station with **optical fiber**. The drone unspools a thin single-mode strand and the camera's ordinary IP stream travels down it.

Such a link **cannot be jammed** by electronic warfare, is practically **non-emitting** (invisible to signal intelligence) and has **zero packet loss** — no FEC or retransmission needed. The price is a physical tether: the fiber can be cut, and the spool adds weight.

::: info This is not WFB-NG
OpenIPC FPV uses Wi-Fi (WFB-NG) by default. The fiber variant is an **alternative transport**: it relies on the camera's native Ethernet output (SoCs like the SigmaStar SSC338Q have a built-in 10/100 Mbit Ethernet interface) and the [Majestic](/en/software/wfb-ng) RTSP/IP stream. The radio channel is simply swapped for glass. It is a community approach, not an out-of-the-box feature.
:::

## When it makes sense

- **Heavy EW environment** — where the radio link is jammed, fiber keeps working.
- **Stealth required** — fiber does not emit, so the drone is harder to detect and locate.
- **Critical mission** — a stable channel matters more than freedom of manoeuvre.
- **Strong electromagnetic interference** — glass is fully immune to EMI.

If you need flight freedom, many simultaneous drones, or simple logistics — stay on [WFB-NG](/en/software/wfb-ng). Fiber is a niche tool.

## How it works

The chain is simple: the camera outputs an IP stream over Ethernet, a media converter turns the electrical signal into light, it runs down a single fiber to the ground, and there everything happens in reverse. Tap any node in the diagram to see its role:

<FiberLinkDiagram />

A single fiber carries both directions thanks to **WDM (BiDi)**: video goes "down" on one wavelength (e.g. 1310 nm), control/telemetry go "up" on another (1550 nm). This is critical because the spool physically holds one strand.

## Comparison with WFB-NG

| Parameter | Fiber optic | WFB-NG (Wi-Fi) |
|-----------|-------------|----------------|
| EW resistance | **Absolute** | Limited |
| Stealth | **Non-emitting** | Radio-visible |
| Packet loss | Zero (no FEC) | Handled by FEC |
| Range | Tens of km (one strand) | A few km |
| Channel latency | ~5 us/km (negligible) | Negligible |
| Freedom of manoeuvre | Limited by tether | Full |
| Payload weight | + fiber spool | + Wi-Fi card, antennas |
| Many drones at once | One strand each | Shared spectrum |
| Link-loss risk | Mechanical break = end | No physical tether |

## Components

### OpenIPC camera with Ethernet

You need a board where **Ethernet works**. The SigmaStar **SSC338Q** and **SSC30KQ** SoCs have a built-in 10/100 Mbit Ethernet MAC+PHY, and Majestic serves an RTSP stream over it. Many FPV-only (AIO) boards omit external Ethernet to save weight — check for an RJ45 or RMII/MII pads for an external PHY.

See [SSC338Q + IMX415](/en/hardware/vtx/sigmastar-ssc338q) and [SSC30KQ](/en/hardware/vtx/sigmastar-ssc30kq).

### Optical fiber

- **Type:** single-mode (SMF), ideally bend-insensitive **G.657.A2/B3** — it tolerates a small bend radius on the spool.
- **Form:** bare 250 µm coated fiber — as light as possible.
- **Weight:** ≈ 0.05 g/m. So 10 km of fiber is ~0.5 kg of glass alone, plus the spool. This is the dominant payload contribution and the main limit on practical range.

### Media converter + BiDi SFP

- **Media converter** for Fast Ethernet (100BASE-TX ↔ 100BASE-FX) with an SFP slot.
- **BiDi SFP module (single-strand, WDM)** — transmits and receives over **one** fiber on two wavelengths (Tx 1310 / Rx 1550 on one side, mirrored on the other). Typical reach: 20, 40, 80 or 120 km.
- Both ends must be a **mirrored pair** (if the airborne side is Tx1310/Rx1550, the ground side is Tx1550/Rx1310).

### Spool and payout

The fiber is wound so it **feeds off freely without tension** during flight (payout). The key is never to violate the fiber's minimum bend radius (a few millimetres for G.657), or attenuation spikes and the fiber breaks.

## Optical budget

For the link to come up, the transmit power must cover all the loss on the route:

- Fiber attenuation: **≈ 0.35 dB/km** at 1310 nm, **≈ 0.20 dB/km** at 1550 nm.
- Each splice: ~0.1 dB, each connector: ~0.3-0.5 dB.
- BiDi SFP budget (e.g. a 20 km module): typically **13-14 dB**.

**Example:** 15 km × 0.35 dB/km ≈ 5.3 dB + 2 splices ≈ 0.2 dB. Total ~5.5 dB — comfortably within a 20 km module with margin. For longer routes pick an SFP with a larger budget (40/80 km) and keep ≥ 3 dB spare.

## Latency

Light travels in glass at ≈ 200,000 km/s, i.e. **~5 µs per kilometre**. Even 20 km is ~100 µs. Against the H.265 encode latency in Majestic and decode on the ground (tens of milliseconds), the fiber contribution is **negligible**. Glass-to-glass latency is set by the codec, not the route length.

## Limitations and risks

- **Mechanical break = instant link loss.** There is no "graceful degradation" like radio.
- **Spool weight** limits range and flight time.
- **Bend radius.** Violating the minimum radius on the spool or in the mount is the main cause of signal loss.
- **Fiber termination.** Bare ends are usually fusion-spliced or field-connectorised — tools and skill required.
- **No redundancy.** One fiber is a single point of failure.

## FAQ

<Faq />

## Next

- [How to build the OpenIPC fiber-optic video link](/en/software/fiber-optic-build) — step-by-step guide.
- [WFB-NG](/en/software/wfb-ng) — the standard radio option for comparison.
