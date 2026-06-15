---
title: "Встановлення Waybeam на камеру"
description: "Покрокова інструкція встановлення Waybeam на камеру з чіпом SigmaStar (Infinity6E / Infinity6C) та інтеграція з WFB-ng замість Majestic."
---

# Встановлення Waybeam на камеру

Ця інструкція описує, як встановити **Waybeam** на камеру з чіпом SigmaStar (Infinity6E / Infinity6C) та налаштувати його для роботи з **WFB-ng** замість Majestic.

::: info Що таке Waybeam?
**Waybeam** — це автономний H.265 (HEVC) відеоенкодер, який повністю замінює Majestic. Він забезпечує нижчу затримку, повний HTTP API для налаштування в реальному часі, та нативну інтеграцію з WFB-ng через Unix-сокет. Бінарник, конфіг (`/etc/waybeam.json`) та init-скрипт мають назву `waybeam`.
:::

---

### Вимоги

| Компонент | Деталі |
| :--- | :--- |
| **Камера (VTX)** | Star6E (SSC30KQ / SSC338Q, Infinity6E) або Maruko (SSC378QE, Infinity6C) з OpenIPC прошивкою |
| **Сенсор** | IMX335, IMX415, GC4653 або інший підтримуваний |
| **Прошивка** | OpenIPC (Lite або FPV) |
| **Доступ** | SSH до камери (`root` / `12345`) |
| **Мережа** | Ethernet або WiFi для передачі файлів |

---

### Крок 1: Підключення до камери через SSH

Підключіться до камери по SSH. IP-адреса камери зазвичай `192.168.1.10` або визначається через роутер.

::: code-group

```powershell [Windows (PowerShell)]
ssh root@192.168.1.10
# пароль: 12345
```

```bash [macOS / Linux]
ssh root@192.168.1.10
# пароль: 12345
```

:::

::: tip Графічний клієнт для Windows
Замість командного рядка можна скористатися [PuTTY](https://www.putty.org/): у полі «Host Name» — IP камери, порт `22`, тип `SSH`, логін `root`, пароль `12345`.
:::

---

### Крок 2: Зупинка Majestic

Перед встановленням Waybeam необхідно зупинити та вимкнути Majestic:

```bash
# Зупинити Majestic
killall majestic 2>/dev/null

# Вимкнути автозапуск Majestic
# (якщо він запускається через init-скрипт)
if [ -f /etc/init.d/S95majestic ]; then
    chmod -x /etc/init.d/S95majestic
fi
```

::: warning Важливо
Majestic і Waybeam не можуть працювати одночасно — вони обидва використовують ISP та відеоенкодер чіпа.
:::

---

### Крок 3: Завантаження Waybeam

Релізи поставляються тарболами, які містять бінарник `waybeam`, шаблон конфігурації `waybeam.json` і (для Maruko) потрібні бібліотеки SigmaStar. Оберіть тарбол відповідно до вашого чіпа.

::: code-group

```bash [Star6E · SSC30KQ / SSC338Q]
cd /tmp
curl -L -o waybeam-star6e.tar.gz \
  https://github.com/OpenIPC/waybeam_venc/releases/latest/download/waybeam-star6e.tar.gz
tar xzf waybeam-star6e.tar.gz

# Встановити бінарник
cp waybeam /usr/bin/waybeam
chmod +x /usr/bin/waybeam
```

```bash [Maruko · SSC378QE]
cd /tmp
curl -L -o waybeam-maruko.tar.gz \
  https://github.com/OpenIPC/waybeam_venc/releases/latest/download/waybeam-maruko.tar.gz
tar xzf waybeam-maruko.tar.gz

cp waybeam /usr/bin/waybeam
chmod +x /usr/bin/waybeam
```

:::

::: warning Maruko потребує бібліотек
Стокова прошивка OpenIPC для Infinity6C **не містить** vendor-бібліотек SigmaStar (MI). Бібліотеки з тарболу потрібно скопіювати в `/usr/lib/`, а також можуть знадобитися сенсорні `.ko`-модулі та ISP `.bin`-файли. Деталі та скрипти провізіонінгу — у [README репозиторію](https://github.com/OpenIPC/waybeam_venc#maruko-infinity6c).
:::

::: tip Альтернативний метод — SCP зі зібраного бінарника
Якщо ви збираєте Waybeam самостійно (`make build SOC_BUILD=star6e`):
```bash
scp out/star6e/waybeam root@192.168.1.10:/usr/bin/waybeam
```
:::

---

### Крок 4: Створення конфігурації

Створіть файл конфігурації `/etc/waybeam.json` (у тарболі є готовий шаблон `waybeam.json` — його можна просто скопіювати в `/etc/`):

```bash
cat > /etc/waybeam.json << 'EOF'
{
  "system": { "webPort": 80, "overclockLevel": 1, "verbose": false },
  "sensor": { "index": -1, "mode": -1 },
  "isp": {
    "sensorBin": "",
    "aeEngine": "sdk",
    "aeFps": 15,
    "gainMax": 0,
    "awbMode": "auto",
    "awbCt": 5500,
    "keepAspect": true
  },
  "image": { "mirror": false, "flip": false, "rotate": 0 },
  "video0": {
    "rcMode": "cbr",
    "fps": 60,
    "size": "1920x1080",
    "bitrate": 8192,
    "gopSize": 1.0,
    "qpDelta": -4,
    "frameLost": true,
    "sceneThreshold": 0,
    "sceneHoldoff": 2,
    "resilience": "off",
    "framing": "off",
    "zoomX": 0.5,
    "zoomY": 0.5
  },
  "outgoing": {
    "enabled": true,
    "server": "unix://wfb_tx",
    "streamMode": "rtp",
    "maxPayloadSize": 1400,
    "connectedUdp": true,
    "audioPort": 0,
    "sidecarPort": 0
  },
  "fpv": { "roiEnabled": true, "roiQp": 0, "roiSteps": 2, "roiCenter": 0.4, "noiseLevel": 0 },
  "audio": {
    "enabled": false,
    "sampleRate": 48000,
    "channels": 1,
    "codec": "opus",
    "volume": 80,
    "mute": false
  },
  "imu": {
    "enabled": false,
    "i2cDevice": "/dev/i2c-1",
    "i2cAddr": "0x68",
    "sampleRateHz": 200,
    "gyroRangeDps": 1000,
    "calFile": "/etc/imu.cal",
    "calSamples": 400
  },
  "record": {
    "enabled": false,
    "mode": "mirror",
    "dir": "/mnt/mmcblk0p1",
    "format": "ts",
    "maxSeconds": 300,
    "maxMB": 500,
    "bitrate": 0,
    "fps": 0,
    "gopSize": 0,
    "server": ""
  },
  "snapshot": { "enabled": true, "quality": 80, "channel": 7, "width": 0, "height": 0 },
  "debug": { "showOsd": false }
}
EOF
```

::: info Усі поля опціональні
Будь-яке пропущене поле бере вбудоване значення за замовчуванням. Дефолтне `video0.size` — `"auto"` (рідна роздільність сенсора).
:::

::: tip Кодек завжди H.265
Поля `video0.codec` більше немає — Waybeam кодує тільки H.265 (HEVC). Старі конфіги з `"codec": "h264"` чи `"h265"` завантажуються без помилок, але ключ ігнорується.
:::

---

### Крок 5: Ключові параметри конфігурації

<strong>Відео (`video0`)</strong>

| Параметр | Опис | Типові значення |
| :--- | :--- | :--- |
| `rcMode` | Режим керування бітрейтом | `"cbr"`, `"vbr"`, `"avbr"`, `"fixqp"` |
| `fps` | Частота кадрів | `30`, `60`, `90`, `120` |
| `size` | Роздільна здатність | `"auto"`, `"1920x1080"`, `"1280x720"` |
| `bitrate` | Бітрейт (кбіт/с) | `4096` — `16384` |
| `gopSize` | Розмір GOP у секундах (діє лише коли `resilience: "off"`) | `0.5` — `4.0` |
| `qpDelta` | Зсув QP I/P-кадрів | `-12` — `12` |
| `resilience` | Пресет стійкості до втрат (потребує **reboot**) | `"off"`, `"racing"`, `"fpv"`, … |
| `framing` | Стабілізація / цифровий зум | `"off"`, `"stab"`, `"zoom-2x"`, … |

::: info Детальніше про framing та resilience
Режими стабілізації/зуму (`framing`) та пресети стійкості (`resilience`) докладно описані у розділі [Веб-панель та HTTP API](/software/waybeam-venc-web-interface).
:::

<strong>Стрімінг (`outgoing`)</strong>

| Параметр | Опис | Приклади |
| :--- | :--- | :--- |
| `enabled` | Увімкнути стрімінг | `true` / `false` |
| `server` | Адреса приймача | `"unix://wfb_tx"`, `"udp://192.168.1.1:5600"`, `"shm://venc_ring"` |
| `streamMode` | Режим потоку | `"rtp"` або `"compact"` |
| `maxPayloadSize` | Макс. розмір RTP-пакету | `1400` (за замовч.) |

<strong>FPV ROI-кодування (`fpv`)</strong>

| Параметр | Опис | Значення |
| :--- | :--- | :--- |
| `roiEnabled` | Пріоритет центру кадру | `true` — центр у вищій якості |
| `roiQp` | QP-зсув для ROI (`-30`…`30`) | `-18` — максимальна якість центру |
| `roiSteps` | Кількість зон | `1` — `4` |
| `roiCenter` | Розмір центральної зони | `0.1` — `0.9` |

---

### Крок 6: Запуск Waybeam

<strong>Ручний запуск (для тестування)</strong>

```bash
# Запуск з виводом логів у консоль
waybeam
```

Веб-панель буде доступна за адресою `http://<ip-камери>/`

<strong>Перевірка роботи</strong>

```bash
# Перевірити версію
curl http://localhost/api/v1/version

# Перевірити конфігурацію
curl http://localhost/api/v1/config

# Перевірити, які параметри можна змінити в реальному часі
curl http://localhost/api/v1/capabilities
```

---

### Крок 7: Автозапуск Waybeam

Створіть init-скрипт для автоматичного запуску Waybeam при завантаженні камери:

```bash
cat > /etc/init.d/S96waybeam << 'INITEOF'
#!/bin/sh

case "$1" in
  start)
    echo "Starting waybeam..."
    # Переконатися, що Majestic не запущений
    killall majestic 2>/dev/null
    # Запуск waybeam у фоновому режимі
    start-stop-daemon -S -b -x /usr/bin/waybeam -- 2>&1 | tee /tmp/waybeam.log &
    ;;
  stop)
    echo "Stopping waybeam..."
    killall waybeam 2>/dev/null
    ;;
  restart)
    $0 stop
    sleep 1
    $0 start
    ;;
  *)
    echo "Usage: $0 {start|stop|restart}"
    exit 1
    ;;
esac

exit 0
INITEOF

chmod +x /etc/init.d/S96waybeam
```

::: tip Порядок запуску
Скрипт має номер `S96`, що означає запуск після більшості системних сервісів, але вам потрібно переконатися, що WiFi-драйвери та WFB-ng вже завантажені до цього моменту (особливо для `unix://wfb_tx`, де `wfb_tx` має слухати сокет раніше).
:::

::: info audioPort та sidecarPort
У конфізі вище `audioPort: 0` і `sidecarPort: 0`. Це означає:

- `audioPort: 0` — аудіо передається разом з відео через той самий канал (оптимально для WFB-ng)
- `sidecarPort: 0` — sidecar-канал діагностики вимкнений (ніяких накладних витрат)

Дефолтний шаблон має `audioPort: 5601` і `sidecarPort: 5602` — якщо вам потрібна окрема передача аудіо чи покадрова телеметрія через UDP, встановіть відповідні значення.
:::

---

### Крок 8: Зміна параметрів у реальному часі

Після запуску Waybeam ви можете змінювати параметри без перезапуску:

```bash
# Змінити бітрейт (live)
curl "http://localhost/api/v1/set?video0.bitrate=4096"

# Змінити роздільну здатність (потребує reinit)
curl "http://localhost/api/v1/set?video0.size=1280x720"

# Змінити FPS (live)
curl "http://localhost/api/v1/set?video0.fps=90"

# Увімкнути ROI для FPV (live)
curl "http://localhost/api/v1/set?fpv.roiEnabled=true"
curl "http://localhost/api/v1/set?fpv.roiQp=-18"

# Запит IDR-кейфрейму (корисно після підключення)
curl http://localhost/request/idr
```

---

### Поширені проблеми

::: details Waybeam не запускається — помилка бібліотек
Переконайтеся, що всі бібліотеки SigmaStar доступні в `/usr/lib`. На Maruko їх потрібно встановити з тарболу вручну. Якщо ви використовуєте staged-збірку, встановіть змінну:

```bash
export LD_LIBRARY_PATH=/шлях/до/lib
```
:::

::: details Немає відео після запуску
1. Перевірте, що `outgoing.enabled` встановлено в `true`
2. Перевірте правильність адреси `outgoing.server`
3. Перевірте, що Majestic повністю зупинений: `ps | grep majestic`
4. Перевірте логи: `cat /tmp/waybeam.log`
:::

::: details Чорний екран або артефакти
Перевірте сумісність сенсора:

```bash
# Поточний сенсор і доступні режими
curl http://localhost/api/v1/modes
```

Переконайтеся, що `sensor.index` та `sensor.mode` встановлені на `-1` (автовизначення).
:::

::: details Кодек H.264 не працює
Waybeam кодує **тільки H.265 (HEVC)** на обох чіпах. Поля `video0.codec` немає; H.264 не підтримується. Переконайтеся, що ваш приймач (PixelPilot, ffplay, QGroundControl, GStreamer) налаштований на H.265.
:::

---

### Наступні кроки

- [**Інтеграція з WFB-ng**](/software/waybeam-venc-install-groundstation) — налаштування Waybeam + WFB-ng на камері та наземній станції
- [**Веб-панель та HTTP API**](/software/waybeam-venc-web-interface) — детальний опис усіх API-ендпоінтів
- [**Огляд Waybeam**](/software/waybeam-venc) — повний список можливостей
