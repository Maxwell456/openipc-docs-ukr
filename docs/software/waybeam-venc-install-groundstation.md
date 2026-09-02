---
title: "Інтеграція Waybeam з WFB-ng"
description: "Інтеграція Waybeam з WFB-ng замість Majestic: архітектура, налаштування камери (VTX) і наземної станції, аудіо, адаптивний контроль та запис на SD-картку."
---

# Інтеграція Waybeam з WFB-ng

Ця інструкція описує, як повністю замінити **Majestic** на **Waybeam** у зв'язці з **WFB-ng** (WiFi Broadcast) для FPV-стрімінгу з мінімальною затримкою. Інструкцію звірено з версією **v0.73.3** (кінець серпня 2026).

---

### Архітектура системи

<FpvLinkDiagram />

---

### Частина 1: Налаштування камери (VTX)

<strong>1.1 Передумови</strong>

Перед початком переконайтеся, що:

- ✅ OpenIPC прошивка встановлена на камері
- ✅ WFB-ng (`wfb_tx`) встановлений та працює
- ✅ WiFi-адаптер (RTL8812EU або RTL8812AU) підключений
- ✅ SSH-доступ до камери наявний

::: info Встановлення Waybeam
Якщо Waybeam ще не встановлений, дивіться [Встановлення Waybeam на камеру](/software/waybeam-venc-install-camera).
:::

<strong>1.2 Зупинити Majestic</strong>

```bash
# Зупинити Majestic
killall majestic 2>/dev/null

# Вимкнути автозапуск (якщо використовується init.d)
chmod -x /etc/init.d/S95majestic 2>/dev/null
```

<strong>1.3 Налаштування Waybeam для WFB-ng</strong>

Головна відмінність від Majestic — **спосіб передачі відео до WFB-ng**.

<strong>Спосіб 1: Unix-сокет (рекомендований)</strong>

Найбільш ефективний метод — передача через абстрактний Unix-сокет. Це зменшує затримку порівняно з UDP, оскільки дані не проходять через мережевий стек ядра.

Відредагуйте `/etc/waybeam.json`:

::: code-group
```json [/etc/waybeam.json]
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
:::

::: tip Назва сокету
Назва `wfb_tx` у `unix://wfb_tx` — це ім'я абстрактного Unix-сокету. Воно повинно збігатися з налаштуванням WFB-ng на стороні передавача. Перевірте конфігурацію WFB-ng щоб упевнитися, що `wfb_tx` слухає цей сокет.
:::

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

::: tip Режим apfpv (WiFi без WFB-ng)
У WiFi-режимі apfpv Waybeam стартує з unconnected UDP (`connectedUdp: false`) і обмежує RTP-payload 1400 байтами — менше фрагментації у WiFi-каналі. Для зв'язки з WFB-ng лишайте `connectedUdp: true`.
:::

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

::: warning SHM та аудіо
`shm://` працює тільки в режимі RTP і не може передавати аудіо через основний канал. Якщо вам потрібне аудіо при `shm://` — встановіть `audioPort > 0` (наприклад, `5601`), аудіо піде на окремий UDP-порт.
:::

<strong>Спосіб 4: Frame-SHM — цілі кадри через спільну пам'ять</strong> <Badge type="tip" text="v0.42+" />

Найновіший транспорт, створений під waybeam-link. Передає **цілі закодовані кадри** через POSIX shared memory, повністю оминаючи RTP-пакетизацію: споживач сам робить framing і FEC **на межах кадрів**, а не пакетів.

```json
{
  "outgoing": {
    "enabled": true,
    "server": "frame-shm://venc_wfb",
    "streamMode": "rtp",
    "maxPayloadSize": 1400,
    "connectedUdp": true,
    "audioPort": 5601,
    "sidecarPort": 5602
  }
}
```

Чому це важливо для радіоканалу: кожен кадр у кільці несе метадані, з яких транспорт може будувати **асиметричний FEC**:

| Прапорець / поле | Що означає |
| :--- | :--- |
| `GDR` (0x02) | у кадрі є смуга rolling intra-refresh |
| `ENHANCE` (0x04) | скидний кадр верхнього шару SVC-T — його втрата коштує рівно один кадр |
| `SALVAGED` (0x08) | зарезервовано для приймача (v0.68.1) |
| `gdr_pos` / `gdr_len` | позиція в циклі intra-refresh і його довжина — можна посилювати FEC саме там, де цикл добігає кінця |

Кільце — SPSC lock-free, 8 слотів × 384 KiB (~3 МіБ). Один слот = один access unit, навіть якщо всередині кілька слайсів. Геометрію споживач читає із заголовка кільця, тож змінювати його самому не треба.

::: danger Заголовок кільця має версію 2 — перезбирайте наземну частину
У **v0.69.0** заголовок frame-shm-кільця став **версії 2**: зміщення 88 змінило сенс (було `throttle_permille`, де здоровим було `1000`; стало `low_water_slots`, де здоровим є `<= 1` — полярність інвертована). `sizeof` лишився 192 і нічого до зміщення 88 не зсунулось, але це **навмисний жорсткий розрив версії**: кожен споживач перевіряє `version` і **відмовляється підключатись** при розбіжності, замість мовчки читати поле неправильно.

Producer v2 **не обслуговує consumer v1**. `waybeam-link`, `waybeam-hub` і `radeon-vrx` треба перезбирати разом із камерою.
:::

::: warning Живе перенацілення для SHM не працює
`apply_server` відхиляє SHM-виходи: змінити `outgoing.server` на `frame-shm://` (чи назад) можна лише з рестартом. Це стосується і `shm://`.
:::

---

<strong>1.4 Налаштування WFB-ng на камері</strong>

Конфігурація WFB-ng повинна відповідати способу передачі, який ви обрали у Waybeam.

**Для Unix-сокету** — в конфігурації `wfb_tx` вкажіть той самий абстрактний сокет:

```
# У конфігурації wfb_tx
# Вхідний потік — з Unix-сокету від waybeam
peer = listen://unix://wfb_tx
```

**Для UDP на localhost:**

```
# У конфігурації wfb_tx
# Вхідний потік — UDP від waybeam
peer = listen://udp://127.0.0.1:5600
```

<strong>1.5 Оптимальні параметри відео для WFB-ng</strong>

Рекомендовані параметри для стабільного FPV-стрімінгу через WiFi Broadcast:

```json
{
  "video0": {
    "rcMode": "cbr",
    "fps": 60,
    "size": "1920x1080",
    "bitrate": 8192,
    "gopSize": 1.0,
    "qpDelta": -4,
    "resilience": "racing"
  }
}
```

**Пояснення параметрів:**

| Параметр | Рекомендація | Чому |
| :--- | :--- | :--- |
| `rcMode: "cbr"` | CBR | Стабільний бітрейт — краще для радіоканалу |
| `fps: 60` | 60 fps | Баланс між плавністю і навантаженням |
| `bitrate: 8192` | 8 Мбіт/с | Оптимально для 20 МГц каналу WFB |
| `gopSize: 1.0` | 1 секунда | Швидке відновлення (діє лише коли `resilience: "off"`) |
| `resilience: "racing"` | Intra-refresh | Відновлення смугами без очікування IDR (потребує reboot) |

::: details Для версій до v0.19 — поле `frameLost`
У старих версіях тут додатково рекомендувалося `"frameLost": true` — SDK-стратегія, що дозволяла енкодеру пропускати кадри при перевантаженні. У **v0.19** її прибрано повністю: поля більше не існує, натомість діє нижня межа бітрейту **1000 kbps**. Якщо ключ лишився у вашому конфізі — видаліть його.
:::

::: info Кодек завжди H.265
Waybeam кодує тільки H.265 (HEVC) — поля `video0.codec` немає. Переконайтеся, що приймач налаштований на H.265.
:::

::: warning resilience потребує reboot
Зміна `video0.resilience` через API повертає `{"reboot_required": true}` і застосовується лише після перезавантаження камери. У файлі конфігурації він спрацьовує одразу при старті. Деталі — у розділі [Веб-панель та HTTP API](/software/waybeam-venc-web-interface#resilience-стійкість-до-втрат-пакетів).
:::

::: warning Бітрейт і ширина каналу
Підбирайте бітрейт відповідно до пропускної здатності WFB-ng:

| Ширина каналу | MCS | Макс. бітрейт | Рекомендовано |
| :--- | :--- | :--- | :--- |
| 20 МГц | MCS 3 | ~20 Мбіт/с | 8–12 Мбіт/с |
| 20 МГц | MCS 1 | ~10 Мбіт/с | 4–6 Мбіт/с |
| 40 МГц | MCS 3 | ~40 Мбіт/с | 16–22 Мбіт/с |

Бюджетуйте +20–30% бітрейту при увімкненому intra-refresh (`resilience` ≠ `off`).
:::

---

<strong>1.6 Порядок запуску сервісів</strong>

Правильний порядок запуску на камері:

```bash
# 1. Завантажити WiFi-драйвер
insmod /lib/modules/88XXau.ko 2>/dev/null

# 2. Запустити WFB-ng TX
wfb_tx -u unix://wfb_tx -p 0 -k 8 -n 12 wlan0 &

# 3. Запустити waybeam
waybeam &
```

::: tip Init-скрипт
Для автоматичного запуску створіть init-скрипт як описано у [Встановлення на камеру — Крок 7](/software/waybeam-venc-install-camera#крок-7-автозапуск-waybeam). Переконайтеся, що порядок номерів скриптів правильний: WiFi → WFB-ng → waybeam.
:::

---

### Частина 2: Налаштування наземної станції (GS)

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

### Частина 3: Аудіо через WFB-ng

Waybeam підтримує передачу аудіо паралельно з відео. Підтримувані кодеки: `opus`, `g711a`, `g711u`, `pcm`.

#### 3.1 Увімкнення аудіо на камері

Оновіть `/etc/waybeam.json`:

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

::: info Аудіо та Unix-сокет
При використанні `unix://` та `audioPort: 0` аудіо передається разом з відео через той самий канал. При `audioPort > 0` аудіо відправляється на окремий UDP-порт `127.0.0.1:<audioPort>`. Від'ємний `audioPort` (наприклад, `-1`) — режим «лише запис»: звук пише у файл на SD, але в ефір не йде. Параметри `audio.*` (крім `audio.mute`) — restart-required; `audio.mute` змінюється на льоту.
:::

<strong>3.2 Прийом аудіо на наземній станції</strong>

```bash
# Окремий WFB-канал для аудіо
wfb_rx -p 1 -c 127.0.0.1 -u 5601 -k 4 -n 8 wlan0

# Відтворення (G.711a)
ffplay -nodisp -fflags nobuffer -i udp://0.0.0.0:5601
```

::: tip Opus через GStreamer
Для Opus (PT 98, 48 кГц) використовуйте `rtpjitterbuffer` перед `rtpopusdepay`, інакше позачергові UDP-пакети спричиняють клацання:

```bash
gst-launch-1.0 -v \
  udpsrc port=5601 caps="application/x-rtp,media=audio,clock-rate=48000,encoding-name=OPUS,payload=98,channels=1" \
  ! rtpjitterbuffer latency=40 ! rtpopusdepay ! opusdec plc=true \
  ! audioconvert ! audioresample ! autoaudiosink sync=false
```
:::

---

### Частина 4: Адаптивний контроль (просунуте)

<strong>4.1 Scene-Change IDR</strong>

Для покращення відновлення потоку при різких змінах сцени (зліт, маневри):

```bash
# Увімкнути детекцію сцен (тільки Star6E)
curl "http://localhost/api/v1/set?video0.sceneThreshold=150"
curl "http://localhost/api/v1/set?video0.sceneHoldoff=2"
```

- `sceneThreshold: 150` — тригер при ≈1.5x стрибку розміру кадру
- `sceneHoldoff: 2` — мінімальний інтервал між IDR кадрами

::: info Star6E only
Scene-change IDR підтримується лише на Star6E. На Maruko ці поля позначені як непідтримувані у `/api/v1/capabilities`.
:::

<strong>4.2 Sidecar для зовнішнього контролера</strong>

Якщо ви використовуєте зовнішній контролер якості зв'язку (adaptive link):

```bash
curl "http://localhost/api/v1/set?outgoing.sidecarPort=6666"
```

Sidecar надсилає покадрову телеметрію: тайминги encode/send, односторонню затримку, джитер, а при активній детекції сцен — `frame_type`, `complexity`, `scene_change`, `idr_inserted`, `frames_since_idr`.

З **v0.39** sidecar мультипідписний — до 4 одержувачів одночасно (TTL 5 с на слот), тож adaptive-link контролер і HUD можуть слухати телеметрію паралельно, не «викрадаючи» потік один в одного. За увімкненої секції `attitude` до кожного кадру додається трейлер **ATTITUDE** (roll/pitch/yaw для штучного горизонту в HUD) — тільки Star6E; деталі у [довіднику API](/software/waybeam-venc-web-interface#attitude-штучний-горизонт-з-imu).

::: info Трейлер DETECT — рамки об'єктів у телеметрії <Badge type="tip" text="v0.48+" />
Якщо на камері працює [NPU-детектор](/software/waybeam-venc-web-interface#детекція-об-єктів-на-npu), sidecar додає ще один трейлер — **DETECT** (флаг `0x10`, завжди останній): 16-байтовий заголовок (`model_id`, `schema_ver`, кількість, `detect_seq`, довжина payload, вік у мс) плюс TLV-тіло з BOX-записами у нормалізованих u16.

Трейлер чіпляється до **кожного** кадру, поки є підписник — саме щоб рамки пережили втрати в радіоканалі. Шлях відправки sidecar перебудовано навколо 512-байтового датаграмного буфера зі змінними трейлерами, впорядкованими за прапорцями.

`model_id` — це **операторський конфіг** (`detect.modelId`), а не щось виведене автоматично: плагін вантажить той `.img`, який названо в `detect.modelPath`, і без явного id одноклясова SAR-модель представлялась як VisDrone-10, підписуючи кожну рамку словом «pedestrian».
:::

::: tip Sidecar більше не платить за телеметрію IDR-ами
Раніше кожен запис `video0.bitrate` чи `qpDelta` від adaptive-link контролера просив IDR. З **v0.69.0** вони цього не роблять (Star6E і Maruko). Практичний ефект для наземної станції подвійний: запис бітрейту більше не «з'їдає» спільний 100-мілісекундний шлюз IDR — тож справжній `RECOVERY_REQUEST`, що приходить у це вікно, більше не ковтається; і `/api/v1/idr/stats` більше не рахує неіснуючі IDR.

Точку відновлення тепер треба просити **явно**: `/request/idr` (канал 0) або `/api/v1/dual/idr` (канал 1).
:::

---

### Частина 5: Запис на SD-картку

Waybeam підтримує одночасний стрімінг та запис:

```bash
# Увімкнути запис через API
curl "http://localhost/api/v1/record/start"

# Перевірити статус
curl "http://localhost/api/v1/record/status"

# Зупинити запис
curl "http://localhost/api/v1/record/stop"
```

::: tip Запис через HTTP працює на всіх трьох чіпах <Badge type="tip" text="виправлено" />
Твердження «HTTP-керування записом лише на Star6E, Maruko повертає `501`» було **застарілим** — Maruko опитує ті самі прапорці старту/зупинки, відколи зареєстрував відповідну можливість. У контракті **0.22.0** це виправлено. CV610 отримав запис у **v0.70.0**, у режимі `record.mode: "mirror"`.

З **v0.70.0** запис виконується у **власному потоці**: раніше кожен бекенд викликав рекордер прямо з циклу кодування, і `write()` на SD-карту стопорив живе відео. Тоді ж полагоджено ротацію за `maxSeconds`/`maxMB` на GDR-крафті — вона була інертною, бо GDR-потік не має природних IDR, а тепер ротація сама просить IRAP.
:::

::: warning Gemini (`dual`) — не на CV610
Режими `record.mode: "dual"` / `"dual-stream"` потребують другого VENC-каналу, якого на CV610 немає: запит відхиляється з попередженням, а не пише мовчки канал 0. `/api/v1/dual/set` — теж лише Star6E (на Maruko `501`: шлях запису `MI_VENC_*ChnAttr` прив'язаний до `i6_venc_chn`, тоді як бібліотека Maruko очікує `i6c_venc_chn` з іншим layout).
:::

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

::: info
Формат MPEG-TS не потребує фіналізації файлу. Навіть у разі раптового знеструмлення запис залишається придатним для читання до останнього записаного пакета. Файли ротуються на межах IDR за часом (`maxSeconds`) або розміром (`maxMB`).

З **v0.17.1** другий VENC-канал створюється одразу при `record.mode: "dual"` / `"dual-stream"` (а не лише при `record.enabled: true`), і бітрейт запису на SD повністю незалежний від ефірного.
:::

---

### Перевірка інтеграції

Після налаштування виконайте перевірку:

```bash
# 1. На камері — перевірити, що waybeam стрімить
curl http://localhost/api/v1/config | grep -A5 outgoing

# 2. На камері — перевірити стан транспорту (заповнення, втрати)
curl http://localhost/api/v1/transport/status

# 3. На наземній станції — перевірити прийом
ffplay -fflags nobuffer -i udp://0.0.0.0:5600

# 4. Запитати IDR-кейфрейм для початку декодування
curl http://192.168.1.10/request/idr
```

---

### Порівняння: Waybeam + WFB-ng vs Majestic + WFB-ng

| Аспект | Waybeam + WFB-ng | Majestic + WFB-ng |
| :--- | :--- | :--- |
| **Затримка** | Нижча (Unix-сокет / SHM) | UDP через мережевий стек |
| **API** | Реалтаймова зміна полів | Обмежений набір |
| **Стійкість до втрат** | Resilience-пресети (intra-refresh + SVC-T) | Базова |
| **Запис** | Gemini-режим (стрім + запис) | Базовий |
| **ISP-тюнінг** | 62 параметри + export/import | Обмежений |
| **Стабілізація / зум** | Kalman-стабілізація (обидва чіпи) + цифровий зум | Немає |
| **Веб-панель** | Вбудована з повним керуванням | — |
| **Сирці** | Відкриті (MIT) | Закриті |

---

### Наступні кроки

- [**Веб-панель та HTTP API**](/software/waybeam-venc-web-interface) — керування через браузер
- [**Огляд Waybeam**](/software/waybeam-venc) — всі можливості
- [**Встановлення на камеру**](/software/waybeam-venc-install-camera) — початкове встановлення
