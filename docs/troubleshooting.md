## Як прошити Runcam VRX за допомогою SD картки

<div style="text-align: center;">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/jAmCpTOFpfY?si=P_2oop5EI2jQZ8eb" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

Це коротка інструкція як прошити RunCam VRX за допомогою SD-карту.

***Крок 1:*** Завантажте файл образу прошивки - <a href="https://github.com/OpenIPC/sbc-groundstations/releases/download/zero3w-v1.9.9/radxa_1-9-9_emmc_flasher.img.xz" target="_blank">Завантажити з GitHub</a> 

***Крок 2:*** Запишіть образ на SD-карту

- Розпакуйте архів з образом.
- Використовуйте програму <a href="https://sourceforge.net/projects/win32diskimager/" target="_blank">Win32 Disk Imager</a>, щоб записати образ на SD-карту.

***Крок 3:*** Вставте карту памʼяті у RunCam VRX

- Вставте підготовлену SD-карту в слот на пристрої.
- Підключіть акумулятор до VRX.

***Крок 4:*** Активуйте прошивку

- Нахиліть **один раз кнопку "20/40 МГц"** на джойстику в праву сторону.

***Крок 5:*** Завершення

- Дочекайтесь завершення прошивки (індикатор зупиниться або пристрій перезавантажиться).
- Відʼєднайте акумулятор.
- Вийміть SD-карту.

> ⚠️ Увага: Не вимикайте живлення під час прошивки!

## Як відновити Runcam VRX після невдалої прошивки

У разі, якщо внаслідок невдалої прошивки памʼять VRX (eMMC) була повністю стерта, пристрій не зможе завантажитися навіть до командного рядка. Проте не хвилюйтеся — за допомогою цієї інструкції ви легко зможете відновити або "розблокувати" свій VRX.

 ***Крок 1: Підготуйте прошивку***

- Переконайтесь, що у вас є правильний образ прошивки для вашого пристрою (Ruby або SBC). Це має бути звичайний образ, **НЕ** `emmc_flasher`.
- SBC groundstation - <a href="https://github.com/OpenIPC/sbc-groundstations/releases" target="_blank"><strong>останні релізи</strong></a>

***Крок 2: Завантажте необхідні інструменти***

- Скачайте <a href="https://chipsee.com/docs/PCs/ARM/RK3568/Manuals/Software/Buildroot_Linux_Qt_5_15.html" target="_blank"><strong>RKDevTool</strong></a>
 та драйвер з офіційного сайту Chipsee:
  

***Крок 3: Встановіть драйвер***

- Перед використанням RKDevTool встановіть драйвер для пристрою.

<img src="/images/vrx-runcam.png" alt="alink" width="600px"/><br>

***Крок 4: Налаштування RKDevTool***

1. Відкрийте конфігураційний файл у папці `RKDevTool_Release_v2.93`.
2. Змініть `Selected=1` на `Selected=2`, щоб перемкнути інтерфейс на англійську мову.

<img src="/images/vrx-runcam1.png" alt="alink" width="500px"/><br>

3. У вікні програми клацніть правою кнопкою миші та оберіть "Clear items", щоб очистити список.

<img src="/images/vrx-runcam2.png" alt="alink" width="600px"/><br>

***Крок 5: Додайте завантажувач (loader)***

1. Переконайтесь, що ім’я файлу — `loader`.<br>

<img src="/images/vrx-runcam3.png" alt="alink" width="600px"/>

2. Завантажте <a href="https://dl.radxa.com/rock3/images/loader/rock-3a/" target="_blank"><strong>файл bin</strong></a> завантажувача з офіційного сайту Radxa.
   

<img src="/images/vrx-runcam4.png" alt="alink" width="600px"/>

3. Клацніть правою кнопкою миші в програмі та оберіть "Add item", щоб додати файл завантажувача.

<img src="/images/vrx-runcam5.png" alt="alink" width="600px"/>


***Крок 6: Додайте образ прошивки***

1. Вкажіть шлях до вашого образу прошивки.
2. Двічі клацніть по полю `storage` і оберіть `EMMC`.
3. Переконайтесь, що обидва пункти мають позначки, а параметр "write by address" активований.

<img src="/images/vrx-runcam6.png" alt="alink" width="600px"/>

***Крок 7: Переключіть VRX у режим завантажувача***

1. Знизу пристрою, поряд з HDMI-портом, знайдіть маленьку кнопку.
2. Утримуйте її за допомогою голки або скрепки.
3. Підключіть живлення до VRX, зачекайте 2 секунди і відпустіть кнопку.
4. Підключіть VRX до ПК через порт USB Type-C. Програма має розпізнати пристрій.

<img src="/images/vrx-runcam7.png" alt="alink" width="600px"/>

***Крок 8: Запустіть прошивку***

1. Натисніть кнопку "Run" в RKDevTool.
2. Дочекайтесь завершення процесу. Після успішного завершення зʼявиться повідомлення **Download complete**.

<img src="/images/vrx-runcam8.png" alt="alink" width="600px"/>

***Крок 9: Завершення***

1. Вимкніть живлення та відʼєднайте VRX від ПК.
2. Увімкніть пристрій. VRX має завантажитись у звичайному режимі.


