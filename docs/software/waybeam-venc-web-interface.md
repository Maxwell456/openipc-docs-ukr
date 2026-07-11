---
title: "Веб-панель та HTTP API Waybeam"
description: "Повний довідник HTTP API Waybeam — веб-дешборд, ISP-тюнінг, стабілізація, resilience-пресети, керування записом та параметрами відео в реальному часі."
---

# Веб-панель та HTTP API

Waybeam включає вбудовану веб-панель та повний HTTP API для керування параметрами в реальному часі. Веб-панель доступна за адресою `http://<ip-камери>/` (порт за замовчуванням — 80) або просто `http://waybeam.local` — камера анонсує себе через mDNS. Довідник звірено з версією **v0.40.1** (липень 2026).

---

### Веб-панель

<strong>Вкладка Settings (Налаштування)</strong>

Поля конфігурації згруповані за **14 секціями**:

| Секція | Опис |
| :--- | :--- |
| System | Порт, розгін, логування |
| Sensor | Вибір сенсора (index / mode) |
| ISP | Експозиція, AWB, AE-движок (`aeEngine` діє лише на Star6E; на Maruko завжди рідні AE+AWB з пейсером) |
| Image | Дзеркало, фліп, поворот |
| Video | Кодек, бітрейт, FPS, GOP, framing, resilience |
| Outgoing | Стрімінг, адреса, режим |
| Discovery | mDNS-анонс у мережі (`waybeam.local`) |
| Audio | Кодек, частота, гучність |
| FPV | ROI-кодування + 3DNR |
| IMU | Гіроскоп BMI270 |
| Attitude | Штучний горизонт: roll/pitch/yaw з IMU, кути монтажу, трими рівня |
| Recording | Запис на SD-картку |
| Adaptive Encoder Control | Детекція сцен |
| Debug | OSD |

**Елементи інтерфейсу:**

- 🟢 **Live** — параметр змінюється миттєво без перезапуску
- 🟠 **Restart** — потребує reinit пайплайну (автоматично)
- 🔴 **Reboot** — потребує повного перезавантаження камери (лише `video0.resilience`)
- **Apply Changes** — застосувати всі змінені поля
- **Save & Restart** — застосувати та перезапустити пайплайн
- **Restore Defaults** — повернути конфігурацію з диска

::: details Для версій до v0.8 — секція EIS (GyroGlide)
У старих версіях була окрема секція `eis` (гіроскопна стабілізація GyroGlide). Її **видалено у v0.8.0**. Стабілізація тепер живе у секції Video — поле `video0.framing` (див. [нижче](#framing-стабілізація-та-цифровий-зум)).
:::

::: details Для версій до v0.40 — 13 секцій, без Attitude
Секція **Attitude** (живі roll/pitch/yaw і кнопка «Capture level trims») з'явилась у WebUI у **v0.40**. У версіях 0.24–0.39 секцій було 13, а гіроскоп BMI270 значився у WebUI як POC без споживача.
:::

::: tip Власний дашборд
У поточних збірках (липень 2026) вбудований веб-інтерфейс можна замінити, поклавши власні файли в `/usr/share/www` — вони мають пріоритет над вбудованим дашбордом.
:::

<strong>Вкладка API Reference</strong>

Документація всіх HTTP-ендпоінтів з прикладами відповідей. Категорії: Configuration, Encoder Control, ISP & Image Quality, Recording, Dual-Stream.

<strong>Вкладка Image Quality (ISP)</strong>

Прямий доступ до 62 параметрів ISP SigmaStar:

- **Параметри** — розгортувані секції з чіпами параметрів
- **Мульти-поля** — вбудований редактор для складних параметрів (colortrans, OBC, demosaic тощо)
- **Export / Import** — збереження та відновлення ISP-профілів у JSON

---

### HTTP API — довідник

Всі ендпоінти використовують HTTP GET (сумісно з BusyBox wget). Відповіді — JSON у форматі `{"ok": true/false, ...}`.

::: tip Три рівні мутабельності
- **live** — застосовується миттєво без переривання потоку
- **restart_required** — ініціює автоматичний reinit пайплайну
- **reboot** — потребує повного перезавантаження камери (лише `video0.resilience`)

`/api/v1/capabilities` показує рівень мутабельності та підтримку кожного поля бекендом.
:::

---

<strong>GET /api/v1/version</strong>

Повертає інформацію про версію.

```bash
curl http://<ip>/api/v1/version
```

**Відповідь:**
```json
{
  "ok": true,
  "data": {
    "app_version": "0.40.1",
    "backend": "star6e",
    "contract_version": "0.12.0",
    "config_schema_version": "0.12.0"
  }
}
```

Значення `contract_version` / `config_schema_version` зростають з релізами (наприклад, у v0.19 контракт піднято до 0.11.0 через видалення `video0.frameLost`, а у v0.40 — до 0.12.0 з появою attitude-API).

---

<strong>GET /api/v1/config</strong> — повна активна конфігурація.

<strong>GET /api/v1/capabilities</strong> — мутабельність кожного поля (`live` / `restart_required`) та підтримка бекендом.

```bash
curl http://<ip>/api/v1/config
curl http://<ip>/api/v1/capabilities
```

::: tip Перевірка підтримки
Підтримка полів залежить від бекенда. Наприклад, Star6E повертає `video0.scene_threshold` як підтримуване, а Maruko — ні. Використовуйте `capabilities` перед записом.
:::

<strong>GET /api/v1/modes</strong>

Перелік режимів сенсора (pad + роздільність) — поточний вибір і всі режими, які перелічує SDK. Заповнює випадайку в WebUI.

```bash
curl http://<ip>/api/v1/modes
```

::: warning Індекси sensor.mode перенумеровано (v0.21–v0.34)
Лінійки режимів перебудовано на обох платформах: Maruko — у v0.21/v0.23, Star6E — у **v0.25–v0.34** (власні in-tree драйвери IMX335/IMX415). Star6E-лінійки тепер: IMX335 — 2560×1920@30/60, 2560×1440@90, 2176×1224@100, 1920×1080@120, `1600×900@144`; IMX415 — 5 видимих режимів від 4K@~33 до `1728×816@120`. Індекси `sensor.mode` при цьому **перенумеровано кілька разів**, а режимів стало менше, ніж у стокового драйвера: збережений у конфізі індекс поза новим діапазоном не дає waybeam стартувати. Після оновлення звіряйте старі конфіги зі списком `/api/v1/modes` або ставте `-1` (автовизначення).
:::

::: details Деталі перенумерації v0.21/v0.23 (Maruko)
Лінійки режимів на Maruko перероблено: IMX415 отримав non-binned 16:9 режими на 1485 Mbps (аж до `1920×1080@100`), IMX335 — лінійку «найкращий на кожен fps» (30/50/60/90/100) та ультранизьколатентний `1536×864@144` (v0.24).
:::

---

### Читання та запис полів

<strong>GET /api/v1/get?field_name</strong>

```bash
curl "http://<ip>/api/v1/get?video0.bitrate"
```

```json
{"ok": true, "data": {"field": "video0.bitrate", "value": 8192}}
```

<strong>GET /api/v1/set?field_name=value</strong>

Записати поле. Live-поля застосовуються миттєво. Restart-поля ініціюють reinit.

```bash
# Миттєва зміна бітрейту (live)
curl "http://<ip>/api/v1/set?video0.bitrate=4096"

# Мульти-зміна (тільки для live-полів)
curl "http://<ip>/api/v1/set?video0.bitrate=4096&system.verbose=true"

# Зміна роздільної здатності (restart — reinit пайплайну)
curl "http://<ip>/api/v1/set?video0.size=1280x720"
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

::: warning Обмеження мульти-set
Мульти-set підтримується тільки для live-полів. Якщо хоча б одне restart-поле присутнє — весь запит відхиляється. Restart-зміни відправляйте по одній (демон перезапускається між ними — чекайте, поки відновиться).
:::

::: danger HTTP 409 — помилка валідації
Якщо значення невалідне (наприклад, неіснуючий режим AWB або неіснуюче поле), API поверне **HTTP 409 Conflict** замість 200.
:::

<strong>GET /api/v1/restart</strong>

Повний reinit пайплайну. Перезавантажує `/etc/waybeam.json` та перезапускає камеру без завершення процесу.

```bash
curl http://<ip>/api/v1/restart
```

---

### Контроль енкодера

<strong>GET /request/idr</strong>

Запит IDR-кейфрейму від енкодера:

```bash
curl http://<ip>/request/idr
```

::: tip Коли запитувати IDR
- Після підключення нового глядача
- Після втрати пакетів у радіоканалі
- При появі артефактів відео
:::

<strong>GET /api/v1/idr/stats</strong>

Лічильники rate-limit IDR за каналом: скільки запитів виконано, а скільки злито (coalesced).

<strong>GET /api/v1/awb</strong>

Стан автобалансу білого від ISP.

```bash
curl http://<ip>/api/v1/idr/stats
curl http://<ip>/api/v1/awb
```

---

### Спостереження за потоком

<strong>GET /api/v1/transport/status</strong>

Стан активного відеотранспорту (UDP / Unix / SHM): відсоток заповнення буфера, прапор backpressure, лічильники втрат за весь час роботи.

<strong>GET /api/v1/audio/status</strong>

Знімок аудіо-пайплайну: чи завантажена бібліотека, стан захоплення, кодек, частота, канали, ініціалізація Opus.

```bash
curl http://<ip>/api/v1/transport/status
curl http://<ip>/api/v1/audio/status
```

---

### Attitude: штучний горизонт з IMU

З **v0.39–v0.40** Waybeam оцінює орієнтацію камери (roll/pitch/yaw) за даними гіроскопа BMI270 — для штучного горизонту в HUD наземної станції. Потрібно `imu.enabled=true` та `attitude.enabled=true` (обидва — restart).

<strong>GET /api/v1/attitude</strong> — живий знімок кутів (у системі координат камери, з урахуванням монтажних тримів):

```bash
curl http://<ip>/api/v1/attitude
```

<strong>GET /api/v1/attitude/calibrate_level</strong> — калібрування рівня однією командою: тримайте камеру нерухомо і рівно ~1.5 с — сервіс усереднить акселерометр, точно обчислить трими (`attitude.trimRollDeg` / `trimPitchDeg`), збереже їх у конфіг і перезапустить пайплайн:

```bash
curl http://<ip>/api/v1/attitude/calibrate_level
```

Можливі помилки: **409** — IMU вимкнений або камера рухається; **501** — на Maruko (оцінювач ще не підключений до IMU-шляху цього бекенда).

Поля секції `attitude` (усі — restart):

| Поле | Опис |
| :--- | :--- |
| `enabled` | Увімкнути оцінку горизонту |
| `mountDeg` | Кут монтажу камери навколо осі об'єктива: 0 / 90 / 180 / 270 |
| `invertRoll` / `invertPitch` | Інверсія знаків кутів |
| `axisFwd` / `axisDown` | Перестановка осей сенсора для плат у нестандартній орієнтації (будь-яка з 24 осьових); за замовчуванням `+x` / `+z` |
| `trimRollDeg` / `trimPitchDeg` | Трими рівня — їх записує калібрування |

::: info ATTITUDE у RTP-sidecar
За увімкненого sidecar (`outgoing.sidecarPort`) до покадрової телеметрії додається 12-байтовий трейлер **ATTITUDE** (roll/pitch/yaw у кроках 0.1°, статус, вік IMU-семплу) — для HUD. Сам sidecar з v0.39 **мультипідписний**: до 4 одержувачів одночасно (TTL 5 с на слот), тож підписка HUD більше не «викрадає» телеметрію у wfb-контролера. Трейлер — тільки Star6E. З v0.40.1 оцінювач відкидає биті IMU-семпли (NaN/Inf) і не публікує «застиглий» горизонт.
:::

У WebUI секція **Attitude** показує кути наживо (опитування 1 Гц) і має кнопку **Capture level trims** — калібрує, оновлює поля та перезапускає пайплайн.

---

### Discovery (mDNS)

Камера анонсує себе в локальній мережі як сервіс `_waybeam-venc._tcp.local`: унікальне ім'я `waybeam-<суфікс>.local` (суфікс — хвіст die ID чипа SigmaStar) та, за замовчуванням, коротке `waybeam.local`. Поля секції `discovery` доступні через API та WebUI (секція Discovery):

```bash
# Стан анонсу
curl "http://<ip>/api/v1/get?discovery.enabled"

# Власне ім'я замість waybeam-<суфікс>
curl "http://<ip>/api/v1/set?discovery.name=my-drone"

# Вимкнути коротке ім'я waybeam.local (корисно, якщо камер у мережі кілька)
curl "http://<ip>/api/v1/set?discovery.bareAlias=false"
```

Повний 12-значний серійник (die ID) — у `GET /api/v1/config` → `data.device.serial` (тільки читання). Конфлікт короткого імені між кількома камерами вирішується автоматично за RFC 6762 (IP-tiebreak).

---

### Snapshot (JPEG)

<strong>GET /api/v1/snapshot.jpg</strong>

Один JPEG-кадр з окремого MJPEG-каналу VENC (відгалуження від того ж порту, що й основний H.265-потік). Без параметрів; якість за замовчуванням 80, роздільність — як в основному потоці.

```bash
curl -o snapshot.jpg http://<ip>/api/v1/snapshot.jpg
```

Відповідь — `Content-Type: image/jpeg`. Можливі помилки: `503 snapshot_disabled` (пайплайн ще не піднявся), `504 snapshot_timeout` (немає кадру за 1500 мс), `500 snapshot_failed`.

::: info Налаштування snapshot
`snapshot.quality` — **live** (миттєво, без reinit). Поля `snapshot.channel`, `snapshot.width`, `snapshot.height` — restart (зашиваються при `MI_VENC_CreateChn`). `width=0`/`height=0` означає «як в основному потоці».
:::

---

### Запис на SD-картку

<strong>GET /api/v1/record/start</strong>

Почати запис. Використовує сконфігурований `record.dir`, або вкажіть каталог параметром:

```bash
curl "http://<ip>/api/v1/record/start"
curl "http://<ip>/api/v1/record/start?dir=/mnt/mmcblk0p1"
```

<strong>GET /api/v1/record/stop</strong> — зупинити запис.

<strong>GET /api/v1/record/status</strong> — статус запису:

```bash
curl "http://<ip>/api/v1/record/status"
```

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

::: warning Запис на Maruko
HTTP-керування записом (`start`/`stop`) працює лише на Star6E. На Maruko запис **тільки через конфіг** (`record.enabled=true` + `record.mode=...` у `/etc/waybeam.json`), а `/api/v1/record/start|stop` повертає `501 not_implemented`.
:::

---

### Dual-Stream (Gemini-режим)

<strong>GET /api/v1/dual/status</strong>

Статус другого VENC-каналу (лише режими `dual` / `dual-stream`):

```bash
curl "http://<ip>/api/v1/dual/status"
```

```json
{"ok": true, "data": {"active": true, "channel": 1, "bitrate": 20000, "fps": 120, "gop": 240}}
```

::: warning Dual VENC не активний
Якщо режим запису не `"dual"` або `"dual-stream"`, цей ендпоінт поверне **HTTP 404**.
:::

<strong>GET /api/v1/dual/set?param=value</strong>

```bash
# Змінити бітрейт запису
curl "http://<ip>/api/v1/dual/set?bitrate=10000"

# Змінити GOP (у секундах)
curl "http://<ip>/api/v1/dual/set?gop=1.0"
```

<strong>GET /api/v1/dual/idr</strong> — IDR-кейфрейм для другого каналу.

---

### Framing: стабілізація та цифровий зум

`video0.framing` — це **єдиний користувацький перемикач** обрізки VPE. Це іменований пресет (restart-required); коефіцієнт обрізки *виводиться* з пресету (окремого поля `zoomPct` немає).

| `framing` | Ефект | Роздільність @1080p | Чіпи |
| :--- | :--- | :--- | :--- |
| `off` | Повний кадр | 1920×1080 | обидва |
| `stab` | Стабілізація (центрована обрізка 80%) | 1536×864 | обидва (Maruko — з v0.35) |
| `stab-fill` | Стабілізація (плаваюче зображення на чорній рамці) | 1920×1080 | обидва (Maruko — з v0.37) |
| `zoom-1.25x` | Цифровий зум 1.25× | 1536×864 | обидва |
| `zoom-1.50x` | Цифровий зум 1.50× | 1280×720 | обидва |
| `zoom-1.75x` | Цифровий зум 1.75× | 1088×608 | обидва |
| `zoom-2x` | Цифровий зум 2× | 960×528 | обидва |
| `zoom-3x` | Цифровий зум 3× | 640×352 | обидва |
| `zoom-4x` | Цифровий зум 4× | 480×256 | обидва |

**Цифровий зум** зменшує і вікно обрізки, і вихідну роздільність — без апскейлу, без додаткового навантаження на канал. Панорамування всередині зуму — live, через `video0.zoomX` / `video0.zoomY` (∈ [0,1], центр 0.5/0.5):

```bash
# Увімкнути 3× зум (restart)
curl "http://<ip>/api/v1/set?video0.framing=zoom-3x"

# Панорамування (live) — лівий верхній кут / центр
curl "http://<ip>/api/v1/set?video0.zoomX=0.0&video0.zoomY=0.0"
curl "http://<ip>/api/v1/set?video0.zoomX=0.5&video0.zoomY=0.5"
```

**Стабілізація** (`stab` / `stab-fill`) використовує Kalman-фільтр траєкторії і з v0.35/v0.37 працює на обох чіпах. Тонке налаштування (всі restart; повторний вибір пресету скидає їх до дефолтів, тому **спочатку задавайте `framing`, потім переоприділення**):

| Поле | За замовч. | Опис |
| :--- | :--- | :--- |
| `video0.stabAccuracy` | `auto` | Рівень детектора руху: `high` / `medium` / `low` (якість ↔ CPU). `auto` = `high` на Star6E, `low` на одноядерному Maruko (v0.36) |
| `video0.stabCropPct` | 80 | Запас на стабілізацію (менше = більший «мертвий» бордер, більше поглинання руху) |
| `video0.stabKalmanQ` | 0.03 | Реакція на панорамування (`0.001..1.0`; вище = швидше слідує за повільними панорамами) |
| `video0.stabKalmanR` | 2.0 | **Головний параметр відчуття.** Плавність (`0.1..50.0`; вище = плавніше, але із затримкою) |
| `video0.pauseStab` | — | **live** пауза: плавно повертає вікно/зображення в центр (тільки `stab`/`stab-fill`) |

::: warning Стабілізація на Maruko — ціна CPU
Детектор руху — програмна NEON-бібліотека SigmaStar, не апаратний блок. На одноядерному Maruko це помітна частка CPU (у `stab-fill` ≈29% ядра на 50 fps при `stabAccuracy=low`). Також на Maruko `stab-fill` несумісний з `record.mode: "dual"` — такий запит відхиляється.
:::

::: details Для версій до v0.35/v0.37 — стабілізація лише на Star6E
До v0.35 `stab`, а до v0.37 і `stab-fill` працювали тільки на Star6E: на Maruko детектор `MI_IVE` не ініціалізувався через несумісну vendor-бібліотеку, тож WebUI показував контролі стабілізації неактивними, а `/set` відхиляв відповідні поля. З v0.35 тарбол Maruko постачає сумісну `libmi_ive.so`, і обидва пресети доступні на обох чіпах.
:::

```bash
# Увімкнути стабілізацію (restart)
curl "http://<ip>/api/v1/set?video0.framing=stab"

# Пауза стабілізації на льоту (live)
curl "http://<ip>/api/v1/set?video0.pauseStab=1"   # заморозити (плавно в центр)
curl "http://<ip>/api/v1/set?video0.pauseStab=0"   # відновити
```

::: info Стабілізація не використовує гіроскоп
Стабілізація працює на основі аналізу руху в кадрі (Kalman) і **не використовує IMU**. Колишня EIS на BMI270 (`gyroglide`) видалена у 0.8.0. Сам гіроскоп з v0.39 живить іншу функцію — [оцінку горизонту (attitude)](#attitude-штучний-горизонт-з-imu).
:::

---

### Resilience: стійкість до втрат пакетів

`video0.resilience` обирає профіль стійкості — intra-refresh (rolling GDR-смуга), SVC-T пірамида посилань та довжина GOP виводяться з пресету.

::: danger Зміна resilience потребує REBOOT
Запис `video0.resilience` зберігає значення у `/etc/waybeam.json` і повертає `{"reboot_required": true}`. **Активний пайплайн продовжує працювати зі старим пресетом до наступного запуску камери** — kernel-модуль SigmaStar MI не переживає live-переконфігурацію цих полів (на Star6E це призводить до kernel panic, на Maruko — до зависання демона). Тому застосовується модель «cold-boot».
:::

| Пресет | intra-refresh | refPred | GOP | OSD-safe? |
| :--- | :--- | :--- | :--- | :--- |
| `off` | вимк. | вимк. | користувацький | так |
| `rescue` | вимк. | вимк. | 0.25 с (IDR-спам) | так |
| `quality` | вимк. | вимк. | 4.0 с | так |
| `sprint` | швидкий (150 мс) | вимк. | 0.5 с | так |
| `racing` | швидкий (150 мс) | вимк. | 2.0 с | так |
| `endurance` | збалансований (500 мс) | вимк. | 2.0 с | так |
| `patrol` | збалансований (500 мс) | вимк. | 4.0 с | так |
| `rally` | швидкий (150 мс) | base=1, enhance=1 | 2.0 с | ні — «зелений шлейф» |
| `range` | збалансований (500 мс) | base=1, enhance=4 | 2.0 с | ні — «зелений шлейф» |
| `fpv` | стійкий (1000 мс) | base=1, enhance=4 | 2.0 с | ні — «зелений шлейф» |

```bash
# FPV з OSD-оверлеєм — швидке відновлення смугами, без SVC-T
curl "http://<ip>/api/v1/set?video0.resilience=racing"
# далі перезавантажте камеру, щоб застосувати
```

::: warning OSD та SVC-T
Пресети з `refPred` (`rally`, `range`, `fpv`) можуть лишати стійкий «зелений шлейф» на статичному OSD до наступного IDR. Для польотів з OSD-оверлеєм використовуйте OSD-safe пресети (`racing`, `endurance`, `patrol`). Бюджетуйте +20–30% бітрейту для пресетів з intra-refresh.
:::

---

### ISP Image Quality

<strong>GET /api/v1/iq</strong> — експорт усіх ISP-параметрів:

```bash
curl http://<ip>/api/v1/iq > my_tuning.json
```

<strong>POST /api/v1/iq/import</strong> — імпорт (повний або частковий):

```bash
# Повний імпорт
curl -X POST -H "Content-Type: application/json" \
  -d @my_tuning.json http://<ip>/api/v1/iq/import

# Частковий імпорт — тільки конкретні параметри
echo '{"lightness":{"value":75},"demosaic":{"fields":{"dir_thrd":30}}}' | \
  curl -X POST -H "Content-Type: application/json" -d @- http://<ip>/api/v1/iq/import
```

<strong>GET /api/v1/iq/set?param=value</strong> — зміна окремого ISP-параметра (dot-notation):

```bash
# Встановити одне поле
curl "http://<ip>/api/v1/iq/set?colortrans.y_ofst=200"

# Встановити масив (через кому)
curl "http://<ip>/api/v1/iq/set?colortrans.matrix=23,45,9,1005,987,56,56,977,1015"
```

---

### Приклади типових сценаріїв

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

<strong>Увімкнення стабілізації</strong>

```bash
# framing — restart-поле; задавайте першим, потім тонке налаштування
curl "http://<ip>/api/v1/set?video0.framing=stab"
curl "http://<ip>/api/v1/set?video0.stabKalmanR=6"
```

---

### Рекомендовані налаштування за сценарієм

<strong>FPV-рейсінг (мінімальна затримка)</strong>

```json
{
  "video0": {"rcMode":"cbr", "fps":90, "size":"1280x720", "bitrate":6144, "gopSize":0.5, "resilience":"racing"},
  "fpv": {"roiEnabled":true, "roiQp":-12, "roiSteps":2, "roiCenter":0.35},
  "outgoing": {"streamMode":"rtp", "server":"unix://wfb_tx"}
}
```

<strong>FPV-фрістайл (якість + запис)</strong>

```json
{
  "video0": {"rcMode":"cbr", "fps":60, "size":"1920x1080", "bitrate":8192, "gopSize":1.0},
  "fpv": {"roiEnabled":true, "roiQp":-18, "roiSteps":3, "roiCenter":0.4},
  "record": {"enabled":true, "mode":"dual", "bitrate":20000, "fps":120},
  "outgoing": {"streamMode":"rtp", "server":"unix://wfb_tx"}
}
```

<strong>Далекий зв'язок (long range)</strong>

```json
{
  "video0": {"rcMode":"cbr", "fps":30, "size":"1280x720", "bitrate":3072, "gopSize":2.0, "resilience":"range"},
  "fpv": {"roiEnabled":false},
  "outgoing": {"streamMode":"rtp", "server":"unix://wfb_tx"}
}
```

::: tip resilience у конфізі
`resilience` застосовується при холодному старті, тому в конфізі він спрацьовує одразу. Через API він потребує перезавантаження камери.
:::

---

### Наступні кроки

- [**Огляд Waybeam**](/software/waybeam-venc) — повний список можливостей
- [**Встановлення на камеру**](/software/waybeam-venc-install-camera) — початкове встановлення
- [**Інтеграція з WFB-ng**](/software/waybeam-venc-install-groundstation) — налаштування зв'язки з WFB
