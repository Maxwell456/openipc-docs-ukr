---
title: APALink — dynamic bitrate switching for APFPV
description: Step-by-step installation and configuration of APALink for the APFPV system.
---

**APALink** is a C program for the APFPV firmware, created to keep the video link stable.  
It uses fallback logic, automatically lowering the bitrate (for example, to **2 Mbps**) when the signal is weak.

---

Installation

1. Go to [GitHub](https://github.com/carabidulebabat/CaraSandbox)
2. Follow the instructions in the `README.md` file
3. Copy the executable to `/usr/bin`:

```bash
chmod 777 +x /usr/bin/ap_alink
```

4. Copy the configuration file `ap_alink.conf` to the `/etc/` directory
5. *(Optional)* Copy `vtxmenu.ini` to `/etc/` to enable the **APFPV** menu
6. **Go fly! 🚀**

---

<h3>Configuring `ap_alink.conf`</h3>

The configuration file lets you change the bitrate and threshold parameters:

```bash
bitrate_max=22     ## Maximum bitrate with a good signal
bitrate_min=2      ## Minimum bitrate in fallback mode
dbm_threshold=-47  ## Threshold for activating fallback (dBm)
```

::: info Tip
- **Lower threshold** → better image quality for longer, but possible lag with a weak signal
- **Higher threshold** → fallback activates sooner, reducing lag, but quality is lower
:::


---

<h3>Recommended settings</h3>

- **BL-M8812EU2**
```bash
bitrate_max=12
bitrate_min=2
dbm_threshold=-52
```

- **BL-R8812AF1**
```bash
bitrate_max=10
bitrate_min=2
dbm_threshold=-48
```

---

The **VTXMENU** menu

Through the **MSP menu** (as in HDZero or WFB-NG) you can configure:

- **Tx Power:** `1500` or `2000` (25mW / 100mW)  
- **Channel:** all available 5GHz channels  
- **AutoPower:** `0` or `1` — automatic power adjustment via `iw`

---
