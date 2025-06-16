# Оновлення прошивки

Ця стаття розповідає про те, як вручну виконати оновлення за допомогою вікна терміналу з використанням команди ```sysupgrade.```

!!! info "**Примітка**" 
    За замовчуванням sysupgrade перезавантажить камеру для завершення оновлення. Якщо ви не хочете цього робити, використовуйте опцію -x (дивіться sysupgrade --help для всіх опцій).

<h3>Оновлення з останнього релізу GitHub</h3>

За замовчуванням запуск sysupgrade спробує завантажити останнє програмне забезпечення для вашої моделі камери з джерел github.

Доступні інші опції, щоб ви могли використовувати локальну копію ядра Linux (uImage) та програмного забезпечення камери (rootfs.squashfs).

Для старої прошивки достатньо запустити sysupgrade без параметрів. Для новішої прошивки потрібно запустити sysupgrade -k -r для оновлення як ядра, так і rootfs.

!!! warning "**УВАГА!**"
     Оновлення прошивки може призвести до "окирпічення" вашої камери. Переконайтеся, що ви готові як морально, так і професійно. Майте готову рятувальну SD-карту та/або UART-адаптер. Будьте готові відпаяти та перепрограмувати флеш-чіп як останній засіб. Не оновлюйте робочі камери, якщо це не є абсолютно необхідним!

<h3>Використання sysupgrade</h3>

Зазвичай запуск sysupgrade дасть вам останній реліз для вашої камери, як описано вище, однак якщо ви хочете повернутися до попереднього образу або завантажити власні оновлення, використовуйте будь-які з опцій, описаних нижче.

Пам'ятайте, що коли ви готові запустити sysupgrade, ви повинні використовувати синтаксис:

```bash
sysupgrade --kernel=/tmp/uImage.${soc} --rootfs=/tmp/rootfs.squashfs.${soc} -z
```

де '${soc}' - це специфічний для вашої камери soc, наприклад gk7205v300, інакше буде завантажений останній реліз з Github.

## Використання TFTP-сервера

<h3>На вашій хост-машині:</h3>

Якщо у вас ще немає запущеного TFTP-сервера на вашій хост-машині, подивіться статтю Wiki "Налаштування TFTP-сервера".

Якщо у вас ще немає образів uImage та rootfs.squashfs для вашої камери, перейдіть на https://github.com/OpenIPC/firmware/releases/tag/latest та завантажте останній пакет прошивки для вашого SoC і витягніть вміст пакету в кореневий каталог вашого TFTP-сервера.

```bash
tar xvf <firmware.tgz>
```

Якщо ви створили власні версії, використовуючи копію репозиторію прошивки, то ваші образи uImage та rootsfs.squashfs будуть у папці output/images. Скопіюйте їх у корінь вашого tftp-сервера.

<h3>На камері:</h3>

Ви можете оновити образи або з сесії терміналу Linux, або з запиту U-Boot, якщо у вас є UART-серійне з'єднання і ви перервали завантаження Linux.

Перевірте, що змінна середовища вашої камери для TFTP-сервера правильна, шукаючи запис serverip при їх перерахуванні за допомогою fw_printenv.

Якщо потрібно оновити, використовуйте команду `fw_setenv serverip <your.tftp.ip.address>`.

<h3>З Linux</h3>

```bash
soc=$(fw_printenv -n soc)
serverip=$(fw_printenv -n serverip)
cd /tmp
busybox tftp -r rootfs.squashfs.${soc} -g ${serverip}
busybox tftp -r uImage.${soc} -g ${serverip}
sysupgrade --kernel=/tmp/uImage.${soc} --rootfs=/tmp/rootfs.squashfs.${soc} -z
```

<h3>З U-Boot</h3>

**Для 8MB образу:**

```bash
tftp ${baseaddr} uImage.${soc}
sf probe 0; sf erase 0x50000 0x200000; sf write ${baseaddr} 0x50000 ${filesize}

tftp ${baseaddr} rootfs.squashfs.${soc}
sf probe 0; sf erase 0x250000 0x500000; sf write ${baseaddr} 0x250000 ${filesize}
```

**Для 16MB образу:**

```bash
tftp ${baseaddr} uImage.${soc}
sf probe 0; sf erase 0x50000 0x200000; sf write ${baseaddr} 0x50000 ${filesize}

tftp ${baseaddr} rootfs.squashfs.${soc}
sf probe 0; sf erase 0x250000 0xA00000; sf write ${baseaddr} 0x250000 ${filesize}
```

Тепер перезапустіть камеру для завантаження нових образів.

## Використання SCP

<h3>На вашій хост-машині:</h3>

Якщо у вас ще немає образів uImage та rootfs.squashfs для вашої камери, перейдіть на [https://github.com/OpenIPC/firmware/releases/tag/latest](https://github.com/OpenIPC/firmware/releases/tag/latest) та завантажте останній пакет прошивки для вашого SoC і витягніть вміст.

```bash
tar xvf <firmware.tgz>
```

Якщо ви створили власні версії, використовуючи копію репозиторію прошивки, то ваші образи uImage та rootsfs.squashfs будуть у папці output/images.

Тепер скопіюйте їх на камеру за допомогою scp.

```bash
scp uImage* rootfs* root@<yourcameraip>:/tmp/
```

!!! info "**Примітка**"
    Якщо ви отримуєте помилку, що '/usr/libexec/sftp-server could not be found', це тому, що в пізніших версіях scp тепер використовується sftp за лаштунками, і це не вбудовано в поточну реалізацію busybox. Щоб змусити scp використовувати застарілу поведінку, використовуйте опцію -O:

```bash
scp -O uImage* rootfs* root@<yourcameraip>:/tmp/
```

<h3>На камері:</h3>

Тепер створіть сесію терміналу з камерою, наприклад `ssh root@192.168.1.10`, та запустіть команду sysupgrade, вказавши на ваші нові образи в /tmp.

```bash
soc=$(fw_printenv -n soc)
sysupgrade --kernel=/tmp/uImage.${soc} --rootfs=/tmp/rootfs.squashfs.${soc} -z
```

## Оновлення з SD-карти

<h3>На вашій хост-машині</h3>

Якщо у вас ще немає образів uImage та rootfs.squashfs для вашої камери, перейдіть на https://github.com/OpenIPC/firmware/releases/tag/latest та завантажте останній пакет прошивки для вашого SoC і витягніть вміст.

Якщо ви створили власні версії, використовуючи копію репозиторію прошивки, то ваші образи uImage та rootsfs.squashfs будуть у папці output/images.

Вставте SD-карту у вашу хост-машину та скопіюйте файли uImage та squashfs на карту, наприклад:

```bash
cp uImage* rootfs* /media/<username>/<card-id>/
```

<h3>На вашій камері</h3>

Вставте SD-карту в камеру.

Створіть сесію терміналу та запустіть наступне:

```bash
soc=$(fw_printenv -n soc)
sysupgrade --kernel=/mnt/mmcblk0p1/uImage.${soc} --rootfs=/mnt/mmcblk0p1/rootfs.squashfs.${soc} --force_ver -z
```

<h3>SD-карта: Альтернативно, з U-Boot</h3>

**Для 8MB образу:**

```bash
mw.b ${baseaddr} 0xff 0x200000
fatload mmc 0:1 ${baseaddr} uImage.${soc}
sf probe 0; sf erase 0x50000 0x200000; sf write ${baseaddr} 0x50000 ${filesize}

mw.b ${baseaddr} 0xff 0x500000
fatload mmc 0:1 ${baseaddr} rootfs.squashfs.${soc}
sf probe 0; sf erase 0x250000 0x500000; sf write ${baseaddr} 0x250000 ${filesize}
```

**Для 16MB образу:**

```bash
mw.b ${baseaddr} 0xff 0x300000
fatload mmc 0:1 ${baseaddr} uImage.${soc}
sf probe 0; sf erase 0x50000 0x300000; sf write ${baseaddr} 0x50000 ${filesize}

mw.b ${baseaddr} 0xff 0x500000
fatload mmc 0:1 ${baseaddr} rootfs.squashfs.${soc}
sf probe 0; sf erase 0x350000 0xa00000; sf write ${baseaddr} 0x350000 ${filesize}
```

<h3>Прошивка U-Boot через ymodem</h3>

Очистіть 320K оперативної пам'яті та завантажте файл завантажувача в нього:

```bash
mw.b ${baseaddr} 0xff 0x50000
loady
```

(натисніть "Ctrl-a", потім ":", потім введіть)

```bash
exec !! sz --ymodem u-boot.bin
```

Після завантаження файлу запишіть його в ROM:

```bash
sf probe 0
sf erase 0x0 0x50000
sf write ${baseaddr} 0x0 ${filesize}
```

## Усунення неполадок

Якщо ви отримали цю помилку:

```
losetup: /tmp/rootfs.squashfs.${soc}: No such file or directory
Rootfs: Unable to get hostname, execution was interrupted...
```

спочатку спробуйте оновити тільки ядро: `sysupgrade -k`

Якщо це не допомагає, використовуйте опцію --force: `sysupgrade -r --force`

Якщо ви зіткнулися з глітчем, отримайте найновішу версію утиліти:

```bash
curl -k -L -o /usr/sbin/sysupgrade "https://raw.githubusercontent.com/OpenIPC/firmware/master/general/overlay/usr/sbin/sysupgrade"
```