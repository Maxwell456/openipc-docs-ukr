---
title: "Встановлення venc на камеру"
description: "Покрокова інструкція встановлення waybeam venc на камеру з чіпом SigmaStar SSC338Q та інтеграція з WFB-ng замість Majestic."
---

# Встановлення venc на камеру

Ця інструкція описує, як встановити **waybeam venc** на камеру з чіпом SigmaStar (Infinity6E / Infinity6C) та налаштувати його для роботи з **WFB-ng** замість Majestic.

!!! info "Що таке venc?"
    **waybeam venc** — це автономний відеоенкодер, який повністю замінює Majestic. Він забезпечує нижчу затримку, повний HTTP API для налаштування в реальному часі, та нативну інтеграцію з WFB-ng через Unix-сокет.

---

<h3>Вимоги </h3>

| Компонент | Деталі |
| :--- | :--- |
| **Камера (VTX)** | SSC338Q (Infinity6E) або Infinity6C з OpenIPC прошивкою |
| **Сенсор** | IMX335, IMX415, GC4653 або інший підтримуваний |
| **Прошивка** | OpenIPC (Lite або FPV) |
| **Доступ** | SSH до камери (`root` / `12345`) |
| **Мережа** | Ethernet або WiFi для передачі файлів |

---

<h3>Крок 1: Підключення до камери через SSH</h3>

Підключіться до камери по SSH. IP-адреса камери зазвичай `192.168.1.10` або визначається через роутер.

<details markdown="1">
<summary><strong>Windows</strong></summary>

1. Завантажте та встановіть [PuTTY](https://www.putty.org/)
2. Введіть IP-адресу камери у полі «Host Name»
3. Порт: `22`, тип: `SSH`
4. Натисніть «Open»
5. Логін: `root`, пароль: `12345`

</details>

<details markdown="1">
<summary><strong>Mac / Linux</strong></summary>

```bash
ssh root@192.168.1.10
```

Пароль: `12345`

</details>

---

<h3>Крок 2: Зупинка Majestic</h3>

Перед встановленням venc необхідно зупинити та вимкнути Majestic:

```bash
# Зупинити Majestic
killall majestic 2>/dev/null

# Вимкнути автозапуск Majestic
# (якщо він запускається через init-скрипт)
if [ -f /etc/init.d/S95majestic ]; then
    chmod -x /etc/init.d/S95majestic
fi
```

!!! warning "Важливо"
    Majestic і venc не можуть працювати одночасно — вони обидва використовують ISP та відеоенкодер чіпа.

---

<h3>Крок 3: Завантаження venc</h3>

Завантажте бінарний файл venc на камеру. Оберіть версію відповідно до вашого чіпа:

**Для Star6E (SSC338Q / Infinity6E):**

```bash
# Завантаження бінарника venc
curl -L -o /usr/bin/venc \
  https://github.com/OpenIPC/waybeam_venc/releases/latest/download/venc-star6e

chmod +x /usr/bin/venc
```

**Для Maruko (Infinity6C):**

```bash
curl -L -o /usr/bin/venc \
  https://github.com/OpenIPC/waybeam_venc/releases/latest/download/venc-maruko

chmod +x /usr/bin/venc
```

!!! tip "Альтернативний метод — SCP"
    Якщо у вас є зібраний бінарник на комп'ютері:
    ```bash
    scp out/star6e/venc root@192.168.1.10:/usr/bin/venc
    ```

---

<h3>Крок 4: Створення конфігурації</h3>

Створіть файл конфігурації `/etc/venc.json`:

```bash
cat > /etc/venc.json << 'EOF'
{
  "system": { "webPort": 80, "overclockLevel": 1, "verbose": false },
  "sensor": {
    "index": -1,
    "mode": -1,
    "unlockEnabled": true,
    "unlockCmd": 35,
    "unlockReg": 12298,
    "unlockValue": 128,
    "unlockDir": 0
  },
  "isp": {
    "sensorBin": "", "exposure": 0,
    "legacyAe": true, "aeFps": 15, "gainMax": 0,
    "awbMode": "auto", "awbCt": 5500
  },
  "image": { "mirror": false, "flip": false, "rotate": 0 },
  "video0": {
    "codec": "h265",
    "rcMode": "cbr",
    "fps": 60,
    "size": "1920x1080",
    "bitrate": 8192,
    "gopSize": 1.0,
    "qpDelta": -4,
    "frameLost": true,
    "sceneThreshold": 0,
    "sceneHoldoff": 2
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
  "eis": {
    "enabled": false,
    "mode": "gyroglide",
    "marginPercent": 30,
    "testMode": false,
    "swapXY": false,
    "invertX": false,
    "invertY": false,
    "gain": 1.0,
    "deadbandRad": 0.0,
    "recenterRate": 0.5,
    "maxSlewPx": 0,
    "biasAlpha": 0.001
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
  "debug": {
    "showOsd": false
  }
}
EOF
```

---

<h3>Крок 5: Ключові параметри конфігурації</h3>

<strong>Відео (`video0`)</strong>

| Параметр | Опис | Типові значення |
| :--- | :--- | :--- |
| `codec` | Кодек відео | `"h265"` або `"h264"` |
| `rcMode` | Режим керування бітрейтом | `"cbr"`, `"vbr"`, `"avbr"`, `"fixqp"` |
| `fps` | Частота кадрів | `30`, `60`, `90`, `120` |
| `size` | Роздільна здатність | `"1920x1080"`, `"1280x720"` |
| `bitrate` | Бітрейт (кбіт/с) | `4096` — `16384` |
| `gopSize` | Розмір GOP у секундах | `0.5` — `2.0` |

<strong> Стрімінг (`outgoing`)</strong>

| Параметр | Опис | Приклади |
| :--- | :--- | :--- |
| `enabled` | Увімкнути стрімінг | `true` / `false` |
| `server` | Адреса приймача | `"unix://wfb_tx"`, `"udp://192.168.1.1:5600"` |
| `streamMode` | Режим потоку | `"rtp"` або `"compact"` |
| `maxPayloadSize` | Макс. розмір RTP-пакету | `1400` (за замовч.) |

<strong> FPV ROI-кодування (`fpv`)</strong>

| Параметр | Опис | Значення |
| :--- | :--- | :--- |
| `roiEnabled` | Пріоритет центру кадру | `true` — центр у вищій якості |
| `roiQp` | QP-зсув для ROI | `-18` — максимальна якість центру |
| `roiSteps` | Кількість зон | `2` — `4` |
| `roiCenter` | Розмір центральної зони | `0.25` — `0.5` |

---

<h3>Крок 6: Запуск venc</h3>

<strong> Ручний запуск (для тестування)</strong>

```bash
# Запуск з виводом логів у консоль
venc
```

Веб-панель буде доступна за адресою `http://<ip-камери>/`

<strong> Перевірка роботи</strong>

```bash
# Перевірити версію
curl http://localhost/api/v1/version

# Перевірити конфігурацію
curl http://localhost/api/v1/config

# Перевірити, які параметри можна змінити в реальному часі
curl http://localhost/api/v1/capabilities
```

---

<h3> Крок 7: Автозапуск venc</h3>

Створіть init-скрипт для автоматичного запуску venc при завантаженні камери:

```bash
cat > /etc/init.d/S96venc << 'INITEOF'
#!/bin/sh

case "$1" in
  start)
    echo "Starting venc..."
    # Переконатися, що Majestic не запущений
    killall majestic 2>/dev/null
    # Запуск venc у фоновому режимі
    start-stop-daemon -S -b -x /usr/bin/venc -- 2>&1 | tee /tmp/venc.log &
    ;;
  stop)
    echo "Stopping venc..."
    killall venc 2>/dev/null
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

chmod +x /etc/init.d/S96venc
```

!!! tip "Порядок запуску"
    Скрипт має номер `S96`, що означає запуск після більшості системних сервісів, але вам потрібно переконатися, що WiFi-драйвери та WFB-ng вже завантажені до цього моменту.

!!! note "audioPort та sidecarPort"
    У конфізі вище `audioPort: 0` і `sidecarPort: 0` встановлені значенням 0. Це означає:

    - `audioPort: 0` — аудіо передається разом з відео через той самий Unix-сокет (оптимально для WFB-ng)
    - `sidecarPort: 0` — sidecar-канал діагностики вимкнений (ніяких накладних витрат)

    Дефолтний конфіг має `audioPort: 5601` і `sidecarPort: 5602` — якщо вам потрібна окрема передача аудіо через UDP, встановіть відповідні значення.

---

<h3> Крок 8: Зміна параметрів у реальному часі</h3>

Після запуску venc ви можете змінювати параметри без перезапуску:

```bash
# Змінити бітрейт
curl "http://localhost/api/v1/set?video0.bitrate=4096"

# Змінити роздільну здатність (потребує reinit)
curl "http://localhost/api/v1/set?video0.size=1280x720"

# Змінити FPS
curl "http://localhost/api/v1/set?video0.fps=90"

# Увімкнути ROI для FPV
curl "http://localhost/api/v1/set?fpv.roiEnabled=true"
curl "http://localhost/api/v1/set?fpv.roiQp=-18"

# Запит IDR-кейфрейму (корисно після підключення)
curl http://localhost/request/idr
```

---

<h3>Поширені проблеми</h3>

??? question "venc не запускається — помилка бібліотек"
    Переконайтеся, що всі бібліотеки SigmaStar доступні в `/usr/lib`. Якщо ви використовуєте staged-збірку, встановіть змінну:
    ```bash
    export LD_LIBRARY_PATH=/шлях/до/lib
    ```

??? question "Немає відео після запуску"
    1. Перевірте, що `outgoing.enabled` встановлено в `true`
    2. Перевірте правильність адреси `outgoing.server`
    3. Перевірте, що Majestic повністю зупинений: `ps | grep majestic`
    4. Перевірте логи: `cat /tmp/venc.log`

??? question "Чорний екран або артефакти"
    Перевірте сумісність сенсора:
    ```bash
    curl http://localhost/api/v1/version
    ```
    Переконайтеся, що `sensor.index` та `sensor.mode` встановлені на `-1` (автовизначення).

??? question "Star6E: помилка при h264 з RTP"
    На Star6E RTP-режим підтримує тільки H.265. Змініть кодек:
    ```bash
    curl "http://localhost/api/v1/set?video0.codec=h265"
    ```

---

<h3>Наступні кроки</h3>

- [**Інтеграція з WFB-ng**](waybeam-venc-install-groundstation.md) — налаштування venc + WFB-ng на камері та наземній станції
- [**Веб-панель та HTTP API**](waybeam-venc-web-interface.md) — детальний опис усіх API-ендпоінтів
- [**Огляд waybeam venc**](waybeam-venc.md) — повний список можливостей
