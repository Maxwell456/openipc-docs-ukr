---
title: "Веб-панель та HTTP API venc"
description: "Повний довідник HTTP API waybeam venc — веб-дешборд, ISP-тюнінг, керування записом та параметрами відео в реальному часі."
---

# Веб-панель та HTTP API

waybeam venc включає вбудовану веб-панель та повний HTTP API для керування всіма параметрами в реальному часі. Веб-панель доступна за адресою `http://<ip-камери>/` (порт за замовчуванням — 80).

---

<h3>Веб-панель</h3>

<strong>Вкладка Settings (Налаштування)</strong>

Всі 84 параметри конфігурації згруповані за 13 секціями:

| Секція | Кількість полів | Опис |
| :--- | :--- | :--- |
| System | 3 | Порт, розгін, логування |
| Sensor | 7 | Вибір та розблокування сенсора |
| ISP | 7 | Експозиція, AWB, AE |
| Image | 3 | Дзеркало, фліп, поворот |
| Video | 10 | Кодек, бітрейт, FPS, GOP |
| Outgoing | 7 | Стрімінг, адреса, режим |
| Audio | 6 | Кодек, частота, гучність |
| FPV | 5 | ROI-кодування |
| IMU | 7 | Гіроскоп BMI270 |
| EIS | 11 | Стабілізація зображення |
| Recording | 10 | Запис на SD-картку |
| Adaptive Encoder | 2 | Детекція сцен |
| Debug | 1 | OSD |

**Елементи інтерфейсу:**

- 🟢 **Live** — параметр змінюється миттєво без перезапуску
- 🟠 **Restart** — потребує reinit пайплайну (автоматично)
- **Apply Changes** — застосувати всі змінені поля
- **Save & Restart** — застосувати та перезапустити пайплайн
- **Restore Defaults** — повернути конфігурацію з диска

<strong>Вкладка API Reference</strong>

Документація всіх HTTP-ендпоінтів з прикладами відповідей. Категорії:

- Configuration
- Encoder Control
- ISP & Image Quality
- Recording
- Dual-Stream

<strong>Вкладка Image Quality (ISP)</strong>

Прямий доступ до 62 параметрів ISP SigmaStar:

- **Параметри** — розгортувані секції з чіпами параметрів
- **Мульти-поля** — вбудований редактор для складних параметрів (colortrans, OBC, demosaic тощо)
- **Export / Import** — збереження та відновлення ISP-профілів у JSON

---

<h3>HTTP API — довідник</h3>

Всі ендпоінти використовують HTTP GET (сумісно з BusyBox wget). Відповіді — JSON у форматі `{"ok": true/false, ...}`.

---

<strong>Основні ендпоінти</strong>

<strong>GET /api/v1/version</strong>

Повертає інформацію про версію.

```bash
curl http://<ip>:80/api/v1/version
```

**Відповідь:**
```json
{
  "ok": true,
  "data": {
    "app_version": "0.5.2",
    "backend": "star6e",
    "contract_version": "0.2.0",
    "config_schema_version": "0.2.0"
  }
}
```

---

<strong>GET /api/v1/config</strong>

Повертає повну активну конфігурацію.

```bash
curl http://<ip>:80/api/v1/config
```

---

<strong>GET /api/v1/capabilities</strong>

Показує мутабельність кожного поля (`live` або `restart_required`) та підтримку бекендом.

```bash
curl http://<ip>:80/api/v1/capabilities
```

!!! tip "Перевірка підтримки"
    Використовуйте цей ендпоінт, щоб дізнатися, які поля можна змінювати на льоту, а які потребують перезапуску пайплайну.

---

<h3>Читання та запис полів</h3>

<strong>GET /api/v1/get?field_name</strong>

Прочитати одне поле:

```bash
curl "http://<ip>:80/api/v1/get?video0.bitrate"
```

**Відповідь:**
```json
{"ok": true, "data": {"field": "video0.bitrate", "value": 8192}}
```

---

<strong>GET /api/v1/set?field_name=value</strong>

Записати поле. Live-поля застосовуються миттєво. Restart-поля ініціюють reinit.

```bash
# Миттєва зміна бітрейту (live)
curl "http://<ip>:80/api/v1/set?video0.bitrate=4096"

# Мульти-зміна (тільки для live-полів)
curl "http://<ip>:80/api/v1/set?video0.bitrate=4096&system.verbose=true"

# Зміна роздільної здатності (restart — reinit пайплайну)
curl "http://<ip>:80/api/v1/set?video0.size=1280x720"
```

**Відповіді:**
```json
// Одне поле
{"ok": true, "data": {"field": "video0.bitrate", "value": 4096}}

// Мульти-зміна
{"ok": true, "data": {"applied": [
  {"field": "video0.bitrate", "value": 4096},
  {"field": "system.verbose", "value": true}
]}}

// Restart-поле
{"ok": true, "data": {"field": "video0.size", "value": "1280x720", "reinit_pending": true}}
```

!!! warning "Обмеження мульти-set"
    Мульти-set підтримується тільки для live-полів. Якщо хоча б одне restart-поле присутнє — весь запит відхиляється. Restart-зміни відправляйте по одній.

!!! danger "HTTP 409 — помилка валідації"
    Якщо значення невалідне (наприклад, неіснуючий режим AWB або якщо поле не існує), API поверне **HTTP 409 Conflict** замість звичайного 200.

---

<strong>GET /api/v1/restart</strong>

Повний reinit пайплайну. Перезавантажує `/etc/venc.json` та перезапускає камеру без завершення процесу.

```bash
curl http://<ip>:80/api/v1/restart
```

---

<h3>Контроль енкодера</h3>

<strong>GET /request/idr</strong>

Запит IDR-кейфрейму від енкодера:

```bash
curl http://<ip>:80/request/idr
```

!!! tip "Коли запитувати IDR"
    - Після підключення нового глядача
    - Після втрати пакетів у радіоканалі
    - При появі артефактів відео

---

<strong>GET /api/v1/awb</strong>

Стан автобалансу білого від ISP:

```bash
curl http://<ip>:80/api/v1/awb
```

---

<h3>Запис на SD-картку</h3>

<strong>GET /api/v1/record/start</strong>

Почати запис. Використовує сконфігурований `record.dir`, або можна вказати каталог параметром:

```bash
# Запис у каталог за замовчуванням
curl "http://<ip>:80/api/v1/record/start"

# Запис у вказаний каталог
curl "http://<ip>:80/api/v1/record/start?dir=/mnt/mmcblk0p1"
```

<strong>GET /api/v1/record/stop</strong>

Зупинити запис:

```bash
curl "http://<ip>:80/api/v1/record/stop"
```

<strong>GET /api/v1/record/status</strong>

Статус запису:

```bash
curl "http://<ip>:80/api/v1/record/status"
```

**Відповідь:**
```json
{
  "ok": true,
  "data": {
    "active": true,
    "format": "ts",
    "path": "/mnt/mmcblk0p1/rec_01h23m45s_abcd.ts",
    "frames": 1500,
    "bytes": 12345678,
    "segments": 1,
    "stop_reason": "none"
  }
}
```

---

<h3>Dual-Stream (Gemini-режим)</h3>

<strong>GET /api/v1/dual/status</strong>

Статус другого VENC-каналу:

```bash
curl "http://<ip>:80/api/v1/dual/status"
```

**Відповідь:**
```json
{"ok": true, "data": {"active": true, "channel": 1, "bitrate": 20000, "fps": 120, "gop": 240}}
```

!!! warning "Dual VENC не активний"
    Якщо режим запису не `"dual"` або `"dual-stream"`, цей ендпоінт поверне **HTTP 404**.

<strong>GET /api/v1/dual/set?param=value</strong>

Зміна параметрів другого каналу в реальному часі:

```bash
# Змінити бітрейт запису
curl "http://<ip>:80/api/v1/dual/set?bitrate=10000"

# Змінити GOP (у секундах)
curl "http://<ip>:80/api/v1/dual/set?gop=1.0"
```

<strong>GET /api/v1/dual/idr</strong>

IDR-кейфрейм для другого каналу:

```bash
curl "http://<ip>:80/api/v1/dual/idr"
```

---

<h3>ISP Image Quality</h3>

<strong>GET /api/v1/iq</strong>

Експорт усіх ISP-параметрів:

```bash
# Зберегти як файл
curl http://<ip>:80/api/v1/iq > my_tuning.json
```

<strong>POST /api/v1/iq/import</strong>

Імпорт ISP-параметрів (повний або частковий):

```bash
# Повний імпорт
curl -X POST -H "Content-Type: application/json" \
  -d @my_tuning.json http://<ip>:80/api/v1/iq/import

# Частковий імпорт — тільки конкретні параметри
echo '{"lightness":{"value":75},"demosaic":{"fields":{"dir_thrd":30}}}' | \
  curl -X POST -H "Content-Type: application/json" -d @- http://<ip>:80/api/v1/iq/import
```

<strong>GET /api/v1/iq/set?param=value</strong>

Зміна окремого ISP-параметра (dot-notation):

```bash
# Встановити одне поле
curl "http://<ip>:80/api/v1/iq/set?colortrans.y_ofst=200"

# Встановити масив (через кому)
curl "http://<ip>:80/api/v1/iq/set?colortrans.matrix=23,45,9,1005,987,56,56,977,1015"
```

---

<h3>Приклади типових сценаріїв</h3>

<strong>Швидке перемикання на 720p 90fps</strong>

```bash
curl "http://<ip>/api/v1/set?video0.size=1280x720"
# Чекаємо reinit...
curl "http://<ip>/api/v1/set?video0.fps=90"
curl "http://<ip>/api/v1/set?video0.bitrate=4096"
```

<strong>Ручний баланс білого (6500K)</strong>

```bash
curl "http://<ip>/api/v1/set?isp.awbMode=ct_manual"
curl "http://<ip>/api/v1/set?isp.awbCt=6500"
```

<strong>Увімкнення ROI-кодування для FPV</strong>

```bash
curl "http://<ip>/api/v1/set?fpv.roiEnabled=true"
curl "http://<ip>/api/v1/set?fpv.roiQp=-18"
curl "http://<ip>/api/v1/set?fpv.roiSteps=2"
```

<strong>Увімкнення EIS (тільки Star6E)</strong>

```bash
# Спочатку в /etc/venc.json:
# "imu": {"enabled": true}, "eis": {"enabled": true, "mode": "gyroglide"}
# Потім перезапуск:
curl http://<ip>/api/v1/restart
```

!!! info "Калібрування IMU"
    Після перезапуску тримайте камеру нерухомо 2 секунди для автокалібрування гіроскопа.

---

<h3>Рекомендовані налаштування за сценарієм</h3>

<strong>FPV-рейсінг (мінімальна затримка)</strong>

```json
{
  "video0": {"codec":"h265", "rcMode":"cbr", "fps":90, "size":"1280x720", "bitrate":6144, "gopSize":0.5},
  "fpv": {"roiEnabled":true, "roiQp":-12, "roiSteps":2, "roiCenter":0.35},
  "outgoing": {"streamMode":"rtp", "server":"unix://wfb_tx"}
}
```

<strong>FPV-фрістайл (якість + запис)</strong>

```json
{
  "video0": {"codec":"h265", "rcMode":"cbr", "fps":60, "size":"1920x1080", "bitrate":8192, "gopSize":1.0},
  "fpv": {"roiEnabled":true, "roiQp":-18, "roiSteps":3, "roiCenter":0.4},
  "record": {"enabled":true, "mode":"dual", "bitrate":20000, "fps":120},
  "outgoing": {"streamMode":"rtp", "server":"unix://wfb_tx"}
}
```

<strong>Далекий зв'язок (long range)</strong>

```json
{
  "video0": {"codec":"h265", "rcMode":"cbr", "fps":30, "size":"1280x720", "bitrate":3072, "gopSize":2.0},
  "fpv": {"roiEnabled":false},
  "outgoing": {"streamMode":"rtp", "server":"unix://wfb_tx"}
}
```

---

<h3>Наступні кроки</h3>

- [**Огляд waybeam venc**](waybeam-venc.md) — повний список можливостей
- [**Встановлення на камеру**](waybeam-venc-install-camera.md) — початкове встановлення
- [**Інтеграція з WFB-ng**](waybeam-venc-install-groundstation.md) — налаштування зв'язки з WFB
