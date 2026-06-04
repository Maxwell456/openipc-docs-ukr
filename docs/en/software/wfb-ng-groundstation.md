---
title: WFB-NG — Ground Station on Ubuntu
description: Step-by-step WFB-NG installation on Ubuntu 22.04 LTS, driver setup, service startup, link monitoring and troubleshooting.
---

# WFB-NG — Ground Station (Ubuntu)

Example for Ubuntu **22.04 LTS** (kernel 5.15).

::: warning Ubuntu 22.04 LTS
Newer Ubuntu versions break the patched Wi-Fi card drivers — use exactly 22.04 LTS. Do not plug in USB cards during OS installation to avoid driver conflicts.
:::

## Installation

**1. Dependencies:**

```bash
sudo apt update
sudo apt install dkms git python3-all-dev net-tools virtualenv fakeroot \
  debhelper python3-twisted libpcap-dev python3-pyroute2 python3-future \
  python3-all libsodium-dev
```

**2. Card driver:**

- **RTL8812AU** — patched driver **v5.2.20** from [svpcom/rtl8812au](https://github.com/svpcom/rtl8812au). Avoid v5.6.4.2 — it has reduced transmit power.
- **RTL8812EU** — patched driver from [svpcom/rtl8812eu](https://github.com/svpcom/rtl8812eu).

After installation, **blacklist the stock Realtek drivers** so the system does not load the wrong one:

```bash
cat > /etc/modprobe.d/wfb.conf <<EOF
blacklist 88XXau
blacklist 8812au
blacklist rtl8812au
blacklist rtl88x2bs
options 88XXau_wfb rtw_tx_pwr_idx_override=30
EOF
sudo update-initramfs -u
```

**3. BPF JIT optimization** — speeds up packet processing:

```bash
echo "net.core.bpf_jit_enable = 1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

**4. NetworkManager** — prevent it from taking over the Wi-Fi card. Add to `/etc/NetworkManager/NetworkManager.conf`:

```ini
[keyfile]
unmanaged-devices=interface-name:wlan0
```

If you use `dhcpcd`, also add `denyinterfaces wlan0` to `/etc/dhcpcd.conf`.

**5. Install WFB-NG** (use your interface name from `iwconfig`):

```bash
git clone -b stable https://github.com/svpcom/wfb-ng.git
cd wfb-ng
sudo ./scripts/install_gs.sh "wlan0"
```

**6. Config** — edit `/etc/wifibroadcast.cfg` (channel/region/streams) and place `/etc/gs.key`.

## Start and monitor

```bash
# Ground station
sudo systemctl enable --now wifibroadcast@gs
systemctl status wifibroadcast@gs

# Drone (camera)
sudo systemctl enable --now wifibroadcast@drone

# Link monitor (RSSI, FEC, packet loss)
wfb-cli gs

# Logs for diagnostics
journalctl -xu wifibroadcast@gs -n 100
```

## Viewing video

The video stream (usually **H.265**) is pushed over UDP to port `5600`. Open it in [PixelPilot](https://github.com/OpenIPC/PixelPilot_rk), QGroundControl or GStreamer:

- **QGroundControl** — UDP h.265, address `0.0.0.0:5600`, enable *Low Latency Mode*.
- **GStreamer** — receive RTP/UDP on `5600` and decode H.265.

## Troubleshooting

| Symptom | Cause / fix |
|---------|-------------|
| No video at all | Different `wifi_channel` on drone and GS — compare `/etc/wifibroadcast.cfg` |
| Decryption errors | `gs.key` and `drone.key` are not from the same pair — regenerate with `wfb_keygen` |
| Link drops / low bitrate | `mcs_index` too high for the conditions — lower it; check antennas and power |
| Card won't start | No monitor mode/injection, or an unpatched driver |
| RF Kill active | Run `rfkill list all` to check; `rfkill unblock all` to unblock |
| NetworkManager takes over the card | Add `unmanaged-devices` to `NetworkManager.conf` (step 4 above) |

For automatic bitrate adaptation to link conditions, see [Adaptive-Link](/en/configuration/adaptive-link).

