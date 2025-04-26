---
title: Runcam WiFiLink v2 — характеристики та налаштування
description: Інструкція з підключення, налаштування та використання камери Runcam WiFiLink v2 для цифрової FPV-системи.
---
# Runcam WiFiLink 2
<img 
  src="https://raw.githubusercontent.com/OpenIPC/docs/refs/heads/main/src/assets/images/runcam-wifilink-v2-main-photo.png" 
  alt="головна картинка" 
  width="400px" 
/>


## Технічні характеристики
- Датчик зображення: Sony IMX415  
- Кут огляду (FOV): 160°  
- Діапазон живлення: DC 9–22 В (рекомендовано живлення через BEC; безпосереднє живлення від LiPo не рекомендовано)  
- Розмір модуля об’єктива: 19×19 мм (M12), кабель MIPI 130 мм (пропрієтарний)  
- Відстань між отворами кріплення: 25.5×25.5 мм  
- Розмір плати: 30.6×33 мм  
- Вага: 30 г (з вентилятором) / 25 г (без вентилятора)  
- Антени: роз’єм IPEX  
- Потужність PA: 28 dBm (FCC), 20 dBm (CE) / 630 mW (FCC), 100 mW (CE)  
- Wi-Fi чіп: Runcam custom RTL8812EU (5, 10, 20 МГц)  
- UART: 1  
- SoC: SigmaStar SSC338Q  
- Прошивка: `ssc338q_fpv_openipc_urllc_aio_nor.tgz` ([docs.openipc.org](https://docs.openipc.org/hardware/runcam/vtx/runcam-wifilink-v2/))

## Схема розташування

![Схема розташування плати знизу 1](https://raw.githubusercontent.com/OpenIPC/docs/refs/heads/main/src/assets/images/runcam-wifilink-2-motherboard-down-dark.png)
![Схема розташування плати знизу 2](https://raw.githubusercontent.com/OpenIPC/docs/refs/heads/main/src/assets/images/runcam-wifilink-2-motherboard-up-dark.png)

## Базове налаштування

### Необхідні компоненти
- Політний контролер із Betaflight, INAV або Ardupilot  
- Runcam WiFiLink 2 та додаток [PixelPilot](https://github.com/openipc/pixelpilot)  
- Wi-Fi адаптер RTL8812AU (в комплекті з WiFiLink2-G)  
- USB-C OTG-адаптер (в комплекті з WiFiLink2-G)  
- Смартфон на Android 13 або 14 з потужним процесором  
- Інтернет-з’єднання ([docs.openipc.org](https://docs.openipc.org/hardware/runcam/vtx/runcam-wifilink-v2/))

### Підключення обладнання
1. Підключіть антени до VTX.  
2. Під’єднайте 4‑контактний кабель до UART на FC (або припаяйте безпосередньо), подаючи живлення з BEC FC; перевірте GND↔GND, VCC↔VCC.  
3. Вставте відформатовану microSD-карту в слот на нижній частині VTX (коли вентилятор зверху).  
4. Підключіть Ethernet-кабель, що йде в комплекті, до пристрою. ([docs.openipc.org](https://docs.openipc.org/hardware/runcam/vtx/runcam-wifilink-v2/))

### Отримання файлу `gs.key`
1. Вставте порожню, відформатовану microSD-карту в VTX (контакти повернені до плати); за потреби розберіть корпус.  
2. При першому ввімкненні пристрій створить файли `user` та `gs.key`; скопіюйте `gs.key` на ваш VRX (Android, ПК тощо). ([docs.openipc.org](https://docs.openipc.org/hardware/runcam/vtx/runcam-wifilink-v2/))

### Підключення до Android GroundStation
1. Встановіть [PixelPilot](https://github.com/openipc/pixelpilot).  
2. Скопіюйте `gs.key` на Android-пристрій.  
3. Підключіть Wi-Fi адаптер RTL8812AU до Android.  
4. Відкрийте PixelPilot через спливаюче вікно.  
5. Натисніть іконку шестерні і встановіть: Channel – 161; Bandwidth – 20.  
6. Додайте `gs.key`: Gear → WFB-NG → gs.key → виберіть скопійований файл.  
7. Увімкніть VTX.  
8. Якщо відео не з’явиться протягом 30 секунд, перезавантажте PixelPilot; якщо проблема не зникає:  
   - перевірте кришку об’єктива  
   - перевірте `gs.key`  
   - перезапустіть Android та VTX ([docs.openipc.org](https://docs.openipc.org/hardware/runcam/vtx/runcam-wifilink-v2/))

### Функції світлодіодів

| Стан світлодіода               | Значення                             |
|--------------------------------|--------------------------------------|
| Зелений вимкнений              | Аудіо вимкнено                       |
| Зелений увімкнений             | Аудіо увімкнено                      |
| Зелений швидке миготіння       | Оновлення прошивки                   |
| Зелений повільне миготіння     | Записування                          |
| Синій увімкнений               | Запуск                               |
| Синій швидке миготіння         | Помилка Wi-Fi                        |
| Синій та зелений поперемінно   | Увага: перегрів (> 90 °C)            | ([docs.openipc.org](https://docs.openipc.org/hardware/runcam/vtx/runcam-wifilink-v2/))

### Підсумок базового налаштування
Після базового налаштування ви отримаєте сучасну цифрову FPV-систему, але без OSD. Щоб налаштувати OSD, ознайомтеся з [додатковим посібником](../advanced.md). Для інструкцій від виробника див. [офіційну документацію](https://store-m8o52p.mybigcommerce.com) ([docs.openipc.org](https://docs.openipc.org/hardware/runcam/vtx/runcam-wifilink-v2/))