---
title: Камери SSC338Q + IMX415
description: Технічні характеристики IP-камери на базі SigmaStar SSC338Q з сенсором Sony IMX415
---
<img 
  src="/images/ssc338q.png" 
  alt="головна картинка" 
  width="400px" 
/>
<h3>Характеристики камери SSC338Q + IMX415</h3>

| Параметр                   | Значення                                      |
|---------------------------|-----------------------------------------------|
| **Процесор (SoC)**        | SigmaStar SSC338Q                             |
| **Сенсор**                | Sony IMX415, 1/2.8" 8 Мп                      |
| **Роздільна здатність**   | До 3840×2160 (4K UHD)                         |
| **Кодування відео**       | H.265 / H.264                                 |
| **Фреймрейт**             | До 30 кадрів/сек при 4K                      |
| **ІЧ-фільтр**             | Механічний IR-Cut (ICR)                       |
| **Інтерфейси**            | Ethernet 100 Mbps, USB 2.0 (підтримка Wi-Fi)  |
| **Аудіо**                 | Мікрофон або лінійний вхід (в залежності від версії) |
| **RTSP-потік**            | rtsp://<ip>:554/av0_0                         |
| **Живлення**              | DC 12V або POE (опціонально)                 |
| **Підтримка Wi-Fi**       | Через зовнішній USB Wi-Fi модуль (наприклад AUF1, EU2) |
| **Підтримка OpenIPC**     | Так                                           |
| **Підтримка IQTool**      | Так                                           |
| **Протоколи**             | RTSP, ONVIF, HTTP, SSH                        |
| **Форм-фактор**           | Модульна плата (без корпуса)                 |

<h3>Розпинування</h3>
<img 
  src="/images/ssc338q-1.png" 
  alt="головна картинка" 
  width="400px" 
/>

<h3>Як прошити FPV прошивкою?</h3>

1. Нас цікавлять піни RJ45, GND та 12V
2. Підключаємо до камери RJ45 + Ethrenet кабель до роутера або ноутбуку + подаємо DC живлення 12V
!!! danger "УВАГА!"
    Живлення камери працює від 12V
3. За адресою 192.168.0.123  - 123456, стандартне доступ до камери та веб інтерфейс як стандарт камера для спостереження.
4. Нас цікавить Uart RX + TX + GND (знайдіть на картинці) 
!!! warning "Увага"
    Коли підпаяєтесь до UART, залийте гарячим клеєм їх разом із проводами — це ахіллесова п’ята цієї камери.

 Використовуємо інструкцію [прошивки за допомогою  UART](/firmware/uart-flashing/)  

 Наступний крок, після прошивки ssc338q - ultimate - 16M. Ми можемо сміливо прошивати за допомогою [Мультиконфигуратора](https://github.com/OpenIPC/openipc-configurator/releases) 

<h3> <b>Як прошити SCC338Q за допомогою файлів прошивки та SCP</b></h3>

1. Спочатку йдемо сюди  - [https://github.com/OpenIPC/builder/releases/tag/latest](https://github.com/OpenIPC/builder/releases/tag/latest)   
2. Далі знаходимо необхідний для нашої камери прошивку  в нашому випадку маємо їх кілька  
[openipc.ssc338q-nand-fpv.tgz](https://github.com/OpenIPC/builder/releases/download/latest/openipc.ssc338q-nand-fpv.tgz)  
[openipc.ssc338q-nor-fpv.tgz](https://github.com/OpenIPC/builder/releases/download/latest/openipc.ssc338q-nor-fpv.tgz)  
![ssc338q](/images/ssc338q-3.png)
3. Розархівуємо на ПК та за допомогою WinSCP завантажуэмо в камеру в розділ ```/tmp/```
4. Виконуємо наступні команди по 1 команді:  
```soc=$(fw_printenv -n soc)```   
```sysupgrade --kernel=/mnt/mmcblk0p1/uImage.${soc} --rootfs=/mnt/mmcblk0p1/rootfs.squashfs.${soc} --force_ver -z```
!!! warning "Увага"
    Не вимикайте живлення в процесі прошивки!

5. Далі встановлюємл в U-boot для автоматичного оновлення прошивки командою    
```fw_setenv upgrade_url https://github.com/OpenIPC/builder/releases/download/latest/ssc338q_fpv_openipc-urllc-aio-nor.tgz```
6. Та перевевіряємо білд та посилання що воно встановлено.   
```fw_printenv upgrade```  
```grep -e BUILD_OPTION /etc/os-release```
