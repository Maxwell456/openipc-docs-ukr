---
title: "Програмне забезпечення OpenFPV — прошивки та відеолінк"
description: "Каталог програмного забезпечення для OpenIPC FPV: прошивки камер (APFPV, Greg's, APALink), цифровий відеолінк WFB-NG, відеоенкодер Waybeam і платформа 4G/LTE QuadroFleet."
---

# Програмне забезпечення OpenFPV

Цей розділ — повний каталог програмного забезпечення для **OpenIPC FPV**: від прошивок камер і цифрового відеолінку до відеоенкодера та платформи дальнього зв'язку через 4G/LTE. Нижче софт згруповано за призначенням, щоб ви могли швидко знайти потрібний компонент і перейти до покрокової інструкції.

::: tip Не знаєте, з чого почати?
Якщо ви новачок — почніть із прошивки [**APFPV**](/software/apfpv) (найпростіше передавання FPV-відео через Wi-Fi), а потім налаштуйте [**наземну станцію**](/software/apfpv-gs).
:::

---

## Прошивки камер

Прошивка визначає, як камера OpenIPC кодує та передає відео. Оберіть варіант під свій сценарій.

<div class="fpv-cards">
  <a class="fpv-card" href="/software/firmware"><span class="fpv-card-t">Огляд прошивок OpenFPV</span><span class="fpv-card-d">Порівняння доступних прошивок для камер OpenIPC FPV</span></a>
  <a class="fpv-card" href="/software/apfpv"><span class="fpv-card-t">APFPV — для початківців</span><span class="fpv-card-d">Просте передавання FPV-відео через Wi-Fi без складної конфігурації</span></a>
  <a class="fpv-card" href="/software/apfpv-greg"><span class="fpv-card-t">Greg's APFPV</span><span class="fpv-card-d">Версія APFPV з адаптивним бітрейтом для FPV/GPS дронів та літаків</span></a>
  <a class="fpv-card" href="/software/apalink"><span class="fpv-card-t">APALink</span><span class="fpv-card-d">Динамічна система перемикання бітрейту для APFPV</span></a>
  <a class="fpv-card" href="/software/dual-camera"><span class="fpv-card-t">AI Dual Camera</span><span class="fpv-card-d">Денна камера + тепловізор із перемиканням у польоті та бортовою детекцією об'єктів</span></a>
</div>

---

## WFB-NG — цифровий відеолінк

**WFB-NG** (WiFi Broadcast Next Generation) — основа цифрового FPV-зв'язку в OpenIPC: широкомовна передача відео без асоціації з точкою доступу.

<div class="fpv-cards">
  <a class="fpv-card" href="/software/wfb-ng"><span class="fpv-card-t">WFB-NG — як це працює</span><span class="fpv-card-d">Принцип роботи, підтримуване обладнання та компоненти</span></a>
  <a class="fpv-card" href="/software/wfb-ng-config"><span class="fpv-card-t">Конфігурація та калькулятор бітрейту</span><span class="fpv-card-d">Ключі шифрування, wifibroadcast.cfg, параметри каналу та розрахунок бітрейту</span></a>
  <a class="fpv-card" href="/software/wfb-ng-groundstation"><span class="fpv-card-t">Наземна станція на Ubuntu</span><span class="fpv-card-d">Встановлення WFB-NG на Ubuntu 22.04, драйвери, запуск і моніторинг лінку</span></a>
</div>

---

## Waybeam — відеоенкодер

**Waybeam** — автономний H.265 (HEVC) відеоенкодер і RTP-стрімер для камер SigmaStar, що замінює Majestic та нативно інтегрується з WFB-NG.

<div class="fpv-cards">
  <a class="fpv-card" href="/software/waybeam-venc"><span class="fpv-card-t">Огляд Waybeam</span><span class="fpv-card-d">Можливості, підтримувані чіпи та порівняння з Majestic</span></a>
  <a class="fpv-card" href="/software/waybeam-venc-install-camera"><span class="fpv-card-t">Встановлення на камеру</span><span class="fpv-card-d">Завантаження, конфігурація <code>/etc/waybeam.json</code>, перший запуск</span></a>
  <a class="fpv-card" href="/software/waybeam-venc-install-groundstation"><span class="fpv-card-t">Інтеграція з WFB-ng</span><span class="fpv-card-d">Заміна Majestic у зв'язці з WFB-ng</span></a>
  <a class="fpv-card" href="/software/waybeam-venc-web-interface"><span class="fpv-card-t">Веб-панель та HTTP API</span><span class="fpv-card-d">Керування параметрами в реальному часі, ISP-тюнінг, resilience-пресети</span></a>
</div>

---

## Наземна станція

Програмне забезпечення для приймальної сторони — декодування та відображення FPV-відео.

<div class="fpv-cards">
  <a class="fpv-card" href="/software/apfpv-gs"><span class="fpv-card-t">Radxa Zero 3W з APFPV</span><span class="fpv-card-d">Готовий образ для прийому FPV-відео з Radxa Zero 3W</span></a>
  <a class="fpv-card" href="/software/wfb-ng-groundstation"><span class="fpv-card-t">WFB-NG на Ubuntu</span><span class="fpv-card-d">Універсальна наземна станція на ПК під Ubuntu</span></a>
</div>

---

## QuadroFleet — платформа 4G/LTE

**QuadroFleet** — відкрита модульна платформа для керування FPV-дронами через мобільні мережі: відео з низькою затримкою, GPS-трекінг, безпечний VPN та OSD.

<div class="fpv-cards">
  <a class="fpv-card" href="/software/openipc-4g"><span class="fpv-card-t">Огляд платформи QuadroFleet</span><span class="fpv-card-d">Архітектура, можливості та сценарії застосування</span></a>
  <a class="fpv-card" href="/software/drone-build"><span class="fpv-card-t">Збірка дрона</span><span class="fpv-card-d">Компоненти та кроки складання дрона QuadroFleet</span></a>
  <a class="fpv-card" href="/software/firmware-build"><span class="fpv-card-t">Збірка та прошивка Firmware</span><span class="fpv-card-d">Компіляція та прошивка OpenIPC Firmware для 4G</span></a>
  <a class="fpv-card" href="/software/vpn"><span class="fpv-card-t">Налаштування VPN</span><span class="fpv-card-d">Конфігурація WireGuard для безпечного керування</span></a>
  <a class="fpv-card" href="/software/map"><span class="fpv-card-t">Навігація по карті</span><span class="fpv-card-d">Робота з інтерактивною картою QuadroFleet</span></a>
  <a class="fpv-card" href="/software/update-settings"><span class="fpv-card-t">Оновлення налаштувань</span><span class="fpv-card-d">Оновлення прошивки QuadroFleet</span></a>
</div>

---

::: info Апаратна частина
Шукаєте інформацію про камери, VTX чи приймачі? Дивіться розділ [**Обладнання**](/hardware/vtx/) або стартовий гайд [**Перші кроки**](/getting-started/troubleshooting).
:::
