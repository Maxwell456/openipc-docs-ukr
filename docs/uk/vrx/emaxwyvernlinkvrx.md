---
title: "Emax Wyvern Link VRX"
description: "Сторінка документації Emax Wyvern Link для OpenIPC wiki"
---
<img src="/images/emax_vrx_fatshark.jpg" alt="emax wyvern link vrx" width="600px" />

### Специфікації

<div style="margin: 20px 0;">
  <table class="specs-table">
    <tbody>
      <tr>
        <td class="spec-label">Плата SOC</td>
        <td class="spec-value"><a href="https://radxa.com/products/zeros/zero3w/" class="spec-link">Radxa ZERO 3W</a> з 32GB eMMC</td>
      </tr>
      <tr>
        <td class="spec-label">Чіп WiFi</td>
        <td class="spec-value"><a href="/net-cards/rtl8812au/" class="spec-link">RTL8812AF1</a> (5MHz, 10MHz, 20MHz, 40Mhz)</td>
      </tr>
      <tr>
        <td class="spec-label">Відстань між отворами</td>
        <td class="spec-value">21mm × 21mm (стандарт Fatshark, Skyzone)</td>
      </tr>
      <tr>
        <td class="spec-label">Розмір</td>
        <td class="spec-value">88mm (ширина) × 55.5mm (висота) × 40.5mm (глибина)</td>
      </tr>
      <tr>
        <td class="spec-label">Вага</td>
        <td class="spec-value">101.2g (повний комплект) / 87.7g (з антеною) / 71.6g (без антени)</td>
      </tr>
      <tr>
        <td class="spec-label">Антени</td>
        <td class="spec-value">Роз'єм SMA (комплект: LHCP Omni + Patch)</td>
      </tr>
      <tr>
        <td class="spec-label">Заводська прошивка</td>
        <td class="spec-value">SBC v1.9.6 (v1.9.9?)</td>
      </tr>
      <tr>
        <td class="spec-label">Кабелі в комплекті</td>
        <td class="spec-value">Короткий USB, роздільний Y-кабель живлення, micro-HDMI до mini HDMI</td>
      </tr>
    </tbody>
  </table>
</div>

<style>
  /* Базові стилі таблиці */
  .specs-table {
    width: 100%;
    border-collapse: collapse;
    border-radius: 6px;
    overflow: hidden;
    font-size: 15px;
  }
  
  .specs-table tr {
    transition: background-color 0.2s ease;
  }
  
  .spec-label {
    padding: 14px 20px;
    font-weight: 400;
    width: 35%;
    vertical-align: top;
  }
  
  .spec-value {
    padding: 14px 20px;
  }
  
  /* ТЕМНА ТЕМА */
  [data-md-color-scheme="slate"] .specs-table,
  [data-md-color-scheme="default"][data-md-color-primary="black"] .specs-table {
    background-color: #1e2530;
    border: 1px solid #2d3748;
  }
  
  [data-md-color-scheme="slate"] .specs-table tr,
  [data-md-color-scheme="default"][data-md-color-primary="black"] .specs-table tr {
    border-bottom: 1px solid #2d3748;
  }
  
  [data-md-color-scheme="slate"] .specs-table tr:last-child,
  [data-md-color-scheme="default"][data-md-color-primary="black"] .specs-table tr:last-child {
    border-bottom: none;
  }
  
  [data-md-color-scheme="slate"] .spec-label,
  [data-md-color-scheme="default"][data-md-color-primary="black"] .spec-label {
    color: #8b949e;
    background-color: #1e2530;
  }
  
  [data-md-color-scheme="slate"] .spec-value,
  [data-md-color-scheme="default"][data-md-color-primary="black"] .spec-value {
    color: #c9d1d9;
    background-color: #252d38;
  }
  
  [data-md-color-scheme="slate"] .spec-link,
  [data-md-color-scheme="default"][data-md-color-primary="black"] .spec-link {
    color: #58a6ff;
    text-decoration: none;
  }
  
  [data-md-color-scheme="slate"] .spec-link:hover,
  [data-md-color-scheme="default"][data-md-color-primary="black"] .spec-link:hover {
    text-decoration: underline;
  }
  
  /* СВІТЛА ТЕМА */
  [data-md-color-scheme="default"]:not([data-md-color-primary="black"]) .specs-table {
    background-color: #ffffff;
    border: 1px solid #d0d7de;
  }
  
  [data-md-color-scheme="default"]:not([data-md-color-primary="black"]) .specs-table tr {
    border-bottom: 1px solid #d0d7de;
  }
  
  [data-md-color-scheme="default"]:not([data-md-color-primary="black"]) .specs-table tr:last-child {
    border-bottom: none;
  }
  
  [data-md-color-scheme="default"]:not([data-md-color-primary="black"]) .spec-label {
    color: #57606a;
    background-color: #f6f8fa;
  }
  
  [data-md-color-scheme="default"]:not([data-md-color-primary="black"]) .spec-value {
    color: #24292f;
    background-color: #ffffff;
  }
  
  [data-md-color-scheme="default"]:not([data-md-color-primary="black"]) .spec-link {
    color: #0969da;
    text-decoration: none;
  }
  
  [data-md-color-scheme="default"]:not([data-md-color-primary="black"]) .spec-link:hover {
    text-decoration: underline;
  }
  
  /* Мобільна адаптивність */
  @media (max-width: 768px) {
    .specs-table {
      font-size: 14px;
    }
    
    .spec-label,
    .spec-value {
      display: block;
      width: 100%;
      padding: 10px 16px;
    }
    
    .spec-label {
      padding-bottom: 4px;
      font-size: 13px;
      font-weight: 500;
    }
    
    .spec-value {
      padding-top: 4px;
    }
  }
</style>

<h3>Плати</h3>

RADXA ZERO 3W       

<img src="/images/emax_vrx_radxa_board_front.png" alt="emax wyvern link vrx" width="600px" />

<img src="/images/emax_vrx_radxa_board_back.png" alt="emax wyvern link vrx" width="600px" />

eMMC - Samsung [KLMBG2JETD-B041 32GB](https://semiconductor.samsung.com/estorage/emmc/emmc-5-1/klmbg2jetd-b041/)


Спеціальна плата живлення, WiFi та кнопок Emax      
<img src="/images/emax_vrx_wifi_power_board.png" alt="emax wyvern link vrx" width="600px" />


<h3>Базове налаштування</h3>
Що вам потрібно
 -   Окуляри або портативний монітор з входом HDMI.
 
 -   Батарея 2S-6S з роз'ємом barrel jack або USB павербанк
 

### Налаштування обладнання

 -   Підключіть USB-кабель, що входить в комплект, між внутрішніми платами
     <img src="/images/emax_vrx_usb_cable.png" alt="emax wyvern link vrx" width="600px" />

 -   Підключіть антени до VRX
 
 -   Встановіть кронштейн на окуляри, якщо це Fatshark або Skyzone. Якщо інші окуляри або портативний монітор, надрукуйте на 3D-принтері спеціальний кронштейн або використовуйте липучку чи двосторонню стрічку.
 
 -   Підключіть HDMI-кабель між VRX та окулярами або монітором. VRX Radxa використовує micro-HDMI.
 
 -   (опціонально) Вставте відформатовану карту micro SD у VRX. Слот не має автокорекції, тому вставляйте контактами вгору, коли вентилятор спрямований вгору.      
      <img src="/images/emax_vrx_sdcard_orientation.png" alt="emax wyvern link vrx" width="600px" />
      
<h3>Інтерфейс стандартної прошивки</h3>

Стандартна прошивка на внутрішній eMMC - це [SBC v1.9.9](https://github.com/OpenIPC/sbc-groundstations/releases/tag/zero3w-v1.9.9-rc1) і має просте меню та систему кнопок.
<img src="/images/emax_vrx_buttons_v1.9.png" alt="emax wyvern link vrx" width="600px" />

 - Кнопки вгору та вниз змінюють канал WiFi
 - Бічна стрілка запускає/зупиняє запис DVR
 - Крайня права кнопка "wifi" має дві функції
   - коротке натискання змінює пропускну здатність
   - довге натискання активує точку доступу WiFi (AP). VRX з'явиться у вашій локальній мережі WiFi як SSID: RadxaGroundstation, пароль: radaxaopenipc  
   Веб-інтерфейс наземної станції доступний за адресою http://192.168.4.1/ 
   
<img src="/images/emax_vrx_ap_webui.png" alt="emax wyvern link vrx" width="600px" />

<h3>Як отримати або змінити gs.key з прошивкою v1.9.9</h3>

 -   Вставте порожню відформатовану карту micro SD у VRX.
 -   Коли ви вперше вмикаєте VRX, пристрій створить файл 'user' та файл 'gs.key'.
 -   Підключіть SD-карту до ПК і або замініть файл gs.key, щоб він відповідав вашим VTX, або використовуйте цей gs.key на всіх ваших VTX.
 -   Вставте SD-карту назад у VRX, і при наступному завантаженні він замінить внутрішній gs.key на той, що на SD-карті.


### Підсумок базового налаштування
VRX налаштований зі стандартним gs.key і повинен працювати з VTX RunCam або Emax. Після базового налаштування ви отримаєте найдешевшу сучасну цифрову FPV-систему. Виробник наразі не має жодних інструкцій для обладнання Wyvern Link v2.



## Розширене налаштування

Рекомендується прошити останню прошивку на SD-карту та завантажуватися з SD-карти, щоб отримати найновіші функції. Як тільки з'явиться нова стабільна прошивка для прошивки на внутрішню eMMC, ми оновимо документацію.


<h3>Налаштування SBC 2.0.0 Beta2 для wfb-ng</h3>
Завантажте [SBC 2.0.0 Beta2](https://github.com/OpenIPC/sbc-groundstations/releases/tag/zero3w-v2.0.0-beta2) і прошийте на SD-карту за допомогою [belenaEtcher](https://etcher.balena.io/) або вашої улюбленої утиліти для прошивки. Після прошивки знову підключіть SD-карту до ПК. Основний диск /config буде підключено (можливо, як D:) і дозволить вам редагувати /config/setup.txt та файли GPIO.

Створіть новий файл розкладки кнопок GPIO /config/scripts/GPIO/Emax.yaml або змініть файл /config/scripts/GPIO/Custom.yaml.

Кнопки GPIO відображаються наступним чином      
<img src="/images/emax_vrx_button_GPIO_pins.png" alt="emax wyvern link vrx" width="600px" />

<img src="https://docs.radxa.com/img//rock5b/rock5bp_40pin_power_3.webp" width="350px"/>


Оскільки Emax VRX має лише 4 кнопки, нам потрібно зробити деякий вибір щодо відображення їх функцій для GSMenu. Ось один з можливих варіантів розкладки з крайньою лівою кнопкою як "center" та 2-ю кнопкою як "left". Це дозволяє використовувати клавіатуру GSMenu та всі інші функції GSMenu, оскільки right/center поводяться однаково для більшості меню.
```
gsmenu:
  enabled: true
  gpio:
    # Emax
    left: 32
    center: 38
    up: 18
    down: 16
```
Якщо ви віддаєте перевагу більш традиційному відображенню, це може бути кращим, але воно не має функції center, тому ми не можемо використовувати клавіатуру GSMenu.
```
gsmenu:
  enabled: true
  gpio:
    # Emax
    left: 38
    right: 32
    up: 18
    down: 16
```
Якщо ви віддаєте перевагу думати про кнопки, дивлячись на VRX спереду, а не коли він встановлений на окулярах (ззаду), ви можете змінити порядок кнопок
```
gsmenu:
  enabled: true
  gpio:
    # Emax
    left: 32
    right: 38
    up: 16
    down: 18
```

Після редагування файлу GPIO змініть setup.txt для використання відповідного GPIO. Ось приклад setup.txt при використанні нового файлу Emax.yaml
```
# Встановіть screen_mode на бажаний режим вашого HDMI-дисплея. Формат WxH@fps - Звичайні значення: 1920x1080@60, 1920x1080@120, 1280x720@60, 1280x720@120
[screen mode]
screen_mode = 1920x1080@60

# Встановіть rec-fps на fps, з яким знімає ваша камера. наприклад 60, 90, 120
[dvr recording]
rec_fps = 60

# Встановіть gpio_layout. Допустимі значення: Ruby, Bonnet, Runcam та Custom.
[gpio]
gpio_layout = Emax

# Встановлення osd на "ground" вмикає процес msposd_rockchip на стороні vrx.
[msposd]
osd = air
```
