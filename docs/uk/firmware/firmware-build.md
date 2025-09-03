---
title: "OpenIPC 4G прошивка для QuadroFleet"
description: "Покрокова прошивка камер дронів з клієнтом QuadroFleet та налаштуванням 4G модему"
---

<h3>Підготовка та прошивка OpenIPC Firmware</h3>

Цей посібник пояснює, як скомпілювати та прошити прошивку OpenIPC з клієнтом QuadroFleet Masina для камери дрона (наприклад, SSC30KQ, SSC338Q). Також розглянуто налаштування ECM-інтерфейсу 4G модему.

---

Попередні вимоги

* Система Linux (рекомендовано Ubuntu 22.04+)
* Доступ до Інтернету для завантаження репозиторіїв та інструментів
* TFTP-сервер для прошивки (наприклад, tftpd-hpa на Ubuntu)
* Опційно: програматор CH341A для прямого прошивання

---

<h3>Крок 1: Компіляція OpenIPC Firmware</h3>

Встановлення залежностей:

```bash
sudo apt update
sudo apt install g++-arm-linux-gnueabihf build-essential git
```

Клонування репозиторіїв:

```bash
git clone https://github.com/OpenIPC/firmware.git
git clone -b opt https://github.com/beep-systems/quadrofleet-masina.git
```

Компіляція клієнта Masina:

```bash
cd quadrofleet-masina/client
make clean
make
```

Копіювання файлів клієнта у каталог прошивки:

```bash
cd ..
cp -r quadrofleet-masina/client/drop/* firmware/
```

Компіляція прошивки:

```bash
cd firmware
make
```

* Виберіть цільовий пристрій (SSC30KQ\_4G або SSC338Q\_4G) під час компіляції
* Файли виходу знаходяться в `firmware/output/images` (наприклад, `rootfs.squashfs.ssc30kq`, `uImage.ssc30kq`)

---

<h3>Крок 2: Прошивка через TFTP</h3>

Налаштування TFTP-сервера:

```bash
sudo apt install tftpd-hpa
sudo cp firmware/output/images/* /var/lib/tftpboot/
sudo systemctl restart tftpd-hpa
```

Підключіть камеру до TFTP-сервера через Ethernet та доступ до завантажувача (наприклад, через minicom).

Налаштування змінних середовища (підбирайте розміри файлів):

```bash
setenv serverip 192.168.178.66
setenv kernsize 0x300000
setenv rootaddr 0x350000
setenv rootsize 0xA00000
setenv rootmtd 10240k
setenv bootargs 'console=ttyS0,115200 panic=20 root=/dev/mtdblock3 init=/init mtdparts=NOR_FLASH:256k(boot),64k(env),3072k(kernel),${rootmtd}(rootfs),-(rootfs_data) LX_MEM=${memlx} mma_heap=mma_heap_name0,miu=0,sz=${memsz}'
saveenv
```

Прошивка ядра та rootfs:

```bash
tftp 0x21000000 uImage.ssc30kq
sf probe 0; sf erase 0x50000 0x300000; sf write 0x21000000 0x50000 0x1fdd68
tftp 0x21000000 rootfs.squashfs.ssc30kq
sf probe 0; sf erase 0x350000 0xA00000; sf write 0x21000000 0x350000 0x8ea000
saveenv
reset
```

---

<h3>Крок 3: Альтернативна прошивка з CH341A</h3>

1. Завантажте попередньо скомпільовану прошивку від QuadroFleet.
2. Використайте CH341A програматор та NeoProgrammer 2.2.0.10:

   * Device: GD25Q128x \[3.3V]
   * Type: SPI NOR 25xx
   * BitSize: 128 Mbits
   * Manufact: GIGADEVICE
   * Size: 16777216 Bytes
   * Page: 256 Bytes
3. Прошивка .bin файлу.

---

<h3>Крок 4: Оновлення прошивки (опційно)</h3>

1. Підключіться до камери через Ethernet та доступ до терміналу (SSH або веб-інтерфейс).
2. Завантажте нові файли прошивки:

```bash
cd /tmp
curl -O http://192.168.178.66/rootfs.squashfs.ssc30kq
curl -O http://192.168.178.66/uImage.ssc30kq
```

3. Застосуйте оновлення:

```bash
soc=$(fw_printenv -n soc)
sysupgrade --kernel=/tmp/uImage.${soc} --rootfs=/tmp/rootfs.squashfs.${soc} -z --force_ver -n
```

---

<h3>Крок 5: Налаштування 4G модему (Quectel EC25)</h3>

1. Підключіть модем до ПК через USB.
2. Відкрийте термінал (PuTTY) з налаштуваннями:

```
Baud rate: 115200
Data bits: 8
Stop bits: 1
Parity: None
Flow control: None
```

Активуйте ECM-інтерфейс:

```
AT+QCFG="usbnet",1
AT+CFUN=1,1
```


```text
AT+QCFG="usbnet",1
AT+CFUN=1,1
```
!!! warning "Увага!"
    Дочекайтеся перезавантаження модему та появи мережевого пристрою.

---

<h3>Крок 6: Перевірка прошивки</h3>

* Доступ до веб-інтерфейсу камери (IP за замовчуванням через DHCP).
* Переконайтеся, що QuadroFleet Masina client працює (`ps | grep client`).
* Перевірте VPN-з’єднання та UDP-потік через застосунок керування.

---

!!! info "Примітки"
    - Переконайтеся, що IP TFTP-сервера (192.168.178.66) відповідає вашій мережі.
    - Резервне копіювання налаштувань камери перед прошивкою.