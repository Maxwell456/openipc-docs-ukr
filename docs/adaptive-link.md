---
title: Встановлення Adaptive-Link OpenIPC
description: Детальна інструкція з налаштування Adaptive-Link
---

##  Що таке Adaptive-Link?

**Adaptive-Link** — це система, яка **автоматично перемикає якість відео та зв’язку** між дроном і наземною станцією залежно від сили сигналу.

> Коли ви близько — відео чітке й плавне.  
> Коли далеко — якість зменшується, але зв’язок залишається стабільним.

!!! note "Інфо"
    Тобто, як раніше вручну виставляти потужність більше не потрібно!

---

<h2>Як це працює?</h2>

**Adaptive-Link** автоматично контролює:

- Bitrate
- Потужність передавача
- Параметри MCS, SNR, RSSI
- FEC та QoS залежно від відстані та умов

---

##  Встановлення Adaptive-Link на Radxa GS

1. Образ v1.9.9 або новіший → відключити живлення Wi-Fi карток.  
2. Перезавантажити Radxa і зайти як `radxa/radxa` або `root/root`.  
3. Виконати `nmtui` — підключитися до домашнього Wi-Fi.  
4. SSH → виконати:
```
sudo curl -L -o alink_install.sh https://raw.githubusercontent.com/OpenIPC/adaptive-link/refs/heads/main/alink_install.sh
sudo chmod +x alink_install.sh
sudo ./alink_install.sh gs remove
sudo ./alink_install.sh gs install
```
Чекати завершення оновлення. Перезавнтажити VRX.

---

##  Встановлення Adaptive-Link на камери Runcam Wifi Link V1/V2

1. Завантажити **[Мультиконфігуратор](https://github.com/OpenIPC/openipc-configurator)**  
2. Розпакувати в папку та запустити.  
3. Підключитися до камери `192.168.1.10` (пароль `12345`).  
4. Натиснути **Connect** (синій — камера пінгується), після конекта визначається тип камери, сенсор та Wi-Fi карта.  
5. Перейти в **Firmware → Runcam → Wifilink → fpv** і натиснути **Update**.  
6. Після оновлення:<br>
Відкрити Telemetry → увімкнути UART0, додати Mavlink<br>
Увімкнути Alink Drone → Enable<br>

Після конекту між камерой та радхою ви маєте побачити ось таке віконце <br>
<img src="/images/alink_window.png" alt="" width="400px"/><br>
!!! warning "Увага!"
    Якщо його немає — `adaptive_link` НЕ працює.

Редагування на Air Unit файл конфигурацій нас цікавить тільки кілька значень.
```
 /etc/alink.conf
``` 
Тут виставляємо що для нас важливіше RSSI чи SNR
```
snr
rssi_weight=0,5
snr_weight=0,5
osd_level=5
```
Тут ми якщо хочемо інформацію приховати від alinka (бітрейт, завантаження ЦП та іншу інформацію) або що не так багато займала використовуємо від 0 - 5 ліній інформації

---

<h2>Примусове включення Adaptive Link</h2>

1. Відкрити WinSCP.  
2. Підключитися до камери через FTP/SSH.  
3. Відкрити `/etc/rc.local` та вставити перед `exit`:
  > 
  alink_drone &
   
4. Для розгону CPU (опціонально): відкрити `/etc/rc.local` і додати:
   >
   echo performance > /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
   echo 1200000 > /sys/devices/system/cpu/cpu0/cpufreq/policy0/scaling_min_freq
   echo 1200000 > /sys/devices/system/cpu/cpu0/cpufreq/policy0/scaling_max_freq
   
!!! warning " Зверни увагу!"
    **Увага:** деякі камери можуть нестабільно працювати з розгоном — протестуйте на стенді!



---


<h2>Безпечні TX‑профілі </h2>
txprofile для мережевих карток - [тут](https://github.com/OpenIPC/adaptive-link/tree/main/txprofiles) (*назва завжди повинна бути - txprofile.conf* )

Приклад безпечного TX‑профілю

```text
# <ra - nge> <gi> <mcs> <fecK> <fecN> <bitrate> <gop> <Pwr> <roiQP> <bandwidth> <qpDelta>
999 - 999   long 0 8 12 1999 10 30 0,0,0,0 20 -12
1000 - 1050 long 0 8 12 2000 10 30 0,0,0,0 20 -12
1051 - 1500 long 1 8 12 4000 10 25 0,0,0,0 20 -12
1501 - 1950 long 2 8 12 8000 10 20 12,6,6,12 20 -12
1951 - 2001 short 2 8 12 9000 10 20 12,6,6,12 20 -12
```
---

<h2>Параметри TX-файлу</h2>

- **range** — діапазон для адаптивної передачі.  
- **gi** — захисний інтервал.  
- **mcs** — схема модуляції та кодування.  
- **fecK** — кількість інформаційних символів у FEC.  
- **fecN** — загальна кількість символів у FEC.  
- **bitrate** — швидкість передачі даних (біт/с).  
- **gop** — інтервал між ключовими кадрами.  
- **Pwr** — рівень потужності передавача.  
- **roiQP** — квантовування для зони інтересу.  
- **bandwidth** — пропускна здатність каналу.  
- **qpDelta** — коригувальна різниця для QP.

---