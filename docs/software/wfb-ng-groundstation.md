---
title: WFB-NG — Наземна станція на Ubuntu
description: Покрокове встановлення WFB-NG на Ubuntu 22.04 LTS, налаштування драйверів, запуск сервісу, моніторинг лінку та вирішення проблем.
---

# WFB-NG — Наземна станція (Ubuntu)

Приклад для Ubuntu **22.04 LTS** (ядро 5.15).

::: warning Ubuntu 22.04 LTS
Новіші версії Ubuntu ламають патчені драйвери Wi-Fi карт — використовуйте саме 22.04 LTS. Не підключайте USB-карти під час встановлення ОС, щоб уникнути конфліктів.
:::

## Встановлення

**1. Залежності:**

```bash
sudo apt update
sudo apt install dkms git python3-all-dev net-tools virtualenv fakeroot \
  debhelper python3-twisted libpcap-dev python3-pyroute2 python3-future \
  python3-all libsodium-dev
```

**2. Драйвер карти:**

- **RTL8812AU** — патчений драйвер **v5.2.20** з [svpcom/rtl8812au](https://github.com/svpcom/rtl8812au). Уникайте v5.6.4.2 — занижена потужність передавача.
- **RTL8812EU** — патчений драйвер з [svpcom/rtl8812eu](https://github.com/svpcom/rtl8812eu).

Після встановлення внесіть системні драйвери Realtek до **чорного списку**, щоб система не завантажила неправильний:

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

**3. BPF JIT-оптимізація** — прискорює обробку пакетів:

```bash
echo "net.core.bpf_jit_enable = 1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

**4. NetworkManager** — налаштуйте, щоб він не захоплював Wi-Fi карту. Додайте до `/etc/NetworkManager/NetworkManager.conf`:

```ini
[keyfile]
unmanaged-devices=interface-name:wlan0
```

Якщо використовується `dhcpcd`, додайте також `denyinterfaces wlan0` до `/etc/dhcpcd.conf`.

**5. Встановлення WFB-NG** (вкажіть ім'я свого інтерфейсу з `iwconfig`):

```bash
git clone -b stable https://github.com/svpcom/wfb-ng.git
cd wfb-ng
sudo ./scripts/install_gs.sh "wlan0"
```

**6. Конфіг** — відредагуйте `/etc/wifibroadcast.cfg` (канал/регіон/потоки) і покладіть `/etc/gs.key`.

## Запуск і моніторинг

```bash
# Наземна станція
sudo systemctl enable --now wifibroadcast@gs
systemctl status wifibroadcast@gs

# Дрон (камера)
sudo systemctl enable --now wifibroadcast@drone

# Монітор лінку (RSSI, FEC, втрати пакетів)
wfb-cli gs

# Логи для діагностики
journalctl -xu wifibroadcast@gs -n 100
```

## Перегляд відео

Відеопотік (зазвичай **H.265**) віддається по UDP на порт `5600`. Відкрийте у [PixelPilot](https://github.com/OpenIPC/PixelPilot_rk), QGroundControl або GStreamer:

- **QGroundControl** — UDP h.265, адреса `0.0.0.0:5600`, увімкніть *Low Latency Mode*.
- **GStreamer** — приймання RTP/UDP на `5600` з декодуванням H.265.

## Вирішення проблем

| Симптом | Причина / рішення |
|---------|-------------------|
| Немає відео взагалі | Різний `wifi_channel` на дроні та GS — звірте `/etc/wifibroadcast.cfg` |
| Помилки дешифрування | `gs.key` і `drone.key` не з однієї пари — перегенеруйте `wfb_keygen` |
| Лінк рветься / низький бітрейт | Завеликий `mcs_index` для умов — зменшіть; перевірте антени та потужність |
| Карта не запускається | Немає режиму монітора/інжекції або непатчений драйвер |
| RF Kill активний | `rfkill list all` — перевірте стан; `rfkill unblock all` — розблокуйте |
| NetworkManager захоплює карту | Додайте `unmanaged-devices` у `NetworkManager.conf` (крок 4 вище) |

Для автоматичного підбору бітрейту під умови зв'язку див. [Adaptive-Link](/configuration/adaptive-link).

