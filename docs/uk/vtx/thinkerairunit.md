---
title: "FPV OpenIPC Thinker Air Unit"
description: "OpenIPC Thinker: технічні характеристики та встановлення"
---

OpenIPC Thinker — це компактний блок камери та передачі відео, що легко інтегрується з різними RC-пристроями.

Доступні дві версії:

- **Базова** ([Магазин](https://store.openipc.org/OpenIPC-Thinker-v1-0-Base-with-SD-p711054393)) — слот для SD-картки, потребує зовнішнього WiFi-модуля
- **Tiny** ([Магазин](https://store.openipc.org/OpenIPC-Thinker-v1-0-Tiny-with-WiFi-p633445803)) — інтегрований WiFi модуль RTL8731BU[^1], але без SD-картки

>RTL8731BU: 50мВт @ 5G, 125мВт @ 2.4G

![Набір Thinker](https://raw.githubusercontent.com/OpenIPC/docs/refs/heads/main/src/assets/images/aio-thinker/thinker-webshop-photo.jpg)

<h3>Характеристики</h3>

- SoC SSC338Q
- Живлення: 2–6S
- Вбудований BEC на 3A
- MEMS мікрофон
- Інтерфейси:
  - 3x UART
  - 1x MIPI для камери
  - 1x USB для WiFi (5V/3.3V)
  - 1x Ethernet
  - 1x живлення

<h3>Фізичні параметри</h3>

- Розмір плати: 25×25 мм
- Вага:
  - Без радіатора: ~8.8 г
  - З радіатором: ~13.4 г
- Отвори:
  - PCB: 20×20 мм
  - З радіатором: 25.5×25.5 мм
- Охолодження: алюмінієвий радіатор

 <h3>Камери</h3>

**IMX335** ([Магазин](https://store.openipc.org/OpenIPC-IMX335-v2-module-without-cable-p721231276))

- 14×14 мм, алюмінієвий корпус
- Об'єктив: 140°, f/2.8
- Сенсор IMX335 з IMU

**IMX415** ([Магазин](https://store.openipc.org/OpenIPC-IMX415-v2-module-without-cable-p721152215)) — інший сенсор з тим самим залізом

---

<h3>Встановлення обладнання</h3>

Підключення живлення та контролера польоту

1. Знайдіть 6-жильний кабель живлення/UART (JST): чорний, чорний, жовтий, зелений, червоний, червоний
2. Чорні — до мінусу живлення, червоні — до плюсу
3. Зелений → TX, жовтий → RX (на FC)
4. TX до RX, RX до TX
5. Підключіть кабель до роз'єму живлення/UART2 (сторона з радіатором)

Підключення Wi-Fi модуля (лише для базової версії)

1. Tiny версія не потребує цього кроку
2. Використайте USB кабель: червоний (+), синій (D-), жовтий (D+), чорний (GND)
3. Підключіть згідно з розкладкою: GND → GND, червоний → VCC, жовтий → D+, синій → D-

Заміна камери

1. За замовчуванням встановлено IMX335
2. Зніміть радіатор (4 гвинти), обережно
3. Від'єднайте камеру та підключіть нову
4. Поверніть радіатор назад (не видаляйте термопрокладку!)

Ethernet для конфігурації та оновлень

1. Візьміть Ethernet кабель: 6-pin JST ↔ RJ45
2. Підключіть JST до Ethernet/UART0 (сторона без радіатора)
3. Підключіть RJ45 до ПК або маршрутизатора

![Компоненти Thinker](https://raw.githubusercontent.com/OpenIPC/docs/refs/heads/main/src/assets/images/aio-thinker/thinker-connectivity.png)

----


<table style="width:100%; border-collapse: collapse; margin: 15px 0;">
  <thead>
    <tr>
      <th style="padding: 10px; border: 1px solid #ddd;">Секція</th>
      <th style="padding: 10px; border: 1px solid #ddd;">Назва піна</th>
      <th style="padding: 10px; border: 1px solid #ddd;">Напрямок</th>
      <th style="padding: 10px; border: 1px solid #ddd;">Опис</th>
    </tr>
  </thead>
  <tbody>
    <tr><td rowspan="6" style="padding: 8px; border: 1px solid #ddd;"><strong>RJ45 / UART0 Header</strong></td><td style="padding: 8px; border: 1px solid #ddd;">UART0 RX</td><td style="padding: 8px; border: 1px solid #ddd;">Вхід</td><td style="padding: 8px; border: 1px solid #ddd;">Лінія прийому UART0</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">UART0 TX</td><td style="padding: 8px; border: 1px solid #ddd;">Вихід</td><td style="padding: 8px; border: 1px solid #ddd;">Лінія передачі UART0</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">RJ45 TX+</td><td style="padding: 8px; border: 1px solid #ddd;">Вихід</td><td style="padding: 8px; border: 1px solid #ddd;">Ethernet передача TX+</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">RJ45 TX-</td><td style="padding: 8px; border: 1px solid #ddd;">Вихід</td><td style="padding: 8px; border: 1px solid #ddd;">Ethernet передача TX-</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">RJ45 RX+</td><td style="padding: 8px; border: 1px solid #ddd;">Вхід</td><td style="padding: 8px; border: 1px solid #ddd;">Ethernet прийом RX+</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">RJ45 RX-</td><td style="padding: 8px; border: 1px solid #ddd;">Вхід</td><td style="padding: 8px; border: 1px solid #ddd;">Ethernet прийом RX-</td></tr>

    <tr><td rowspan="4" style="padding: 8px; border: 1px solid #ddd;"><strong>USB Header</strong></td><td style="padding: 8px; border: 1px solid #ddd;">Vd</td><td style="padding: 8px; border: 1px solid #ddd;">Вихід</td><td style="padding: 8px; border: 1px solid #ddd;">Живлення для зовнішнього Wi-Fi модуля</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">DM</td><td style="padding: 8px; border: 1px solid #ddd;">Вхід/Вихід</td><td style="padding: 8px; border: 1px solid #ddd;">USB Data− (D−)</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">DP</td><td style="padding: 8px; border: 1px solid #ddd;">Вхід/Вихід</td><td style="padding: 8px; border: 1px solid #ddd;">USB Data+ (D+)</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">GND</td><td style="padding: 8px; border: 1px solid #ddd;">—</td><td style="padding: 8px; border: 1px solid #ddd;">Земля</td></tr>

    <tr><td rowspan="6" style="padding: 8px; border: 1px solid #ddd;"><strong>Power / UART2 Header</strong></td><td style="padding: 8px; border: 1px solid #ddd;">Vcc</td><td style="padding: 8px; border: 1px solid #ddd;">Вхід</td><td style="padding: 8px; border: 1px solid #ddd;">Вхід живлення</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">Vcc (дубль)</td><td style="padding: 8px; border: 1px solid #ddd;">Вхід</td><td style="padding: 8px; border: 1px solid #ddd;">Дублюючий пін живлення (об'єднується)</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">RX</td><td style="padding: 8px; border: 1px solid #ddd;">Вхід</td><td style="padding: 8px; border: 1px solid #ddd;">UART2 прийом (до контролера польоту)</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">TX</td><td style="padding: 8px; border: 1px solid #ddd;">Вихід</td><td style="padding: 8px; border: 1px solid #ddd;">UART2 передача (до контролера польоту)</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">GND</td><td style="padding: 8px; border: 1px solid #ddd;">—</td><td style="padding: 8px; border: 1px solid #ddd;">Земля</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">GND (дубль)</td><td style="padding: 8px; border: 1px solid #ddd;">—</td><td style="padding: 8px; border: 1px solid #ddd;">Дублюючий пін землі (об'єднується)</td></tr>

    <tr><td rowspan="2" style="padding: 8px; border: 1px solid #ddd;"><strong>UART1 (контакти для пайки)</strong></td><td style="padding: 8px; border: 1px solid #ddd;">RX</td><td style="padding: 8px; border: 1px solid #ddd;">Вхід</td><td style="padding: 8px; border: 1px solid #ddd;">UART1 прийом</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">TX</td><td style="padding: 8px; border: 1px solid #ddd;">Вихід</td><td style="padding: 8px; border: 1px solid #ddd;">UART1 передача</td></tr>
  </tbody>
</table>
----
!!! info "Поради"

    - Не подавайте живлення через USB Vd.  
    - Не знімайте термопрокладку з радіатора.  
    - Для Wi-Fi на 3.3V — зніміть резистор вибору напруги.  
    - Модулі з високим споживанням можна живити окремо.


---

<h3>Налаштування програмного забезпечення</h3>

 **Доступ до Web UI**

- DHCP: підключіть до мережі, знайдіть IP на роутері
- Статична IP: 192.168.1.10 (вручну налаштуйте інтерфейс ПК)

> Логін за замовчуванням:
> - Користувач: `root`
> - Пароль: `12345`

<h3>Оновлення прошивки</h3>

- Через Web UI (потрібен інтернет)
- Через [OpenIPC Configurator](https://github.com/OpenIPC/openipc-configurator)

**Прошивки:**

- [Стандартна](https://github.com/OpenIPC/builder/releases/download/latest/ssc338q_fpv_openipc-thinker-aio-nor.tgz)
- [Для RTL8812EU](https://github.com/OpenIPC/builder/releases/download/latest/ssc338q_fpv_openipc-urllc-aio-nor.tgz)

**Додатково**

Використовуйте [OpenIPC Configurator](https://github.com/OpenIPC/openipc-configurator)