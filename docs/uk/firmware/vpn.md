---
title: "Налаштування VPN для OpenIPC 4G"
description: "VPN для OpenIPC 4G — детальна інструкція налаштування WireGuard, щоб забезпечити низьку затримку та безпечне управління дроном"
---
<img src="/images/WireGuard-Logo.wine.svg" alt="WireGuard Logo" width="320" height="120" style="object-fit: contain;">

**WireGuard VPN** забезпечує безпечну та низькозатримкову комунікацію між дроном QuadroFleet та пристроєм оператора.
Цей посібник охоплює налаштування VPN-сервера та конфігурацію клієнтів.

---

**Попередні вимоги**

* Віртуальний приватний сервер (VPS) або локальний ПК з публічною IP-адресою.
* Права адміністратора для встановлення WireGuard.
* ПК або смартфон для керування застосунком оператора.
* Камера дрона OpenIPC з 4G/5G модемом та SIM-картою.

---

<h3>Крок 1: Встановлення WireGuard на VPN-сервер</h3>

На VPS або локальному ПК (рекомендовано Ubuntu/Debian):

```bash
sudo apt update
sudo apt install wireguard
```

Згенеруйте приватний і публічний ключі:

```bash
wg genkey | tee /etc/wireguard/privatekey | wg pubkey > /etc/wireguard/publickey
```

Приклади ключів:

* Приватний ключ VPN-сервера: `sHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxFM=`
* Публічний ключ VPN-сервера: `lYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx08=`

Аналогічно згенеруйте ключі для пристрою оператора та дрона:

* `yIxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxG4=` — приватний ключ пристрою оператора
* `VGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxnk=` — публічний ключ пристрою оператора
* `QExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxXY=` — приватний ключ дрона (OpenIPC Camera)
* `TmxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxEc=` — публічний ключ дрона

---

Конфігураційний файл WireGuard (`/etc/wireguard/wg0.conf`):

```ini
[Interface]
Address = 10.253.0.1/24
ListenPort = 51820
PrivateKey = sHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxFM=

[Peer]
# Пристрій оператора (ПК/телефон)
PublicKey = VGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxnk=
AllowedIPs = 10.253.0.3/32

[Peer]
# Дрон (OpenIPC Camera)
PublicKey = TmxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxEc=
AllowedIPs = 10.253.0.2/32
```

Запуск сервісу WireGuard:

```bash
sudo systemctl enable wg-quick@wg0
sudo systemctl start wg-quick@wg0
```

Відкрийте порт брандмауера (51820/UDP):

```bash
sudo ufw allow 51820/udp
```

---

<h3>Крок 2: Конфігурація пристрою оператора</h3>

Встановіть WireGuard на ПК або смартфон:

* Ubuntu/Debian: `sudo apt install wireguard`
* Windows/macOS: завантажити з [WireGuard](https://www.wireguard.com/install/)
* Android/iOS: встановити додаток WireGuard з Google Play / App Store

Створіть конфігураційний файл клієнта:

```ini
[Interface]
PrivateKey = yIxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxG4=
Address = 10.253.0.3/24

[Peer]
PublicKey = lYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx08=
AllowedIPs = 10.253.0.0/24
Endpoint = <VPS_PUBLIC_IP>:51820
PersistentKeepalive = 25
```

* Замініть `PrivateKey` і `PublicKey` на власні значення.
* Замініть `<VPS_PUBLIC_IP>` на публічну IP-адресу VPS.

Активуйте VPN-тунель:

* **Windows:** запустити WireGuard та активувати нове з’єднання
* **Linux:** `wg-quick up ./client.conf`
* **Мобільний:** імпортувати конфіг у додаток WireGuard та активувати

---

<h3>Крок 3: Конфігурація камери OpenIPC дрона</h3>

1. Увійдіть у веб-інтерфейс камери (IP за замовчуванням через DHCP).
2. Перейдіть в **Extensions > WireGuard** та встановіть:

```ini
[Interface]
PrivateKey = QExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxXY=

[Peer]
PublicKey = lYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx08=
AllowedIPs = 10.253.0.0/24
Endpoint = <VPS_PUBLIC_IP>:51820
PersistentKeepalive = 25
```

* Замініть `PrivateKey` і `PublicKey` на власні значення.
* Замініть `<VPS_PUBLIC_IP>` на публічну IP-адресу VPS.

Оновіть конфігурацію мережевого інтерфейсу:

```bash
auto wg0
iface wg0 inet static
   address 10.253.0.2
   netmask 255.255.255.0
   pre-up modprobe wireguard
   pre-up ip link add dev wg0 type wireguard
   pre-up wg setconf wg0 /etc/wireguard.conf
   post-down ip link del dev wg0
```

!!! info "Примітка"
    Перезавантажте камеру для застосування змін.

---

<h3>Крок 4: Перевірка з’єднання</h3>

* Пінгуйте VPN-IP дрона (10.253.0.2) з пристрою оператора (10.253.0.3).
* Перевірте доступ до веб-інтерфейсу камери через VPN.
* Протестуйте UDP-комунікацію у застосунку QuadroFleet (ПК або мобільний).

---

!!! info "Примітки"
    - Використовуйте VPS з низькою затримкою (наприклад, Воля, Водафон, або будь-який який розміщений у Києві або ближче до вашого місця розташування) для оптимальної продуктивності. 
    - Встановлення VPN-сервера на локальному ПК зменшить затримку, але ускладнить конфігурацію. 
    - Якщо сервер на локальному ПК — налаштуйте **port forwarding** (51820/UDP) на роутері.
    - Переконайтеся, що SIM-карта підтримує 4G/5G і має достатньо трафіку.
