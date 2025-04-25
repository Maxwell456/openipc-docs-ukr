---
title: VTX MENU
description: Меню VTX для конфігурації передавача відеосигналу в системі OpenIPC FPV.
---

# VTX MENU

**VTX MENU** — це інтерактивне меню на базі OSD або CLI, що дозволяє конфігурувати параметри відеопередачі (VTX) прямо під час роботи пристрою, без необхідності перепрошивки чи перезавантаження.

---

### Основні можливості

- Вибір каналу (CH)
- Зміна частоти (FREQ)
- Регулювання потужності передавача (TxPower)
- Перемикання ширини каналу (Bandwidth)
- Вибір кодування (LDPC/STBC)
- Активація запису на SD-карту
- Перемикання профілів передачі

---
### Інсталяція VTXMenu  

1. Встановлення VTXMenu за допомогою [Confugurator Mario](https://github.com/OpenIPC/configurator/releases)  

2. Підключаємось до камери  - Telemetry - Latest YML VTXMENU - Enter в командному рядку

<img src="/images/vtxmenu.png" alt="vtxmenu_openipc" width="600px"/>  

 Зберігаємо та перезавантажуємо Ait Unit


---

### Як увійти в меню

 <img src="https://github.com/OpenIPC/msposd/raw/main/pics/vtxmenu.png" alt="" width="600px"/>  
**Через OSD **:  
   - Увімкніть опцію `osd_menu: true` у `majestic.yaml`  
   - Використовуйте стики пульта для переміщення по меню (для підтримуваних систем)

---

### Приклад конфігурації в `majestic.yaml`

```yaml
osd_menu: true
vtxmenu:
  default_power: 1
  default_bandwidth: 20
  default_mcs: 3
  auto_record: true
```

>Меню VTX постійно оновлюється. Перевіряйте актуальну документацію в офіційному репозиторії OpenIPC.
