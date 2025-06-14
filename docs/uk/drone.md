---
title: Збірка FPV дрону з Runcam WifiLink
description: Покрокова інструкція підключення та налаштування Air Unit Runcam WifiLink v1/v2 для FPV-дрону.
---

# Інструкція по збірці дрону на налаштування

1. Розмістити Air Unit в задній частині дрону для VTX
2. Підключити Air Unit до FC ( роз'єм для DJI ) за допомогую комплектного шлейфу від Runcam WifiLink v1/v2 
3. Підключаємось до FC за допомогою Type-C та заходимо до *Betaflight -> Ports - UART 2 - ON*<br>
**ОБОВ'ЯЗКОВО!** в розділі *Peripherals - VTX (MSP+DisplayPort)* <br><br>
<img src="/images/drone-bf.png" alt="alink" width="1000px"/><br>
>Якщо немаєте конектора на FC то паяємо RX, TX на TX, RX та живлення до ESC напряму, так як камери маюсь внутрішні беки на борту.<br>
4. Беремо кабель Ethernet- RJ45, конектимо Ethernet до ноутбуку або домашнього роутера, другий кінець в AIR Unit
5. Якщо використовуєте роутер, то заходимо до Веб інтерфейсу роутера та дивимось IP нашего Air Unit
6. Завантажуємо на ПК - [Мультиконфігуратор](https://github.com/OpenIPC/openipc-configurator/releases/) 
7. Конектимось до AIR Unit за допомогою IP та пароля 12345 <br><br>
<img src="/images/multiconf.png" alt="alink" width="1000px"/><br>
8. Далі використомуємо TX Power (максимальна 50, мінімальна 1), на стенді не виставляйте 50, бо згорить!
Вмикаємо STBC, LDPC
Виставляэмо MCS 2 -> Зберігаємо.
9. Переходимо до Camera -> Bitrate -> 8192 ->Зберігаємо. Також можете під себе налаштувати роздільну здатність (FullHD, HD) та FPS<br><br>
<img src="/images/multiconf1.png" alt="alink" width="1000px"/>
10. Телеметрію ви налаштовуєте за допомогою Betaflight
11. Для використання нових можливостей або бета-тестів, потрібно прошивати камеру ось тут. <br><br>
<img src="/images/multiconf2.png" alt="alink" width="1000px"/>
12. **Неофіційний конфігуратор** від Mariofpv можно скачати ось [тут](https://github.com/OpenIPC/configurator/releases)