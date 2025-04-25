---
title: Mario AIO
description: Інструкція з підключення, налаштування та оновлення модуля OpenIPC Mario AIO для FPV.
---

# OpenIPC Mario AIO

<img src="/images/mario.jpg" alt="" width="400px"/><

**OpenIPC Mario AIO** — це компактний модуль для цифрової FPV-системи, який поєднує в собі камеру, передавач (VTX) та систему на чипі (SoC). Він розроблений для використання в дронах та інших FPV-проєктах, забезпечуючи високу якість зображення та низьку затримку передачі відео.

---

### Основні характеристики

<table style="width:100%; border-collapse: collapse; margin: 15px 0;">
  <thead>
    <tr>
      <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Характеристика</th>
      <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Значення</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">Розмір плати</td>
      <td style="padding: 8px; border: 1px solid #ddd;">30×32 мм</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">Монтажні отвори</td>
      <td style="padding: 8px; border: 1px solid #ddd;">4× M2</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">Отвори радіатора</td>
      <td style="padding: 8px; border: 1px solid #ddd;">20×20 мм</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">Живлення</td>
      <td style="padding: 8px; border: 1px solid #ddd;">2S–6S LiPo</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">Вихідна потужність BEC (RF)</td>
      <td style="padding: 8px; border: 1px solid #ddd;">5V до 3A</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">Вихідна потужність BEC (MSIC)</td>
      <td style="padding: 8px; border: 1px solid #ddd;">5V до 2A</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">Інтерфейси</td>
      <td style="padding: 8px; border: 1px solid #ddd;">UART, USB, Ethernet</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">Підтримка SD-карти</td>
      <td style="padding: 8px; border: 1px solid #ddd;">Так</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">Охолодження</td>
      <td style="padding: 8px; border: 1px solid #ddd;">Вбудований радіатор та вентилятор</td>
    </tr>
  </tbody>
</table>


<img src="https://github.com/user-attachments/assets/ad675599-61ce-4cec-a9bf-5933d907c53a" alt="" width="600px"/>


---

### Живлення та підключення

- Живлення від акумулятора 2S–6S
- Для низької напруги (2S–3S) рекомендується підключення **4 дротів** живлення через окремий конектор — потрібно більше струму.
- Для напруги 4S і вище можна використовувати стандартне **2-дротове** підключення.
- Для зниження мінімальної напруги живлення до ~5.4 В **можна зняти два резистори** на платі.

---

### Виводи UART та вхід до U-Boot

Для входу в режим завантаження U-Boot (debug mode) використовуйте UART:  
**R0 / T0** — контактні майданчики зверху на платі.

---

### Індикатори LED

- **Червоний мигає** — живлення від батареї увімкнено
- **Червоний постійно** — Ethernet/USB з'єднання
- **Синій блимає** — активний передавач RF
- **Зелений** — TBD (не реалізовано або змінюється)

---

<img src="https://github.com/user-attachments/assets/e10e6671-553f-4840-aacd-16816be0813b" alt="" width="600px"/>

---

### Підключення до польотного контролера

Для підключення Mario AIO до польотного контролера (наприклад, SpeedyBee F405 WING) використовуйте наступні з'єднання:

- **GND** → GND на контролері
- **VCC** → VCC (перевірте відповідність напруги)
- **RX** → TX на контролері
- **TX** → RX на контролері

>⚠️Перед увімкненням живлення переконайтесь у правильності всіх з'єднань.

---

### Налаштування та оновлення прошивки

### Підключення через USB

1. Підключіть Mario AIO до комп'ютера за допомогою USB-кабелю.
2. Якщо пристрій не розпізнається, встановіть драйвер [**corechip-sr9900**](https://github.com/user-attachments/files/16829005/corechip-sr9900-usb20-to-fast-ethernet-adapter-1750095.zip).
3. Налаштуйте мережевий адаптер USB:
   - IP-адреса: `192.168.1.11`
   - Маска підмережі: `255.255.255.0`
4. Підключіться до Mario AIO через SSH:
   - IP-адреса: `192.168.1.10`
   - Логін: `root`
   - Пароль: `12345`

### Оновлення прошивки

1. Завантажте [Multiplatform Configurator](https://github.com/OpenIPC/openipc-configurator/releases/).
2. Firmware - OpenIPC - MarioAIO - натисніть Update.


>⚠️Перед оновленням прошивки рекомендується зробити резервну копію налаштувань.

---

### Налаштування RF

- **Максимальна потужність RF**: 18 dBm
- **Рекомендовані налаштування**:
  - `stbc=1`, `ldpc=1`
  - `mcs` індекс: 1 або 3
  - Бітрейт відео: 4096 / 8192 / 12688


>⚠️Рекомендується обмежити потужність Txpower - 1 при живленні лише через USB.

---

###  Додаткові ресурси

- [OpenIPC Wiki](https://github.com/OpenIPC/wiki)
- [OpenIPC Configurator](https://github.com/OpenIPC/configurator)
- [Відеоогляд Mario AIO](https://www.youtube.com/watch?v=bgfCEThN3Kg)
