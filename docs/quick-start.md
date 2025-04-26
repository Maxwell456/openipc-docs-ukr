---
title: Швидкий старт з OpenIPC для FPV
description: Що купити для FPV на базі OpenIPC, як швидко налаштувати камеру, VRX та наземну станцію для перших польотів

---

# Швидкий старт

В OpenIPC все дуже швидко змінюється, тому ця документація буде з часом змінюватись:

**Частина 1** – що купити, мінімальні налаштування та літати.<br>
**Частина 2** – для ентузіастів, які люблять тримати паяльник в руках, друкувати на 3D‑принтері та вносити корективи через SSH.

---

## Частина 1: Що купити та літати

VTX (камери та передавачі)

- **[Runcam Wifi Link v1](vtx/runcamwifilink.md)** – IMX415 + SigmaStar SSC338Q, EU2 модуль (за потреби можна замінити на інший)

- **[Runcam Wifi Link v2](vtx/runcamwifilinkv2.md)** – IMX415 + SSC338Q, EU2 модуль вбудований у плату

- **[EMAX Wyvern Link](vtx/emaxwyvernlink.md)** – Доступний на AliExpress, підходить для TinyWhoop

- **[OpenIPC Thinker v1 (без Wi‑Fi)](vtx/thinkerv1-nowifi.md)** – Лише плата, Wi‑Fi карту купувати окремо (наприклад RTL8812EU2)

- **[OpenIPC Thinker v1 (з Wi‑Fi)](vtx/thinkerv1-withwifi.md)** – Вбудований Wi‑Fi передавач 100 mW (підходить лише для TinyWhoop, дальність до ~500 м)


Антени

- Роз’єм UFL: 
[Rush Cherry UFL‑LHCP](https://vi.aliexpress.com/item/4000201021654.html?spm=a2g0o.order_list.order_list_main.52.400d1802RMwysw&gatewayAdapt=glo2vnm)
Компактна антена для 2–3" дронів (2 виходи)
- Поляризація: LHCP → LHCP або RHCP → RHCP

VRX (приймальні станції)

- **[RunCam WiFiLink‑RX Digital HD Receiver](https://shop.runcam.com/runcam-wifilink-rx/)** <br>
Готове рішення: Radxa + 2 EU2 плати <br>
Під’єднується до окулярів або монітора
- **Emax Ground Station**<br>
Тестові варіанти, поки не у продажу
- **[PixelPilot (Android)](https://github.com/OpenIPC/PixelPilot/releases)**<br>
Перетворює смартфон на наземну станцію (Wi‑Fi адаптер RTL8812AU)<br>
Плюси: дешевизна  
Мінуси: затримка ~50–70 ms, залежить від потужності телефону
- **[Radxa Zero 3W Hat](https://store.openipc.org/OpenIPC-Bonnet-v1-0-p738525070)**
  - **[Radxa Zero 3W](https://shop.allnetchina.cn/collections/rock-3/products/copy-of-radxa-zero-3w?variant=48051150717244) + [USB Hub](https://www.aliexpress.com/item/1005007935543635.html?spm=a2g0o.order_list.order_list_main.25.e47318028MlJFF) + [microSD](https://www.itbox.ua/ua/product/Karta_pam_yati_Samsung_Misro-SDXC_memory_card_64GB_C10_UHS-I_R130MB_s_Evo_Plus_SD_MB-MC64KA_EU-p1000286/)** + 2 
  шт мережевих картки ([RTL8812EU2](https://vi.aliexpress.com/item/1005006869601109.html?spm=a2g0o.order_list.order_list_main.162.400d1802RMwysw&gatewayAdapt=glo2vnm) або [RTL8812AU](https://www.aliexpress.com/item/1005006845799671.html?spm=a2g0o.detail.pcDetailTopMoreOtherSeller.4.39a5JzpRJzpRR6&gps-id=pcDetailTopMoreOtherSeller&scm=1007.40000.327270.0&scm_id=1007.40000.327270.0&scm-url=1007.40000.327270.0&pvid=c35349de-3fbe-430e-901e-1a4e47fbe353&_t=gps-id%3ApcDetailTopMoreOtherSeller%2Cscm-url%3A1007.40000.327270.0%2Cpvid%3Ac35349de-3fbe-430e-901e-1a4e47fbe353%2Ctpp_buckets%3A668%232846%238115%232000&pdp_npi=4%40dis%21USD%2110.26%216.98%21%21%2110.26%216.98%21%40210385a817302099432804513e8da5%2112000038495776113%21rec%21UA%21135267971%21XZ&utparam-url=scene%3ApcDetailTopMoreOtherSeller%7Cquery_from%3A&gatewayAdapt=vnm2glo)) + 3D‑друкований корпус

---

## Частина 2: Для ентузіастів своїми руками

 Компоненти для Radxa Zero 3W Ground Station

- **[Radxa Zero 3W](https://shop.allnetchina.cn/collections/rock-3/products/copy-of-radxa-zero-3w?variant=48051150717244)** (2 GB, без eMMC, з header)
- **Wi‑Fi карти (2 шт.)**
  - [RTL8812AU](https://vi.aliexpress.com/item/1005006845799671.html?spm=a2g0o.detail.pcDetailTopMoreOtherSeller.4.39a5JzpRJzpRR6&gps-id=pcDetailTopMoreOtherSeller&scm=1007.40000.327270.0&scm_id=1007.40000.327270.0&scm-url=1007.40000.327270.0&pvid=c35349de-3fbe-430e-901e-1a4e47fbe353&_t=gps-id%3ApcDetailTopMoreOtherSeller%2Cscm-url%3A1007.40000.327270.0%2Cpvid%3Ac35349de-3fbe-430e-901e-1a4e47fbe353%2Ctpp_buckets%3A668%232846%238115%232000&pdp_npi=4%40dis%21USD%2110.26%216.98%21%21%2110.26%216.98%21%40210385a817302099432804513e8da5%2112000038495776113%21rec%21UA%21135267971%21XZ&utparam-url=scene%3ApcDetailTopMoreOtherSeller%7Cquery_from%3A&gatewayAdapt=glo2vnm): компактні, дешеві, працюють на 3.3 V, до 40 MHz
  - [RTL8812EU2](https://vi.aliexpress.com/item/1005006869601109.html?spm=a2g0o.order_list.order_list_main.162.400d1802RMwysw&gatewayAdapt=glo2vnm): потужніші, потребують USB‑hub та 5 V живлення
- **BEC (понижуючі перетворювачі)**: 5 V і 3.3 V регульовані
- **[USB HAT / хаб](https://www.aliexpress.com/item/1005007935543635.html?spm=a2g0o.order_list.order_list_main.51.57101802yWFN0z)**: для підключення кількох карт
- **Micro-USB → USB‑C кабель**: для HAT
- **[microSD карта](https://www.itbox.ua/ua/product/Karta_pam_yati_Samsung_Misro-SDXC_memory_card_64GB_C10_UHS-I_R130MB_s_Evo_Plus_SD_MB-MC64KA_EU-p1000286/)**: ≥ 64 GB (образ ~1.5 GB + DVR ~1 GB/10 хв)
- **[HDMI‑mini HDMI кабель](https://www.aliexpress.com/item/1005005941468774.html?spm=a2g0o.order_list.order_list_main.23.400d1802RMwysw)** або micro‑HDMI→HDMI адаптер
- **3D‑друк корпусу** (PETG)
- **[Вентилятори 25×25 мм](https://www.aliexpress.com/item/1005006523861888.html?spm=a2g0o.order_list.order_list_main.5.73271802wmRLX6)**
- **[Кнопки/кінцевики](https://gfashop.com.ua/ua/p2137785051-mikropereklyuchatel-kontsevoj-kw10.html?source=merchant_center&gad_source=1&gbraid=0AAAAAocjCkCAn_4-BLOcSztkOgFpdc2ei&gclid=Cj0KCQjw_JzABhC2ARIsAPe3ynrcIj_3JLcHAqjhgLDiVNFJhSfRCweJMoTWnR3XIouE41VMSRKMJRgaAlJaEALw_wcB)** для запису та AP‑режиму
- **XT60 (мама) конектор** для живлення
- **Антени 4 шт.** (2 спрямовані + 2 патчі, LHCP або RHCP)
- **RP‑SMA подовжувачі/перехідники**

 **Приклади зібранної наземної станції**

- *Варіант 1*: USB‑HAT + 2×RTL8812AU → 227 g без антен  
  <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
    <img src="/images/vrx_radxa1.png" alt="Варіант 1 — вид спереду" width="400" />
    <img src="/images/vrx_radxa1-1.png" alt="Варіант 1 — вид сбоку" width="400" />
  </div>  
<br>
- *Варіант 2*: USB‑hub + 2×RTL8812EU → 105 g без антен  
  <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
    <img src="/images/vrx_radxa2.png" alt="Варіант 2 — вид спереду" width="400" />
    <img src="/images/vrx_radxa2-2.png" alt="Варіант 2 — вид сбоку" width="400" />
  </div>
3D-модель корпусу можно знайти ось  - [тут](https://www.thingiverse.com/thing:6680584/files)

---





