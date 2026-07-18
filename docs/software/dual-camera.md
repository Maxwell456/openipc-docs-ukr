---
title: "AI Dual Camera — OpenIPC FPV"
description: "AI Dual Camera в OpenIPC FPV: денна камера + тепловізор із перемиканням у польоті, бортова детекція об'єктів (YOLOv8n на IPU SigmaStar) і MAVLink OSD на VRX. Готовий архів файлів і точні команди."
---

# AI Dual Camera

Сценарій «двох камер» в OpenIPC FPV: на одному дроні працюють **денна камера** (OpenIPC) і **тепловізор** (через Raspberry Pi), а пілот **перемикає їх у польоті**. Обидва потоки зводяться в **один WFB-передавач** через `socat`, а на денну камеру накладається **детекція об'єктів на борту** — модель **YOLOv8n** на апаратному прискорювачі **IPU** SigmaStar.

::: tip 📦 Файли для встановлення
Усі потрібні бінарники, конфіги та скрипти зібрані в одному архіві.

**➜ [Завантажити архів «AI Dual Camera»](/downloads/OpenIPC_AI_Object_Detection_Dual_Cam.7z)**

Розпакуйте архів і виконуйте наведені нижче команди **з теки, куди розпакували файли**.
:::

::: danger Тільки для просунутих користувачів
Гайд дуже технічний і змінює системні файли камери та наземної станції. Він для **досвідчених користувачів і розробників**. Усе, що ви робите, — **на власний ризик**.
:::

---

## Як це працює

- Дві камери, **один WFB-лінк**, перемикання в польоті через утиліту **`socat`**.
- **Денна камера** (OpenIPC) віддає потік на порт **`5500`**.
- **Тепловізор** (через Raspberry Pi, **H.264**) віддає потік на порт **`5600`**.
- `socat` залежно від перемикача бере потік із `5500` **або** `5600` і передає на локальний **Unix RTP**-сокет → **WFB** → передавання на наземну станцію.
- Замість Majestic працює стрімер **`venc`** із детекцією об'єктів (її реалізував Milos): вона рахується **покадрово, до кодування**, за моделлю **YOLOv8n (352px)** на драйвері **IPU** (`mi_ipu.ko`).

<figure style="margin:1.75rem 0;overflow-x:auto">
<svg viewBox="0 0 680 224" role="img" aria-labelledby="dcflow-t dcflow-d" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:680px;height:auto;display:block;margin:0 auto;font-family:var(--vp-font-family-base,system-ui,sans-serif)">
<title id="dcflow-t">Схема потоку двох камер</title>
<desc id="dcflow-d">Денна камера і тепловізор надсилають потоки на socat, який перемикає їх і передає через WFB на VRX.</desc>
<defs>
<marker id="dc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--vp-c-text-3,#8b949e)"/></marker>
</defs>
<path id="p-day" d="M196,52 C242,52 250,116 286,116" fill="none" style="stroke:var(--vp-c-divider,#d0d7de);stroke-width:1.5" marker-end="url(#dc-arrow)"/>
<path id="p-th" d="M196,180 C242,180 250,116 286,116" fill="none" style="stroke:var(--vp-c-divider,#d0d7de);stroke-width:1.5" marker-end="url(#dc-arrow)"/>
<path id="p-sw" d="M378,116 L436,116" fill="none" style="stroke:var(--vp-c-divider,#d0d7de);stroke-width:1.5" marker-end="url(#dc-arrow)"/>
<path id="p-wv" d="M520,116 L580,116" fill="none" style="stroke:var(--vp-c-divider,#d0d7de);stroke-width:1.5" marker-end="url(#dc-arrow)"/>
<circle r="4" style="fill:var(--vp-c-brand-1,#3451b2)"><animateMotion dur="1.9s" repeatCount="indefinite"><mpath href="#p-day"/></animateMotion></circle>
<circle r="4" style="fill:var(--vp-c-brand-1,#3451b2)"><animateMotion dur="1.9s" begin="-0.95s" repeatCount="indefinite"><mpath href="#p-day"/></animateMotion></circle>
<circle r="4" style="fill:#f0883e"><animateMotion dur="1.9s" repeatCount="indefinite"><mpath href="#p-th"/></animateMotion></circle>
<circle r="4" style="fill:#f0883e"><animateMotion dur="1.9s" begin="-0.95s" repeatCount="indefinite"><mpath href="#p-th"/></animateMotion></circle>
<circle r="4" style="fill:var(--vp-c-brand-1,#3451b2)"><animateMotion dur="1.1s" repeatCount="indefinite"><mpath href="#p-sw"/></animateMotion></circle>
<circle r="4" style="fill:var(--vp-c-brand-1,#3451b2)"><animateMotion dur="1.1s" begin="-0.55s" repeatCount="indefinite"><mpath href="#p-sw"/></animateMotion></circle>
<circle r="4" style="fill:var(--vp-c-brand-1,#3451b2)"><animateMotion dur="1.1s" repeatCount="indefinite"><mpath href="#p-wv"/></animateMotion></circle>
<circle r="4" style="fill:var(--vp-c-brand-1,#3451b2)"><animateMotion dur="1.1s" begin="-0.55s" repeatCount="indefinite"><mpath href="#p-wv"/></animateMotion></circle>
<rect x="14" y="24" width="182" height="56" rx="11" style="fill:var(--vp-c-bg-soft,#f6f8fa);stroke:var(--vp-c-divider,#d0d7de);stroke-width:1.5"/>
<text x="105" y="49" text-anchor="middle" style="font-size:13px;font-weight:600;fill:var(--vp-c-text-1,#1f2328)">Денна камера</text>
<text x="105" y="66" text-anchor="middle" style="font-size:9.5px;fill:var(--vp-c-text-2,#636c76)">OpenIPC · venc + YOLOv8n</text>
<rect x="14" y="152" width="182" height="56" rx="11" style="fill:var(--vp-c-bg-soft,#f6f8fa);stroke:var(--vp-c-divider,#d0d7de);stroke-width:1.5"/>
<text x="105" y="177" text-anchor="middle" style="font-size:13px;font-weight:600;fill:var(--vp-c-text-1,#1f2328)">Тепловізор</text>
<text x="105" y="194" text-anchor="middle" style="font-size:9.5px;fill:var(--vp-c-text-2,#636c76)">Raspberry Pi · H.264</text>
<rect x="286" y="94" width="92" height="44" rx="11" style="fill:var(--vp-c-brand-soft,rgba(100,108,255,0.14));stroke:var(--vp-c-brand-1,#3451b2);stroke-width:1.8"><animate attributeName="stroke-width" values="1.8;3;1.8" dur="1.9s" repeatCount="indefinite"/></rect>
<text x="332" y="112" text-anchor="middle" style="font-size:13px;font-weight:600;fill:var(--vp-c-text-1,#1f2328)">socat</text>
<text x="332" y="128" text-anchor="middle" style="font-size:9px;fill:var(--vp-c-text-2,#636c76)">перемикач</text>
<rect x="436" y="94" width="84" height="44" rx="11" style="fill:var(--vp-c-bg-soft,#f6f8fa);stroke:var(--vp-c-divider,#d0d7de);stroke-width:1.5"/>
<text x="478" y="120" text-anchor="middle" style="font-size:13px;font-weight:600;fill:var(--vp-c-text-1,#1f2328)">WFB</text>
<rect x="580" y="94" width="86" height="44" rx="11" style="fill:var(--vp-c-bg-soft,#f6f8fa);stroke:var(--vp-c-divider,#d0d7de);stroke-width:1.5"/>
<text x="623" y="120" text-anchor="middle" style="font-size:13px;font-weight:600;fill:var(--vp-c-text-1,#1f2328)">VRX</text>
<text x="246" y="70" text-anchor="middle" style="font-size:10px;font-weight:500;fill:var(--vp-c-text-2,#636c76)">RTP :5500</text>
<text x="246" y="166" text-anchor="middle" style="font-size:10px;font-weight:500;fill:var(--vp-c-text-2,#636c76)">Ethernet :5600</text>
<text x="407" y="108" text-anchor="middle" style="font-size:10px;font-weight:500;fill:var(--vp-c-text-2,#636c76)">Unix RTP</text>
<text x="550" y="108" text-anchor="middle" style="font-size:10px;font-weight:500;fill:var(--vp-c-text-2,#636c76)">RF</text>
</svg>
<figcaption style="margin-top:.5rem;text-align:center;font-size:.8rem;color:var(--vp-c-text-2)">Потік даних: дві камери → <strong>socat</strong> (перемикач) → WFB → VRX</figcaption>
</figure>

---

## Обладнання (приклад збірки)

| Компонент | Що використано |
| :--- | :--- |
| **Денна камера + VTX** | EMAX Wi-Fi Link (v1) + Wi-Fi-адаптер від RunCam Wi-Fi Link (v1). Підійде **будь-яка OpenIPC-камера на SigmaStar** |
| **Тепловізор** | USB-тепловізійний модуль → **Raspberry Pi Zero 2W** («3B mini») з **SPI-Ethernet** адаптером; SD-карта з образом **URLLC AIO (OR)** |
| **Провідний лінк** | Ethernet між Raspberry Pi та OpenIPC-камерою (через SPI-адаптер) |
| **Політний контролер** | Betaflight (12/2025) + **GPS** для position hold |
| **Наземна станція (VRX)** | новий EMAX VRX (або RunCam VRX / Eachine VRX / старий EMAX VRX) |

---

## Що знадобиться

- **PuTTY** — інструменти `plink` і `pscp` у PATH (команди нижче — для Windows). На Mac/Linux скористайтесь аналогами `ssh` / `scp`.
- [Архів «AI Dual Camera»](/downloads/OpenIPC_AI_Object_Detection_Dual_Cam.7z) з бінарниками, конфігами та скриптами.
- OpenIPC-камера на **SigmaStar (SSC338Q)** з доступом по SSH (`root` / `12345`).

---

## Крок 0. Підготовка

1. Розпакуйте архів, відкрийте **CMD** і перейдіть у теку з розпакованими файлами.
2. З'єднайте камеру Ethernet-кабелем **напряму з ноутбуком** (не через роутер).
3. Задайте IP Ethernet-адаптера ноутбука — **`192.168.1.11`** (маска `255.255.255.0`). Камера має адресу **`192.168.1.10`**.
4. *(За потреби)* скиньте камеру до початкового стану командою `firstboot` у її консолі. **Не переривайте** процес.

---

## Крок 1. Встановлення файлів на камеру (VTX)

Виконайте команди **по черзі** з теки з розпакованим архівом:

```bash
plink -ssh root@192.168.1.10 -pw 12345 killall majestic "&&" rm /usr/bin/majestic "&&" mkdir /config "&&" mkdir /config/dla "&&" mkdir /root/models/
pscp -scp -pw 12345 mi_ipu.ko root@192.168.1.10:/lib/modules/4.9.84/sigmastar/
pscp -scp -pw 12345 ipu_firmware.bin root@192.168.1.10:/config/dla/
pscp -scp -pw 12345 yolov8n352drone.img root@192.168.1.10:/root/models/
pscp -scp -pw 12345 libipu_yolo_worker.so root@192.168.1.10:/root/
pscp -scp -pw 12345 venc socat mavlink-routerd channels.sh root@192.168.1.10:/usr/bin
pscp -scp -pw 12345 venc.json txprofiles.conf root@192.168.1.10:/etc
plink -ssh root@192.168.1.10 -pw 12345 dos2unix /etc/venc.json "&&" dos2unix /etc/txprofiles.conf "&&" dos2unix /usr/bin/channels.sh "&&" chmod +x /usr/bin/channels.sh "&&" chmod +x /usr/bin/venc "&&" chmod +x /usr/bin/socat "&&" chmod +x /usr/bin/mavlink-routerd
pscp -scp -pw 12345 libmi_vif.so libmi_isp.so libcus3a.so libispalgo.so libmi_vpe.so libmi_sensor.so libmi_venc.so libmi_ipu.so libcam_fs_wrapper.so root@192.168.1.10:/usr/lib
```

---

## Крок 2. Правки файлів на камері

Три файли редагуються вручну. У самому архіві є готові версії `wifibroadcast` і `S95majestic` — можна орієнтуватися на них.

### `/usr/bin/wifibroadcast`

У функції `start_telemetry`, під командою `mavfwd`, додайте рядок `mavlink-routerd &`:

```bash
if [ "$router" = "mavfwd" ]; then
                mavfwd -b 115200 -c 8 -p 100 -a 15 -t -m /dev/"$serial" \
                        -o 127.0.0.1:14552 -i 127.0.0.1:"$port_rx" > /dev/null &
                mavlink-routerd &
```

### `/etc/init.d/S95majestic`

Приведіть початок файлу до такого вигляду (стрімер `venc` + завантаження драйвера IPU):

```bash
#!/bin/sh

DAEMON="venc"
PIDFILE="/var/run/$DAEMON.pid"
DAEMON_ARGS="-s"

start() {
        echo -n "Starting $DAEMON: "
        insmod /lib/modules/4.9.84/sigmastar/mi_ipu.ko
        start-stop-daemon -b -m -S -q -p "$PIDFILE" -x "$DAEMON" -- $DAEMON_ARGS
        if [ $? -eq 0 ]; then
                echo "OK"
        else
                echo "FAIL"
        fi
}
```

### `/etc/mavlink.conf` (створити новий)

```ini
[General]
TcpServerPort = 0

[UdpEndpoint telemetry_tx]
Mode = Normal
Address = 127.0.0.1
Port = 14551

[UdpEndpoint telemetry_tx2]
Mode = Normal
Address = 192.168.1.50
Port = 14551

[UdpEndpoint telemetry_rx]
Mode = Server
Address = 127.0.0.1
Port = 14552
```

---

## Крок 3. Меню наземної станції (gsmenu)

У меню GS змініть три параметри:

1. **Router** (підменю *Telemetry*) → `mavfwd`
2. **txpower** (підменю *Alink*) → `3` або `4`
3. **Mlink** (підменю *WFB-NG*) → `2000`

---

## Крок 4. Тепловізор на Raspberry Pi

1. Прошийте SD-карту образом **URLLC AIO (OR)** (посилання — у відео / попередньому гайді MarioFPV) і вставте її в **Raspberry Pi Zero 2W**.
2. Підключіть **USB-тепловізор** до Raspberry Pi.
3. Провідний **Ethernet-лінк** (через SPI-адаптер) з'єднує Raspberry Pi з OpenIPC-камерою — тепловий потік (H.264) надходить на порт **`5600`**.

---

## Крок 5. VRX: MAVLink OSD + авто-декодер PixelPilot

Оскільки задіяний MAVLink, OSD на боці камери недоступний — його виводимо на VRX.

Увімкніть **WiFi Hotspot** у gsmenu VRX і підключіться з комп'ютера до мережі **`OpenIPC GS`** (пароль `12345678`). Далі з CMD:

```bash
plink -ssh root@192.168.4.1 -pw 12345 killall pixelpilot
pscp -scp -pw 12345 pixelpilot gsmenu.sh root@192.168.4.1:/usr/bin/
pscp -scp -pw 12345 h264.png h265.png h264.svg h265.svg root@192.168.4.1:/usr/share/pixelpilot/
pscp -scp -pw 12345 osd.json root@192.168.4.1:/etc/pixelpilot/
plink -ssh root@192.168.4.1 -pw 12345 dos2unix /etc/pixelpilot/osd.json "&&" dos2unix /usr/bin/gsmenu.sh "&&" chmod +x /usr/bin/pixelpilot "&&" chmod +x /usr/bin/gsmenu.sh "&&" reboot
```

::: info
Перші три команди (`killall pixelpilot` та копіювання `pixelpilot` / `gsmenu.sh` / іконок) **не потрібні**, якщо ваш SBC Buildroot оновлено до збірки від **11.07.2026** або новішої.
:::

Далі підключіться по SSH до SBC Buildroot VRX (`192.168.4.1`, `root` / `12345`) і в новому gsmenu змініть **codec** на **`auto`**, після чого перезавантажте.

---

## Результат

- Перемикач **thermal** → картинка з тепловізора.
- Перемикач **day** → відео з EMAX/RunCam VTX із **накладеною детекцією об'єктів**.
- На VRX — **MAVLink OSD** з телеметрією; PixelPilot автоматично визначає кодек (**H.265** з OpenIPC або **H.264** з Raspberry Pi).

---

## Обмеження

- Це **перемикання** між двома камерами (одномоментно в ефірі — одна), а не два одночасні потоки.
- Команди наведені для **Windows** (PuTTY: `plink` / `pscp`); на Mac/Linux використовуйте `ssh` / `scp`.
- Стрімер, скрипти та образи — **стороння розробка**; спершу перевіряйте все **на землі**.

---

## Пов'язане

[Greg's APFPV](/software/apfpv-greg) · [OpenIPC Mario AIO](/hardware/vtx/marioaio) · [PixelPilot](/software/pixelpilot)
