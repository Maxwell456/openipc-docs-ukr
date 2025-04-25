# Runcam WiFiLink 1
<img src="https://raw.githubusercontent.com/OpenIPC/docs/refs/heads/main/src/assets/images/runcam-wifilink-v1-main-photo.png" alt="головна картинка" width="400px"/>

---

## Технічні характеристики

<table style="width:100%; border-collapse: collapse; margin: 15px 0;">
  <thead>
      <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Характеристика</th>
      <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Значення</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">Сенсор зображення</td>
      <td style="padding: 8px; border: 1px solid #ddd;">IMX415</td>
    </tr>
      <td style="padding: 8px; border: 1px solid #ddd;">Кут огляду</td>
      <td style="padding: 8px; border: 1px solid #ddd;">FOV 160°</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">Діапазон живлення</td>
      <td style="padding: 8px; border: 1px solid #ddd;">DC 9-30V (Рекомендовано БЕЖ блок живлення. Непряме живлення від акумулятора Lipo)</td>
    </tr>
      <td style="padding: 8px; border: 1px solid #ddd;">Розмір модуля об'єктива</td>
      <td style="padding: 8px; border: 1px solid #ddd;">19*19мм/об'єктив M12/кабель MIPI 200/130мм (кабель MIPI є пропрієтарним, якщо пошкодили - зверніться до виробника)</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">Відстань монтажних отворів</td>
      <td style="padding: 8px; border: 1px solid #ddd;">25.5мм*25.5мм</td>
    </tr>
      <td style="padding: 8px; border: 1px solid #ddd;">Розміри плати</td>
      <td style="padding: 8px; border: 1px solid #ddd;">30мм30мм(338Q) 32мм32мм(WIFI)</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">Вага</td>
      <td style="padding: 8px; border: 1px solid #ddd;">30г</td>
    </tr>
      <td style="padding: 8px; border: 1px solid #ddd;">Антени</td>
      <td style="padding: 8px; border: 1px solid #ddd;">IPEX роз'єм</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">PA</td>
      <td style="padding: 8px; border: 1px solid #ddd;">29дБм (800 мВт)</td>
    </tr>
      <td style="padding: 8px; border: 1px solid #ddd;">WiFi чіп</td>
      <td style="padding: 8px; border: 1px solid #ddd;">BL-M8812EU2 (5МГц, 10МГц, 20МГц)</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">UARTs</td>
      <td style="padding: 8px; border: 1px solid #ddd;">1</td>
    </tr>
      <td style="padding: 8px; border: 1px solid #ddd;">SOC</td>
      <td style="padding: 8px; border: 1px solid #ddd;">SigmaStar SSC338Q</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">Прошивка</td>
      <td style="padding: 8px; border: 1px solid #ddd;">ssc338q_fpv_openipc_urllc_aio_nor.tgz</td>
    </tr>
  </tbody>
</table>


## Розташування плати

**Motherboard (вверх)**

![Розташування плати зверху](/images/wifilinkv1.png)

**Motherboard (вниз)**

![Розташування плати знизу](/images/wifilinkv1-1.png)

---

## Базове налаштування

> Для розширеного налаштування перегляньте [Додаткове налуштування](/advanced/).

### Необхідні компоненти

- Польотний контролер з прошивкою Betaflight, INAV або Ardupilot
- Runcam WiFiLink 1 та додаток [Pixelpilot](https://github.com/Runcam-PixelPilot)
- WiFi-адаптер RTL8812AU (у комплекті з WiFiLink-G)
- USB-C OTG-адаптер (у комплекті з WiFiLink-G)
- Сучасний смартфон з Android 13 або 14 (з потужним процесором для мінімальної затримки)
- Підключення до Інтернету

### Підготовка обладнання

1. Під’єднайте антени до Runcam.
2. Підключіть 4-контактний шлейф до UART на польотному контролері, що призначений для цифрового VTX (див. зображення), або припаяйте безпосередньо до UART на FC. **Увага**: кольори провідників можуть збігатися лише на одному кінці – перевірте, щоб GND було до GND, VCC до VCC тощо.
3. Вставте відформатовану microSD-картку у слот Runcam (розташований знизу під вентилятором).
4. Підключіть комплектний Ethernet-кабель до пристрою.

### Отримання gs.key

1. Вставте порожню, відформатовану microSD-картку в Runcam (контакти до плати). Для цього може знадобитися розібрати корпус.
2. При першому ввімкненні пристрій створить файли `user` та `gs.key`. Вийміть картку та скопіюйте `gs.key` на ваш VRX (Android, ПК тощо).

### Підключення до Android GS

1. Встановіть додаток Pixelpilot.
2. Скопіюйте файл `gs.key` на смартфон.
3. Підключіть WiFi-адаптер RTL8812AU до смартфона.
4. Запустіть Pixelpilot, коли з’явиться спливаюче вікно.
5. Натисніть ⚙️ (шестерня) та встановіть:
   - **Channel**: 161
   - **Bandwidth**: 20
6. Виберіть WFB-NG → **gs.key** та оберіть скопійований файл.
7. Увімкніть VTX.

**Якщо зображення не з’являється протягом 30 с:**
- Перезапустіть Pixelpilot
- Перевірте захисну кришку об’єктива
- Перевірте файл `gs.key`
- Перезапустіть смартфон та VTX

### Коротке підсумування

Після базового налаштування ви отримаєте доступ до доступної цифрової FPV-системи. OSD відображається за замовчуванням на AIR Unit – для налаштування OSD на VRX перегляньте [Налаштування OSD](/osd/). Якщо потрібна офіційна інструкція виробника, дивіться [документацію Runcam](https://store-m8o52p.mybigcommerce.com/product_images/img_runcam_wifilink/runcam-wifilink-manual-en.pdf).

