---
title: Waybeam — велике оновлення документації та нові можливості
date: 2026-06-12
description: Оновлення Waybeam — перейменування з venc, H.265-only кодек, resilience-пресети проти втрат пакетів, нова Kalman-стабілізація замість GyroGlide, snapshot-канал та нові HTTP-ендпоінти.
tags:
  - waybeam
  - FPV encoder
  - OpenIPC
  - SigmaStar
  - WFB-ng
  - resilience
  - H.265
---

# Waybeam — велике оновлення документації та нові можливості

З моменту [першого анонсу](/updates/posts/2026-04-16-waybeam-venc) проєкт суттєво змінився. Документацію Waybeam актуалізовано під поточний реліз — нижче головне, що варто знати власникам камер на SigmaStar.

---

### 🔹 Перейменування: `venc` → `waybeam`

Сам застосунок, бінарник, файл конфігурації та init-скрипт тепер називаються **`waybeam`**:

- конфіг — `/etc/waybeam.json` (раніше `/etc/venc.json`)
- бінарник — `/usr/bin/waybeam`
- релізи поставляються тарболами `waybeam-star6e.tar.gz` / `waybeam-maruko.tar.gz` (бінарник + шаблон конфігу + бібліотеки)

Стара назва `venc` лишилася тільки в адресі репозиторію `waybeam_venc`.

---

### 🔹 Кодек — лише H.265 (HEVC)

Підтримку H.264 **прибрано**. Кодек жорстко зафіксований на H.265, поля `video0.codec` більше немає. Старі конфіги з `"codec": "h264"` чи `"h265"` завантажуються без помилок, але ключ ігнорується. Переконайтеся, що приймач (PixelPilot, QGroundControl, ffplay, GStreamer) налаштований на H.265.

---

### 🔹 Resilience-пресети — стійкість до втрат пакетів

Один перемикач `video0.resilience` обирає профіль стійкості: intra-refresh (rolling GDR-смуга), SVC-T пірамида посилань та довжина GOP виводяться з пресету. Доступні `racing`, `endurance`, `patrol`, `fpv`, `range`, `sprint`, `rescue`, `quality` та інші.

::: warning Потребує перезавантаження
Зміна `resilience` через API повертає `{"reboot_required": true}` і застосовується лише після перезавантаження камери (kernel-модуль SigmaStar MI не переживає live-зміни цих полів). У файлі конфігурації пресет спрацьовує одразу при старті.
:::

---

### 🔹 Нова стабілізація замість GyroGlide

Гіроскопну EIS (`GyroGlide`, секція `eis`) **видалено у 0.8.0**. Замість неї — стабілізація на основі Kalman-фільтра через поле `video0.framing`:

- `stab` / `stab-fill` — стабілізація (тільки Star6E), **без потреби в IMU**
- `zoom-1.25x` … `zoom-4x` — цифровий зум з live-панорамуванням (обидва чіпи)

Драйвер BMI270 лишився, але як POC-споживач для телеметрії/sidecar.

---

### 🔹 Інші зміни

- **Snapshot-канал** — окремий MJPEG-кадр через `/api/v1/snapshot.jpg`
- **Нові HTTP-ендпоінти**: `/api/v1/modes`, `/api/v1/idr/stats`, `/api/v1/transport/status`, `/api/v1/audio/status`
- **Спрощено конфіг**: прибрано `sensor.unlock*` та `isp.exposure`; `isp.legacyAe` замінено на `isp.aeEngine` (`sdk` / `custom`); додано `isp.keepAspect`
- **Maruko**: HTTP-керування записом недоступне (запис лише через конфіг); деякі функції (стабілізація, scene-IDR, формат `hevc`) — тільки Star6E

---

### 🔹 Оновлена документація

- [**Огляд Waybeam**](/software/waybeam-venc) — всі можливості та порівняння з Majestic
- [**Встановлення на камеру**](/software/waybeam-venc-install-camera) — тарбол, конфіг `/etc/waybeam.json`, перший запуск
- [**Інтеграція з WFB-ng**](/software/waybeam-venc-install-groundstation) — заміна Majestic, наземна станція
- [**Веб-панель та HTTP API**](/software/waybeam-venc-web-interface) — framing, resilience, всі ендпоінти

> **Репозиторій:** [github.com/OpenIPC/waybeam_venc](https://github.com/OpenIPC/waybeam_venc) — ліцензія MIT, відкритий код.
