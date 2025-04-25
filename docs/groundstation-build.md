#  Наземна станція: як зібрати Радху самостійно

> Ми говоримо про Радху — то виглядає все приблизно так:

<img src="/images/radxa.jpg" alt="Radxa Board" width="500px"/>
<br/>
<img src="/images/radxa-pin.png" alt="Radxa Pinout" width="500px"/>

Компоненти для Radxa Zero 3W Ground Station

- **[Radxa Zero 3W](https://shop.allnetchina.cn/collections/rock-3/products/copy-of-radxa-zero-3w?variant=48051150717244)** (2 GB, без eMMC, з header)
- **Wi‑Fi карти (2 шт.)**
  - [RTL8812AU](https://vi.aliexpress.com/item/1005006845799671.html?spm=a2g0o.detail.pcDetailTopMoreOtherSeller.4.39a5JzpRJzpRR6&gps-id=pcDetailTopMoreOtherSeller&scm=1007.40000.327270.0&scm_id=1007.40000.327270.0&scm-url=1007.40000.327270.0&pvid=c35349de-3fbe-430e-901e-1a4e47fbe353&_t=gps-id%3ApcDetailTopMoreOtherSeller%2Cscm-url%3A1007.40000.327270.0%2Cpvid%3Ac35349de-3fbe-430e-901e-1a4e47fbe353%2Ctpp_buckets%3A668%232846%238115%232000&pdp_npi=4%40dis%21USD%2110.26%216.98%21%21%2110.26%216.98%21%40210385a817302099432804513e8da5%2112000038495776113%21rec%21UA%21135267971%21XZ&utparam-url=scene%3ApcDetailTopMoreOtherSeller%7Cquery_from%3A&gatewayAdapt=glo2vnm): компактні, дешеві, працюють на 3.3 V, до 40 MHz
  - [RTL8812EU2](https://vi.aliexpress.com/item/1005006869601109.html?spm=a2g0o.order_list.order_list_main.162.400d1802RMwysw&gatewayAdapt=glo2vnm): потужніші, потребують USB‑hub та 5 V живлення
- **BEC (понижуючі перетворювачі)**: 5 V і 3.3 V регульовані
- **[USB hub](https://www.aliexpress.com/item/1005007935543635.html?spm=a2g0o.order_list.order_list_main.51.57101802yWFN0z)**: для підключення кількох карт
- **Micro-USB → USB‑C кабель**: для HAT
- **[microSD карта](https://www.itbox.ua/ua/product/Karta_pam_yati_Samsung_Misro-SDXC_memory_card_64GB_C10_UHS-I_R130MB_s_Evo_Plus_SD_MB-MC64KA_EU-p1000286/)**: ≥ 64 GB (образ ~1.5 GB + DVR ~1 GB/10 хв)
- **[HDMI‑mini HDMI кабель](https://www.aliexpress.com/item/1005005941468774.html?spm=a2g0o.order_list.order_list_main.23.400d1802RMwysw)** або micro‑HDMI→HDMI адаптер
- **3D‑друк корпусу** (PETG)
- **[Вентилятори 25×25 мм](https://www.aliexpress.com/item/1005006523861888.html?spm=a2g0o.order_list.order_list_main.5.73271802wmRLX6)**
- **[Кнопки/кінцевики](https://gfashop.com.ua/ua/p2137785051-mikropereklyuchatel-kontsevoj-kw10.html?source=merchant_center&gad_source=1&gbraid=0AAAAAocjCkCAn_4-BLOcSztkOgFpdc2ei&gclid=Cj0KCQjw_JzABhC2ARIsAPe3ynrcIj_3JLcHAqjhgLDiVNFJhSfRCweJMoTWnR3XIouE41VMSRKMJRgaAlJaEALw_wcB)** для запису та AP‑режиму
- **XT60 (мама) конектор** для живлення
- **Антени 4 шт.** (2 спрямовані + 2 патчі, LHCP або RHCP)
- **RP‑SMA подовжувачі/перехідники**
 
***Живлення***

Живлення можна подавати двома способами:

- Через **Type-C** (`Pow` на картинці)
- Через **піни на хедері** — подаючи **5V ззаду**, використовуючи дюпон-кабелі

***Збірка***

Трішки пайки не завадить 😉  
Як це робив **Oстап**:

1. Взяв **XT60 коннектор**
2. Від нього розводив живлення на **кожен BEC окремо**

***Схема живлення***

> Спробую накидати схему в міру своїх художніх здібностей:

<img src="/images/shema.png" alt="Схема живлення" width="500px"/>

---

 ***Корпус + USB-хаб:***

 🔸 Вариант 1

> внутрішній всесвіт з [USB-HAT](https://arduino.ua/prod2536-4-h-portovii-usb-hub-hat-dlya-raspberry-pi)

<img src="/images/usb-hat.png" alt="USB HAT" width="500px"/>


***Вариант 2***

- Не потрібні BEC'и для Wi-Fi карток **8812EU2**
- Лише потрібно вивести **USB + живлення** на кожну картку **від USB-хаба**

---

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

***Підключення Wi-Fi карт***

***🟣 8812AU***

<img src="/images/af1.png" alt="8812AU схема" width="500px"/>

***🔵 8812EU2***

<img src="/images/eu2.png" alt="8812EU2 схема" width="500px"/>
