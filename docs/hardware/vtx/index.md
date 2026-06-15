---
title: Камери та VTX для OpenFPV
description: Порівняння підтримуваних FPV-камер і відеопередавачів для OpenIPC — Runcam WiFiLink, Mario AIO, OpenIPC Thinker, EMAX Wyvern Link.
---

# Камери та VTX

Підтримувані камери та відеопередавачі для OpenIPC-системи.

## Порівняльна таблиця

| Модель | Сенсор | SoC | WiFi / потужність | Вага | Для кого |
|---|---|---|---|---|---|
| [Runcam WiFiLink v1](runcamwifilink) | IMX415 | SSC338Q | BL-M8812EU2, до 800 мВт | ~30 г | Універсальний вибір ✅ |
| [Runcam WiFiLink v2](runcamwifilinkv2) | IMX415 | SSC338Q | Вбудований EU2 | ~28 г | Універсальний вибір ✅ |
| [Mario AIO](marioaio) | — | SSC338Q | Вбудований | Легкий | Компактні AIO-збірки |
| [Thinker Air Unit](thinkerairunit) | IMX335 / IMX415¹ | SSC338Q | Base: зовнішній · Tiny: RTL8731BU | — | DIY, гнучка конфігурація |
| [Thinker v1 (з WiFi)](thinkerv1-withwifi) | окремо¹ | SSC338Q | Вбудований 100 мВт | — | TinyWhoop (до ~500 м) |
| [Thinker v1 (без WiFi)](thinkerv1-nowifi) | окремо¹ | SSC338Q | Зовнішній RTL8812EU2 | — | DIY-збірки |
| [EMAX Wyvern Link](emaxwyvernlink) | — | — | Вбудований | Дуже легкий | TinyWhoop, 1S–2S |

¹ Сенсор-модуль (IMX335 / IMX415) купується окремо.

::: tip Не знаєте, що обрати?
Для більшості — **Runcam WiFiLink v1/v2** (готова камера+VTX, IMX415). Для TinyWhoop — легкі **Thinker v1 (з WiFi)** чи **EMAX Wyvern Link**. Для кастомних збірок — модульний **Thinker Air Unit**.
:::

## Прошивки

Всі камери використовують прошивку OpenIPC. Для оновлення — [Multiconfigurator](/configuration/multiconfigurator).
