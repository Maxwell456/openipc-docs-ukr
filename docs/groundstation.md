---
title: Інструкція з налаштування VRX Runcam WifiLink
description: Покрокова інструкція налаштування VRX Runcam WifiLink підключення, WebUI, канали, DVR та моніторинг RSSI
---

# Інструкція по налаштуванню VRX

## Runcam WifiLink Receiver

<div style="text-align: center;">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/BP7Ns7H9wvI?si=sUkZiTPDYfQbjkLS" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

1. Підключіть живлення **DC 9–30V** та кабель **miniHDMI-to-HDMI** до окулярів або шолома.
2. За допомогою **HID-джойстика** можна налаштувати канал зв’язку (за замовчуванням `161 → 5.8 GHz`).
3. Підключіть живлення до дрона та відеоприймача (VRX). За замовчуванням і дрон, і VRX налаштовані на канал `161` та роздільну здатність `1920×1080` — зображення зʼявиться протягом **10 секунд**.

<br>

💡 ***На цьому все! Можна літати на цифрі від OpenIPC.***

---

## Додаткові налаштування VRX Runcam

### 1. Вхід у WebUI

Щоб змінити роздільну здатність VRX (FullHD або HD), необхідно увійти в режим **AP Mode (Wi-Fi точка доступу)**:  
утримуйте джойстик на VRX до появи надпису **"AP mode ON"** на екрані.

📶 Зʼявиться Wi-Fi мережа: `RadxaGroundStation`  
🔑 Пароль: `radxaopenipc`

Після підключення перейдіть у браузері за адресою:

http://radxa-zero3.local/


> У WebUI ви зможете:  
> • змінити канали зв’язку  
> • завантажити або переглянути DVR  
> • налаштувати Adaptive Link  
> • обрати роздільну здатність  
> • переглянути графік RSSI

---

### 2. Основні функції WebUI

<img src="/images/homegs.png" alt="alink" width="1000px"/>

- **DVR**
- **Налаштування VRX**
- **Налаштування камери**
- **RSSI графік** *(працює, коли є зʼєднання між VRX та Air Unit)*

---

### 3. Налаштування роздільної здатності

Перейдіть до **Groundstation Editor → Screen-mode → Edit**  
Встановіть роздільну здатність, наприклад: `1280×720` — вона має **збігатися з налаштуваннями Air Unit**.

<img src="/images/gs-edit.png" alt="alink" width="1000px"/>

---

### 4. Налаштування каналу зв’язку

Перейдіть до **Groundstation Editor → wifibroadcast.cfg → Edit**  
Встановіть інший канал зв’язку на вибір (наприклад: `140`, `64`, тощо) —  
**він має збігатися з каналом на Air Unit**.

<img src="/images/gs-channel.png" alt="alink" width="1000px"/>

#### 📡 Таблиця каналів зв’язку 5.8 GHz (20 MHz)

<table style="width:100%; border-collapse: collapse; margin: 15px 0;">
  <thead>
    <tr>
      <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">№ каналу</th>
      <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Частота (MHz)</th>
      <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Примітка</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">36</td><td style="padding: 8px; border: 1px solid #ddd;">5180</td><td style="padding: 8px; border: 1px solid #ddd;">Wi-Fi</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">40</td><td style="padding: 8px; border: 1px solid #ddd;">5200</td><td style="padding: 8px; border: 1px solid #ddd;">Wi-Fi</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">44</td><td style="padding: 8px; border: 1px solid #ddd;">5220</td><td style="padding: 8px; border: 1px solid #ddd;">Wi-Fi</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">48</td><td style="padding: 8px; border: 1px solid #ddd;">5240</td><td style="padding: 8px; border: 1px solid #ddd;">Wi-Fi</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">52</td><td style="padding: 8px; border: 1px solid #ddd;">5260</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">56</td><td style="padding: 8px; border: 1px solid #ddd;">5280</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">60</td><td style="padding: 8px; border: 1px solid #ddd;">5300</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">64</td><td style="padding: 8px; border: 1px solid #ddd;">5320</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">100</td><td style="padding: 8px; border: 1px solid #ddd;">5500</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">104</td><td style="padding: 8px; border: 1px solid #ddd;">5520</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">108</td><td style="padding: 8px; border: 1px solid #ddd;">5540</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">112</td><td style="padding: 8px; border: 1px solid #ddd;">5560</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">116</td><td style="padding: 8px; border: 1px solid #ddd;">5580</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">120</td><td style="padding: 8px; border: 1px solid #ddd;">5600</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">124</td><td style="padding: 8px; border: 1px solid #ddd;">5620</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">128</td><td style="padding: 8px; border: 1px solid #ddd;">5640</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">132</td><td style="padding: 8px; border: 1px solid #ddd;">5660</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">136</td><td style="padding: 8px; border: 1px solid #ddd;">5680</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">140</td><td style="padding: 8px; border: 1px solid #ddd;">5700</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">144</td><td style="padding: 8px; border: 1px solid #ddd;">5720</td><td style="padding: 8px; border: 1px solid #ddd;">DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">149</td><td style="padding: 8px; border: 1px solid #ddd;">5745</td><td style="padding: 8px; border: 1px solid #ddd;">Без DFS (зазвичай дозволено)</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">153</td><td style="padding: 8px; border: 1px solid #ddd;">5765</td><td style="padding: 8px; border: 1px solid #ddd;">Без DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">157</td><td style="padding: 8px; border: 1px solid #ddd;">5785</td><td style="padding: 8px; border: 1px solid #ddd;">Без DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">161</td><td style="padding: 8px; border: 1px solid #ddd;">5805</td><td style="padding: 8px; border: 1px solid #ddd;">Найпопулярніший</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">165</td><td style="padding: 8px; border: 1px solid #ddd;">5825</td><td style="padding: 8px; border: 1px solid #ddd;">Без DFS</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">169</td><td style="padding: 8px; border: 1px solid #ddd;">5845</td><td style="padding: 8px; border: 1px solid #ddd;"><em>Нестандартний</em></td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">173</td><td style="padding: 8px; border: 1px solid #ddd;">5865</td><td style="padding: 8px; border: 1px solid #ddd;"><em>Нестандартний</em></td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">177</td><td style="padding: 8px; border: 1px solid #ddd;">5885</td><td style="padding: 8px; border: 1px solid #ddd;"><em>Нестандартний</em></td></tr>
  </tbody>
</table>


> **❗ Що таке DFS (Dynamic Frequency Selection):**  
> Це технологія, яка дозволяє Wi-Fi або FPV-пристроям працювати на частотах, що можуть перетинатися з військовими чи метеорологічними радарами.  
> Якщо пристрій виявляє активність радара — він автоматично змінює канал.

---

### 5. Налаштування камери (Air Unit)

Перейдіть до:  
**Camera Settings → Load Current Config**

- Зачекайте, поки завантажаться параметри з камери  
- Внесіть зміни  
- Збережіть  
- Виконайте перезавантаження **Majestic**

<img src="/images/gs-majestic.png" alt="alink" width="1000px"/>
<img src="/images/gs-majestic1.png" alt="alink" width="1000px"/>

---

### 6. RSSI графік

Графік **RSSI** дозволяє в реальному часі оцінити силу сигналу, якість зв’язку, а також перевірити ефективність розміщення антен і стабільність лінку.

<img src="/images/gs-rssi.png" alt="alink" width="1000px"/>

### 7. DVR 

Скачати або видалити запис вашого польоту

<img src="/images/dvr.png" alt="alink" width="1000px"/>

### 8. Підключення Radxa до домашньої мережі

 **Необхідні програми**

1. Win32 Disk Imager  
2. SD Memory Card Formatter  
3. PuTTY (SSH)  
4. WinSCP (FTP)  

 **Початкове налаштування Radxa**

1. Запишіть образ Radxa (версія 1.9.9) на microSD через Win32 Disk Imager.
2. Вставте карту, підключіть клавіатуру, монітор, вимкніть живлення Wi‑Fi карт(⚠️обов'язково).
3. Увімкніть, зайдіть через SSH (root/root).
4. `nmtui` → підключіться до домашнього Wi‑Fi → перезавантажте.
5. (Опційно) AP‑режим → radxa-zero3.local → Web UI.

<img src="/images/multiconf.png" alt="alink" width="800px"/><br>
**Налаштування камери (Runcam WiFiLink v1/v2)**

 1. Підключіть мережевий кабель до роутера або ПК (IP 192.168.1.10).
 2. Відкрийте OpenIPC Configurator → Connect → виберіть камеру.
 3. **Camera**:  - Роздільна здатність (1920×1080 або 1280×720) -> Бітрейт (наприклад 12 228 kbps; з Alink – авто)
 4. **Telemetry**: увімкнути UART0 + Mavlink → рестарт
 5. **Firmware**: оновлення прошивки → Update
 6. **Advanced**: увімкнути Alink → перегляд логів