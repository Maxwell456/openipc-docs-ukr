---
title: Radxa Zero 3W — наземна станція OpenIPC (GPIO)
description: Детальний гайд по Radxa Zero 3W для OpenIPC FPV — характеристики RK3566, розпіновка 40-pin GPIO, чому ця плата ідеальна для наземної станції (VRX) та як її зібрати
---
# Radxa Zero 3W

<img src="/images/radxa-zero-3w.webp" alt="Одноплатний комп'ютер Radxa Zero 3W" width="500" height="281"/>

**Radxa Zero 3W** — це компактний одноплатний комп'ютер (SBC) у форм-факторі Raspberry Pi Zero на базі 4-ядерного процесора **Rockchip RK3566**. У світі OpenIPC FPV він став однією з найпопулярніших основ для **наземної станції (VRX)**: малий розмір, вбудований Wi-Fi, відеовихід micro-HDMI і сумісність із образом OpenIPC GS роблять його майже ідеальним "мозком" приймача.

На відміну від простого USB-донгла, Radxa Zero 3W — це повноцінний Linux-комп'ютер: він приймає Wi-Fi-потік з дрона, **декодує відео апаратно** і виводить його на екран або [FPV-окуляри](/hardware/vrx/) з низькою затримкою.

## Характеристики

| Параметр | Значення |
|---|---|
| **Процесор (SoC)** | Rockchip RK3566, 4× ARM Cortex-A55 до 1.6 ГГц |
| **GPU** | Mali-G52 2EE (OpenGL ES 3.2, Vulkan 1.1) |
| **NPU** | 0.8 TOPS |
| **Оперативна пам'ять** | LPDDR4, 1 / 2 / 4 / 8 ГБ (залежно від версії) |
| **Накопичувач** | microSD + опціональний eMMC (0–64 ГБ) |
| **Бездротовий зв'язок** | Wi-Fi 802.11 b/g/n (2.4 ГГц) + Bluetooth 5.0, роз'єм для антени |
| **Відеовихід** | micro HDMI, до 1080p\@60 |
| **USB** | USB 2.0 Type-C (живлення / OTG) + USB 3.0 Type-C (хост) |
| **Розширення** | 40-pin GPIO (сумісний з Raspberry Pi) |
| **Живлення** | USB-C, 5V / 2A |
| **Розміри** | 65 × 30 мм (форм-фактор Pi Zero) |
| **ОС** | Debian, Ubuntu, Android, образ **OpenIPC GS** |

## Чому саме Radxa Zero 3W для наземної станції

- **Малий розмір і вага** — поміщається в кишеню, легко вбудувати в портативну станцію чи окуляри.
- **Апаратне декодування H.265/H.264** на RK3566 — низька затримка навіть на 1080p.
- **Micro-HDMI** — пряме підключення монітора або окулярів без перехідників-USB.
- **40-pin GPIO** як у Raspberry Pi — сумісність з [платою розширення OpenIPC Bonnet](/hardware/vrx/openipcbonnet), кнопками, дисплеями та джойстиками.
- **Готовий образ OpenIPC GS** — не потрібно нічого компілювати, просто запишіть на microSD.
- **Низьке енергоспоживання** — працює від power-bank у полі.

::: tip 3W чи 3E?
**Zero 3W** — з Wi-Fi та Bluetooth (для бездротових сценаріїв). **Zero 3E** — з дротовим Ethernet замість Wi-Fi. Для FPV наземної станції з RTL8812 USB-адаптером підходить **3W**.
:::

## Розпіновка 40-pin GPIO

Radxa Zero 3W має **40-контактний роз'єм, сумісний з Raspberry Pi**. Нумерація та живлення стандартні; функції сигналів забезпечує RK3566.

| Pin | Сигнал | | Pin | Сигнал |
|---:|---|---|---:|---|
| 1 | **3.3V** | | 2 | **5V** |
| 3 | I2C SDA | | 4 | **5V** |
| 5 | I2C SCL | | 6 | **GND** |
| 7 | GPIO | | 8 | UART TX |
| 9 | **GND** | | 10 | UART RX |
| 11 | GPIO | | 12 | I2S / PCM |
| 13 | GPIO | | 14 | **GND** |
| 15 | GPIO | | 16 | GPIO |
| 17 | **3.3V** | | 18 | GPIO |
| 19 | SPI MOSI | | 20 | **GND** |
| 21 | SPI MISO | | 22 | GPIO |
| 23 | SPI SCLK | | 24 | SPI CE0 |
| 25 | **GND** | | 26 | SPI CE1 |
| 27 | USB2 D− * | | 28 | USB2 D+ * |
| 29 | GPIO | | 30 | **GND** |
| 31 | GPIO | | 32 | PWM |
| 33 | PWM | | 34 | **GND** |
| 35 | I2S | | 36 | GPIO |
| 37 | GPIO | | 38 | I2S |
| 39 | **GND** | | 40 | I2S |

::: info Примітки
\* На Radxa Zero 3W контакти **27/28** виведено як додатковий USB 2.0 host (`USB2_HOST2_D−/D+`).
Точне призначення альтернативних функцій кожного піна дивіться в [офіційній схемі Radxa](https://dl.radxa.com/zero3/docs/hw/3w/radxa_zero_3w_v1.12_schematic.pdf).
:::

## Як зібрати наземну станцію

**Що знадобиться:**

- Radxa Zero 3W (рекомендовано від **2 ГБ RAM**)
- microSD-карта (16 ГБ+) з образом **OpenIPC GS**
- Wi-Fi-адаптер **RTL8812AU / RTL8812EU** ([мережеві карти](/hardware/network-cards))
- Дисплей через micro-HDMI **або** FPV-окуляри
- Живлення USB-C (5V / 2A), у полі — power-bank
- *(Опціонально)* [OpenIPC Bonnet](/hardware/vrx/openipcbonnet) — об'єднує живлення 2S–6S, USB-хаб, 2× Wi-Fi, джойстик та IMU в одній платі

Покрокову збірку дивіться у гайді [Збірка Radxa GS своїми руками](/getting-started/groundstation-build).

## Перші кроки

1. Запишіть образ **OpenIPC GS** на microSD-карту (наприклад, через Raspberry Pi Imager або balenaEtcher).
2. Під'єднайте Wi-Fi-адаптер до USB-порту (для дальності — через активний USB-хаб або Bonnet).
3. Під'єднайте дисплей через micro-HDMI.
4. Подайте живлення через USB-C (5V / 2A).
5. Налаштуйте канал та параметри зв'язку згідно з гайдом [Налаштування VRX](/getting-started/groundstation).

::: warning Живлення
Використовуйте якісне джерело 5V/2A. "Слабкий" power-bank спричиняє підвисання та втрату відео під навантаженням.
:::

## Корисні посилання

- [Radxa Zero 3W — офіційна сторінка](https://radxa.com/products/zeros/zero3w/)
- [Офіційна схема (V1.12)](https://dl.radxa.com/zero3/docs/hw/3w/radxa_zero_3w_v1.12_schematic.pdf)
- [Збірка Radxa GS своїми руками](/getting-started/groundstation-build)
- [OpenIPC Bonnet (плата розширення)](/hardware/vrx/openipcbonnet)
- [Мережеві карти для наземної станції](/hardware/network-cards)
