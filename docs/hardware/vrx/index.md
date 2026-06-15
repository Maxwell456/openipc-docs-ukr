---
title: Приймачі (VRX) для OpenFPV
description: Огляд наземних станцій та приймачів для OpenIPC. RunCam RX, Radxa Zero 3W, PixelPilot.
---

# Приймачі (VRX)

Наземні станції та приймачі для OpenIPC — від готових plug & play рішень до DIY на Radxa Zero 3W.

## Порівняльна таблиця

| Рішення | Платформа | Відеовихід | Затримка | Для кого |
|---|---|---|---|---|
| [RunCam WiFiLink RX](runcam-rx) | OpenIPC / Ruby (готове) | Mini-HDMI 1080p60 | Мінімальна | Plug & Play ✅ |
| [EMAX Wyvern Link VRX](emaxwyvernlink) | Radxa Zero 3W + RTL8812AF1 | micro-HDMI | Низька | Готовий комплект |
| [Radxa Zero 3W (DIY)](radxa-zero-3w) | RK3566 SBC | micro-HDMI | Низька | DIY, апаратне декодування |
| [OpenIPC Bonnet](openipcbonnet) | Плата-розширення для Radxa | HDMI → DP | Низька | Дальнобій (2×RTL8812AU + FEM) |
| PixelPilot (Android) | Смартфон + RTL8812AU | Екран телефону | ~50–70 мс | Найдешевше, завжди з собою |

## Готові рішення

### RunCam WiFiLink‑RX

Готова наземна станція: Radxa + 2×EU2 плати. Підключається до окулярів або монітора через HDMI.

- **Купити:** [shop.runcam.com](https://shop.runcam.com/runcam-wifilink-rx/)
- Мінімальна затримка
- Plug & Play рішення

### PixelPilot (Android)

Перетворює Android смартфон на наземну станцію з WiFi адаптером RTL8812AU.

- **Завантажити:** [GitHub releases](https://github.com/OpenIPC/PixelPilot/releases)
- Затримка: ~50–70 ms (залежить від потужності телефону)
- **Плюси:** дешево, зручно, завжди під рукою
- **Мінуси:** вища затримка, залежить від смартфону

## DIY: Radxa Zero 3W Ground Station

Повноцінна наземна станція своїми руками.

### Компоненти

| Компонент | Посилання | Примітка |
|-----------|-----------|----------|
| Radxa Zero 3W | [allnetchina.cn](https://shop.allnetchina.cn/collections/rock-3/products/copy-of-radxa-zero-3w?variant=48051150717244) | 2 GB, без eMMC, з header |
| RTL8812AU (2 шт) | [AliExpress](https://vi.aliexpress.com/item/1005006845799671.html) | 3.3V, до 40 MHz |
| RTL8812EU2 (2 шт) | [AliExpress](https://vi.aliexpress.com/item/1005006869601109.html) | 5V, потужніші |
| USB HAT/хаб | [AliExpress](https://www.aliexpress.com/item/1005007935543635.html) | Для RTL8812EU2 |
| microSD ≥ 64 GB | Samsung Evo Plus | Образ ~1.5 GB |
| Вентилятори 25×25 мм | [AliExpress](https://www.aliexpress.com/item/1005006523861888.html) | Для охолодження |
| 4 антени | — | 2 спрямовані + 2 патчі |

### Готові варіанти збірки

**Варіант 1:** USB‑HAT + 2×RTL8812AU → **227 г** без антен

**Варіант 2:** USB‑hub + 2×RTL8812EU → **105 г** без антен (компактніший)

**3D-модель корпусу:** [thingiverse.com](https://www.thingiverse.com/thing:6680584/files)
