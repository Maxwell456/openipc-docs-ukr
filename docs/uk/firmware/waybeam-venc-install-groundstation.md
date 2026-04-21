---
title: "Інтеграція venc з WFB-ng"
description: "Як налаштувати waybeam venc для роботи з WFB-ng замість Majestic — повна інструкція для камери та наземної станції."
---

# Інтеграція venc з WFB-ng

Ця інструкція описує, як повністю замінити **Majestic** на **waybeam venc** у зв'язці з **WFB-ng** (WiFi Broadcast) для FPV-стрімінгу з мінімальною затримкою.

---

<h3>Архітектура системи</h3>

```
┌─────────────────── КАМЕРА (VTX) ───────────────────┐
                                                      
  Сенсор → ISP → venc (H.265 encoder)                
                    │                                  
                    ├─ RTP через Unix-сокет            
                    ▼                                  
              wfb_tx (WFB-ng TX)                      
                    │                                  
                    ▼                                  
              WiFi-адаптер (RTL8812EU / AU)            
└──────────────────────────────────────────────────────┘
                     │  (радіоканал)
                     ▼
┌──────────── НАЗЕМНА СТАНЦІЯ (GS) ────────────────────┐
              WiFi-адаптер (RTL8812EU / AU)            
                    │                                  
                    ▼                                  
              wfb_rx (WFB-ng RX)                      
                    │                                  
                    ├─ UDP → PixelPilot / QGroundControl
                    ▼                                  
         Програвач відео (порт 5600)                   
└──────────────────────────────────────────────────────┘
```

---

<h3>Частина 1: Налаштування камери (VTX)</h3>

<strong>1.1 Передумови</strong>

Перед початком переконайтеся, що:

- ✅ OpenIPC прошивка встановлена на камері
- ✅ WFB-ng (`wfb_tx`) встановлений та працює
- ✅ WiFi-адаптер (RTL8812EU або RTL8812AU) підключений
- ✅ SSH-доступ до камери наявний

!!! info "Встановлення venc"
    Якщо venc ще не встановлений, дивіться [Встановлення venc на камеру](waybeam-venc-install-camera.md).

<strong>1.2 Зупинити Majestic</strong>

```bash
# Зупинити Majestic
killall majestic 2>/dev/null

# Вимкнути автозапуск (якщо використовується init.d)
chmod -x /etc/init.d/S95majestic 2>/dev/null
```

<strong>1.3 Налаштування venc для WFB-ng</strong>

Головна відмінність від Majestic — **спосіб передачі відео до WFB-ng**.

<strong>Спосіб 1: Unix-сокет (рекомендований)</strong>

Найбільш ефективний метод — передача через абстрактний Unix-сокет. Це зменшує затримку порівняно з UDP, оскільки дані не проходять через мережевий стек ядра.

Відредагуйте `/etc/venc.json`:

```json
{
  "outgoing": {
    "enabled": true,
    "server": "unix://wfb_tx",
    "streamMode": "rtp",
    "maxPayloadSize": 1400,
    "connectedUdp": true,
    "audioPort": 0,
    "sidecarPort": 0
  }
}
```

!!! tip "Назва сокету"
    Назва `wfb_tx` у `unix://wfb_tx` — це ім'я абстрактного Unix-сокету. Воно повинно збігатися з налаштуванням WFB-ng на стороні передавача. Перевірте конфігурацію WFB-ng щоб упевнитися, що `wfb_tx` слухає цей сокет.

<strong>Спосіб 2: UDP на localhost</strong>

Якщо WFB-ng очікує RTP-потік через UDP:

```json
{
  "outgoing": {
    "enabled": true,
    "server": "udp://127.0.0.1:5600",
    "streamMode": "rtp",
    "maxPayloadSize": 1400,
    "connectedUdp": true,
    "audioPort": 0,
    "sidecarPort": 0
  }
}
```

<strong>Спосіб 3: Shared Memory (SHM)</strong>

Для максимальної продуктивності — через кільцевий буфер у спільній пам'яті:

```json
{
  "outgoing": {
    "enabled": true,
    "server": "shm://venc_ring",
    "streamMode": "rtp",
    "maxPayloadSize": 1400,
    "connectedUdp": true,
    "audioPort": 0,
    "sidecarPort": 0
  }
}
```

!!! warning "SHM та аудіо"
    `shm://` працює тільки в режимі RTP.

    **Аудіо не підтримується через основний SHM-канал навіть при `audioPort: 0`.**
    Якщо вам потрібне аудіо при `shm://` — встановіть `audioPort > 0` (наприклад, `5601`), аудіо піде на окремий UDP-порт.

---

<strong>1.4 Налаштування WFB-ng на камері</strong>

Конфігурація WFB-ng повинна відповідати способу передачі, який ви обрали в venc.

**Для Unix-сокету** — в конфігурації `wfb_tx` вкажіть той самий абстрактний сокет:

```
# У конфігурації wfb_tx
# Вхідний потік — з Unix-сокету від venc
peer = listen://unix://wfb_tx
```

**Для UDP на localhost:**

```
# У конфігурації wfb_tx
# Вхідний потік — UDP від venc
peer = listen://udp://127.0.0.1:5600
```

<strong>1.5 Оптимальні параметри відео для WFB-ng</strong>

Рекомендовані параметри для стабільного FPV-стрімінгу через WiFi Broadcast:

```json
{
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
  }
}
```

**Пояснення параметрів:**

| Параметр | Рекомендація | Чому |
| :--- | :--- | :--- |
| `codec: "h265"` | H.265 | Краща якість при тому ж бітрейті; обов'язковий для RTP на Star6E |
| `rcMode: "cbr"` | CBR | Стабільний бітрейт — краще для радіоканалу |
| `fps: 60` | 60 fps | Баланс між плавністю і навантаженням |
| `bitrate: 8192` | 8 Мбіт/с | Оптимально для 20 МГц каналу WFB |
| `gopSize: 1.0` | 1 секунда | Швидке відновлення після втрати пакетів |
| `frameLost: true` | Увімкнено | Дозволяє пропускати кадри при перевантаженні |

!!! warning "Бітрейт і ширина каналу"
    Підбирайте бітрейт відповідно до пропускної здатності WFB-ng:

    | Ширина каналу | MCS | Макс. бітрейт | Рекомендовано |
    | :--- | :--- | :--- | :--- |
    | 20 МГц | MCS 3 | ~20 Мбіт/с | 8–12 Мбіт/с |
    | 20 МГц | MCS 1 | ~10 Мбіт/с | 4–6 Мбіт/с |
    | 40 МГц | MCS 3 | ~40 Мбіт/с | 16–22 Мбіт/с |

---

<strong>1.6 Порядок запуску сервісів</strong>

Правильний порядок запуску на камері:

```bash
# 1. Завантажити WiFi-драйвер
insmod /lib/modules/88XXau.ko 2>/dev/null

# 2. Запустити WFB-ng TX
wfb_tx -u unix://wfb_tx -p 0 -k 8 -n 12 wlan0 &

# 3. Запустити venc
venc &
```

!!! tip "Init-скрипт"
    Для автоматичного запуску створіть init-скрипт як описано у [Встановлення на камеру — Крок 7](waybeam-venc-install-camera.md#крок-7-автозапуск-venc). Переконайтеся, що порядок номерів скриптів правильний: WiFi → WFB-ng → venc.

---

<h3>Частина 2: Налаштування наземної станції (GS)</h3>

<strong>2.1 Вимоги до наземної станції</strong>

| Компонент | Варіанти |
| :--- | :--- |
| **Платформа** | Radxa Zero 3W, Raspberry Pi 4/5, x86 Linux |
| **WiFi-адаптер** | RTL8812EU (рекомендовано) або RTL8812AU |
| **Програвач** | PixelPilot (Android), QGroundControl, ffplay |

<strong>2.2 Налаштування WFB-ng RX</strong>

На наземній станції WFB-ng приймає потік та виводить його на UDP-порт для програвача:

```bash
# Запуск WFB-ng приймача
wfb_rx -p 0 -c 127.0.0.1 -u 5600 -k 8 -n 12 wlan0
```

Параметри повинні збігатися з налаштуваннями TX на камері:

| Параметр | TX (камера) | RX (наземка) | Опис |
| :--- | :--- | :--- | :--- |
| `-k` | `8` | `8` | Data-блоки FEC |
| `-n` | `12` | `12` | Всього блоків FEC |
| `-p` | `0` | `0` | Порт (канал) WFB |

<strong>2.3 Перегляд відео</strong>

<strong>PixelPilot (Android)</strong>

1. Підключіть наземну станцію до телефону
2. Відкрийте PixelPilot
3. Встановіть RTP-джерело: `udp://0.0.0.0:5600`

<strong>ffplay (Linux / Mac)</strong>

```bash
ffplay -fflags nobuffer -flags low_delay -framedrop \
  -analyzeduration 0 -probesize 32 \
  -i udp://0.0.0.0:5600
```

<strong>QGroundControl</strong>

1. Відкрийте налаштування → Video
2. Встановіть «Video Source»: `UDP h.265 Video Stream`
3. Порт: `5600`

<strong>GStreamer</strong>

```bash
gst-launch-1.0 udpsrc port=5600 \
  caps="application/x-rtp,media=video,encoding-name=H265" ! \
  rtph265depay ! h265parse ! avdec_h265 ! autovideosink sync=false
```

---

<h3> Частина 3: Аудіо через WFB-ng</h3>

venc підтримує передачу аудіо паралельно з відео:

<h4>3.1 Увімкнення аудіо на камері</h4>

Оновіть `/etc/venc.json`:

```json
{
  "audio": {
    "enabled": true,
    "sampleRate": 16000,
    "channels": 1,
    "codec": "g711a",
    "volume": 80,
    "mute": false
  },
  "outgoing": {
    "audioPort": 5601
  }
}
```

!!! info "Аудіо та Unix-сокет"
    При використанні `unix://` та `audioPort: 0` аудіо передається разом з відео через той самий сокет. При `audioPort > 0` аудіо відправляється на окремий UDP-порт `127.0.0.1:<audioPort>`.

<strong>3.2 Прийом аудіо на наземній станції</strong>

```bash
# Окремий WFB-канал для аудіо
wfb_rx -p 1 -c 127.0.0.1 -u 5601 -k 4 -n 8 wlan0

# Відтворення
ffplay -nodisp -fflags nobuffer -i udp://0.0.0.0:5601
```

---

<h3>Частина 4: Адаптивний контроль (просунуте)</h3>

<strong>4.1 Scene-Change IDR</strong>

Для покращення відновлення потоку при різких змінах сцени (зліт, маневри):

```bash
# Увімкнути детекцію сцен (тільки Star6E)
curl "http://localhost/api/v1/set?video0.sceneThreshold=150"
curl "http://localhost/api/v1/set?video0.sceneHoldoff=2"
```

- `sceneThreshold: 150` — тригер при ≈1.5x стрибку розміру кадру
- `sceneHoldoff: 2` — мінімальний інтервал між IDR кадрами

<strong>4.2 Sidecar для зовнішнього контролера</strong>

Якщо ви використовуєте зовнішній контролер якості зв'язку (adaptive link):

```bash
curl "http://localhost/api/v1/set?outgoing.sidecarPort=6666"
```

Sidecar надсилає покадрову телеметрію: `frame_type`, `complexity`, `scene_change`, `idr_inserted`, `frames_since_idr`.

---

<h3>Частина 5: Запис на SD-картку</h3>

venc підтримує одночасний стрімінг та запис:

```bash
# Увімкнити запис через API
curl "http://localhost/api/v1/record/start"

# Перевірити статус
curl "http://localhost/api/v1/record/status"

# Зупинити запис
curl "http://localhost/api/v1/record/stop"
```

**Gemini-режим** — стрімінг на WFB-ng у низькому бітрейті, а запис на SD у високій якості:

```json
{
  "record": {
    "enabled": true,
    "mode": "dual",
    "dir": "/mnt/mmcblk0p1",
    "format": "ts",
    "bitrate": 20000,
    "fps": 120,
    "gopSize": 2
  }
}
```

!!! success "Безпека записів"
    Формат MPEG-TS не потребує фіналізації файлу. Навіть при раптовому відключенні живлення запис буде читабельним до останнього записаного пакету.

---

<h3>Перевірка інтеграції</h3>

Після налаштування виконайте перевірку:

```bash
# 1. На камері — перевірити, що venc стрімить
curl http://localhost/api/v1/config | grep -A5 outgoing

# 2. На камері — перевірити FPS
curl http://localhost/api/v1/version

# 3. На наземній станції — перевірити прийом
# (має показати відео без значних затримок)
ffplay -fflags nobuffer -i udp://0.0.0.0:5600

# 4. Запитати IDR-кейфрейм для початку декодування
curl http://192.168.1.10/request/idr
```

---

<h3>Порівняння: venc + WFB-ng vs Majestic + WFB-ng</h3>

| Аспект | venc + WFB-ng | Majestic + WFB-ng |
| :--- | :--- | :--- |
| **Затримка** | Нижча (Unix-сокет / SHM) | UDP через мережевий стек |
| **API** | 84 параметри в реальному часі | Обмежений набір |
| **Запис** | Gemini-режим (стрім + запис) | Базовий |
| **ISP-тюнінг** | 60+ параметрів + export/import | Обмежений |
| **EIS** | GyroGlide-Lite (Star6E) | Немає |
| **Веб-панель** | Вбудована з повним керуванням | — |
| **Сирці** | Відкриті (MIT) | Закриті |

---

<h3>Наступні кроки</h3>

- [**Веб-панель та HTTP API**](waybeam-venc-web-interface.md) — керування через браузер
- [**Огляд waybeam venc**](waybeam-venc.md) — всі можливості
- [**Встановлення на камеру**](waybeam-venc-install-camera.md) — початкове встановлення
