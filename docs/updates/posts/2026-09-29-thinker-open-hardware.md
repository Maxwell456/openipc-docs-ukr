---
title: Відкрите залізо OpenIPC Thinker — схеми та Gerber для Thinker338Q і Thinker378
sidebarTitle: Схеми та Gerber Thinker
date: 2026-09-29
description: Розробник OpenIPC Thinker виклав схеми, Gerber-файли та 3D-моделі плат Thinker338Q (SSC338Q) і Thinker378 (SSC378QE). Розбираємо, що є в репозиторіях, чого бракує, і де на AliExpress шукати ключові компоненти для самостійного складання air unit.
tags:
  - OpenIPC
  - Thinker
  - SSC338Q
  - SSC378QE
  - open hardware
  - Gerber
  - DIY
  - AliExpress
---

# Відкрите залізо OpenIPC Thinker: схеми та Gerber для Thinker338Q і Thinker378

Якщо ви мріяли зібрати **air unit OpenIPC власноруч** — тепер така можливість є. Розробник плат Thinker опублікував схеми та файли для виробництва друкованих плат:

- [**KennyPlus/Thinker338Q**](https://github.com/KennyPlus/Thinker338Q) — плата на **SigmaStar SSC338Q**, та сама, що в серійному [OpenIPC Thinker Air Unit](/hardware/vtx/thinkerairunit)
- [**KennyPlus/Thinker378**](https://github.com/KennyPlus/Thinker378) — нова плата на **SigmaStar SSC378QE** (Infinity6C), яку вже підтримує [Waybeam](/software/waybeam-venc)

---

### 🔹 Завантажити файли

Усі файли з репозиторіїв можна завантажити прямо з нашого сайту:

| Файл | Thinker338Q | Thinker378 |
| --- | --- | --- |
| 📄 Схема | [PDF, 151 КБ](/downloads/thinker/thinker338q-schematic.pdf) | [PDF, 151 КБ](/downloads/thinker/thinker378-schematic.pdf) |
| 📦 Gerber + свердлівка | [ZIP, 2 МБ](/downloads/thinker/thinker338q-gerber.zip) | [ZIP, 96 КБ](/downloads/thinker/thinker378-gerber.zip) |
| 🔝 Плата, верх | [PDF](/downloads/thinker/thinker338q-top.pdf) | [PDF](/downloads/thinker/thinker378-top.pdf) |
| 🔙 Плата, низ | [PDF](/downloads/thinker/thinker338q-bottom.pdf) | [PDF](/downloads/thinker/thinker378-bottom.pdf) |
| 🧊 3D-модель (STEP) | [ZIP, 1,6 МБ](/downloads/thinker/thinker338q-3d-step.zip) | [ZIP, 1,4 МБ](/downloads/thinker/thinker378-3d-step.zip) |
| Шарів PCB | 6 | 6 |

STEP-модель зручна, щоб змоделювати корпус чи кріплення під свою раму ще до замовлення плат. Оригінали — у репозиторіях автора [Thinker338Q](https://github.com/KennyPlus/Thinker338Q) і [Thinker378](https://github.com/KennyPlus/Thinker378); якщо автор оновить ревізію плати, звіряйтеся з ними.

::: warning Чого в репозиторіях немає
Немає **BOM** (переліку компонентів), **pick-and-place** файлу та редагованих CAD-проєктів — лише PDF, Gerber і STEP. Тобто перелік деталей доведеться складати самостійно зі схеми, а замовити «плату під ключ» зі складанням на JLCPCB/PCBWay одним кліком не вийде. Ліцензію автор також поки не вказав.
:::

---

### 🔹 Ключові компоненти (за схемами)

Нижче — основні мікросхеми та роз'єми, які ми виписали зі схем. Це **не повний BOM**: пасивні компоненти (резистори, конденсатори, феритові бусини, кварци 24 МГц і 32,768 кГц) дивіться в PDF. Для частини позицій наведено конкретні лоти, для решти — пошук на AliExpress. Перед покупкою звіряйте повне маркування та корпус із даташитом і схемою.

| Компонент | Призначення | Thinker338Q | Thinker378 | Де шукати |
| --- | --- | :-: | :-: | --- |
| **SigmaStar SSC338Q** | SoC (DDR у корпусі) | ✅ | — | [AliExpress](https://s.click.aliexpress.com/e/_c4mR4sL7) |
| **SigmaStar SSC378QE** | SoC (DDR у корпусі). За посиланням — модуль камери IMX415 + SSC378QE: з нього можна зняти чип або взяти камеру IMX415 | — | ✅ | [AliExpress](https://s.click.aliexpress.com/e/_c4XcJzoZ) |
| **W25Q128JVPIQ** | SPI NOR-флеш 16 МБ під прошивку | ✅ | ✅ | [AliExpress](https://s.click.aliexpress.com/e/_c3O7yjNb) |
| **TPS54335ADRCR** | Понижувальний DC-DC з батареї 2–6S на 5 В (BEC) | ✅ | ✅ | [AliExpress](https://s.click.aliexpress.com/e/_c3QtxZ0D) |
| **SPM4020T-4R7M-LR** | Дросель 4,7 мкГн для BEC | ✅ | ✅ | [AliExpress](https://www.aliexpress.com/w/wholesale-SPM4020T-4R7M.html) |
| **TPS62065DSGR** | DC-DC ядра, DDR та 3,3 В | — | ✅ (3 шт) | [AliExpress](https://s.click.aliexpress.com/e/_c3y99zEN) |
| **IM6001** | DC-DC живлення SoC | ✅ | — | [AliExpress](https://www.aliexpress.com/w/wholesale-IM6001.html) |
| **RS3236** | LDO-стабілізатор | ✅ | ✅ | [AliExpress](https://s.click.aliexpress.com/e/_c2xy0mf7) |
| **BL-M8731BU** ([RTL8731BU](/hardware/net-cards/rtl8731bu)) | Вбудований Wi-Fi — лише для Tiny-версії, в інших — не запаюється | опц. | опц. | [AliExpress](https://www.aliexpress.com/w/wholesale-BL-M8731BU.html) |
| **Hirose DF56C-26S-0.3V(51)** | Роз'єм MIPI-камери, 26 pin | ✅ | ✅ | [AliExpress](https://s.click.aliexpress.com/e/_c2zPIoaD) |
| **JST SM06B-SRSS-TB** | Роз'єми SH 1,0 мм, 6 pin (живлення/UART, Ethernet/UART0) | ✅ | ✅ | [AliExpress](https://www.aliexpress.com/w/wholesale-SM06B-SRSS-TB.html) |
| Слот microSD | Запис відео | ✅ | ✅ | [AliExpress](https://www.aliexpress.com/w/wholesale-micro-SD-card-socket-push-push.html) |

Решту для готового air unit можна взяти з тих самих джерел, що й для заводського Thinker:

- **Камера** — модулі IMX335 / IMX415 з MIPI-шлейфом, див. [сторінку Thinker Air Unit](/hardware/vtx/thinkerairunit#камери)
- **Зовнішня Wi-Fi-карта** (якщо не ставите BL-M8731BU) — [RTL8812AU](/hardware/net-cards/rtl8812au) або [RTL8812EU2](/hardware/net-cards/rtl8812eu)
- **Радіатор** — плата 25×25 мм з кріпленням 20×20 мм, підійде алюмінієвий радіатор під цей формат

---

### 🔹 Як замовити плати

1. Завантажте Gerber-архів і перевірте його у переглядачі (наприклад, у вбудованому переглядачі JLCPCB або PCBWay).
2. Замовляйте **6-шарову** плату. Перевірте мінімальні зазори й діаметри отворів у файлі свердлівки, щоб обрати відповідний тех. процес.
3. SoC у корпусі **QFN з великою кількістю виводів** і з'єднувач DF56C з кроком 0,3 мм без трафарету, паяльної пасти та термоповітряної станції поставити складно — закладайте трафарет у замовлення.
4. Перед подачею живлення від батареї перевірте на короткі замикання шини 5 В, 3,3 В, 1,8 В і живлення ядра, а першу подачу робіть від лабораторного БЖ з обмеженням струму.

::: tip Прошивка
Для SSC338Q підходить звичайна прошивка OpenIPC FPV, як і для заводського Thinker — див. [прошивки камер](/software/firmware) та [оновлення прошивки Thinker](/hardware/vtx/thinkerairunit#оновлення-прошивки). Для SSC378QE дивіться підтримку в [Waybeam](/software/waybeam-venc).
:::

::: info Це самостійне складання
Файли викладені «як є»: автор просить звіряти ревізію плати та вимоги до виробництва перед замовленням. Розпіновка роз'ємів, підключення та охолодження — у [посібнику з Thinker Air Unit](/hardware/vtx/thinkerairunit).
:::
