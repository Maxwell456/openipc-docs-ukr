---
layout: home
title: OpenFPV — OpenIPC FPV Documentation
description: OpenIPC — open platform for digital FPV systems. Documentation and community support in English.

hero:
  name: " "
  text: Digital FPV Systems Based on OpenIPC
  tagline: Open platform that transforms IP cameras into digital FPV systems. Documentation and community support in English.
  actions:
    - theme: brand
      text: Quick Start
      link: /en/getting-started/
    - theme: alt
      text: Firmware
      link: https://github.com/OpenIPC/firmware/releases
    - theme: sponsor
      text: Support
      link: /en/support
---

<!-- ═══ Блок 1: сценарії — точки входу за наміром відвідувача.
     Картки на поверхнях у мові сайту, але без іконок: тихий номер кроку
     01/02/03 передає воронку (порівняв → підібрав → лагодиш). ═══ -->
<section class="hv2-block">
  <h2 class="hv2-eyebrow">Where to start</h2>
  <div class="hv2-paths">
    <a href="/en/getting-started/comparison" class="hv2-path">
      <span class="hv2-path-step">01</span>
      <span class="hv2-path-body">
        <span class="hv2-path-title">Choosing a system</span>
        <span class="hv2-path-desc">How OpenIPC compares to DJI, Walksnail and HDZero.</span>
      </span>
      <svg class="hv2-path-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
    </a>
    <a href="/en/hardware/vtx/" class="hv2-path">
      <span class="hv2-path-step">02</span>
      <span class="hv2-path-body">
        <span class="hv2-path-title">Choosing hardware</span>
        <span class="hv2-path-desc">Supported cameras (VTX), receivers and network cards.</span>
      </span>
      <svg class="hv2-path-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
    </a>
    <a href="/en/faq" class="hv2-path">
      <span class="hv2-path-step">03</span>
      <span class="hv2-path-body">
        <span class="hv2-path-title">Something's not working</span>
        <span class="hv2-path-desc">No video, camera unresponsive, VRX recovery.</span>
      </span>
      <svg class="hv2-path-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
    </a>
  </div>
</section>

<!-- ═══ Блок 2: останні оновлення — сигнал, що проєкт живий.
     Список генерується автоматично (LatestUpdates.vue + posts.data.mts):
     3 найновіші пости з docs/en/updates/posts/ за датою з frontmatter. ═══ -->
<section class="hv2-block">
  <div class="hv2-block-head">
    <h2 class="hv2-eyebrow">Latest updates</h2>
    <a class="hv2-updates-all" href="/en/updates">All updates →</a>
  </div>
  <LatestUpdates />
</section>

<div class="home-notice">
  <svg class="home-notice-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="19" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
  <span>Community project of the Ukrainian OpenIPC community, not an official OpenIPC resource.</span>
</div>

<footer class="home-footer">
  <span class="home-footer-copy">© 2024–2026 OpenFPV Ukraine</span>
</footer>

<style>
/* ── Стили главной (hv2-). Единый язык сайта: карточки doc-nav (bg-soft,
     радиус 14, двойная тень); стили строк списка обновлений (.hv2-update*)
     общие с /updates и живут в custom.css, секция "Updates list".
     Паттерн профессиональных FPV-доков (ExpressLRS): входные карточки +
     новости списком с датами.
     A11y: настоящие h2, :focus-visible, prefers-reduced-motion. ── */

.hv2-block {
  margin-top: 32px;
}

/* Заголовки секций — настоящие h2 для структуры документа и скринридеров,
   визуально оформлены как eyebrow. Дублирующий селектор с .vp-doc перебивает
   дефолтные рамку/отступы/размер заголовков VitePress. */
.vp-doc h2.hv2-eyebrow,
h2.hv2-eyebrow {
  margin: 0 0 14px 2px;
  padding-top: 0;
  border-top: none;
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
}

/* Шапка секции: заголовок слева, ссылка «все» по правому краю той же строки */
.hv2-block-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

/* ── Сценарные карточки: та же поверхность, что у doc-nav (bg-soft,
     радиус 14, двойная тень, подъём на hover), но внутри — тихий номер
     шага вместо иконки-плашки. Ничего не «загорается»: на hover меняются
     только карточка (подъём), заголовок и шеврон; номер остаётся серым. ── */
.hv2-paths {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.hv2-path {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12), 0 6px 16px -10px rgba(0, 0, 0, 0.4);
  text-decoration: none !important;
  color: inherit;
  transition: background 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.hv2-path:hover {
  background: var(--vp-c-bg-mute);
  box-shadow: 0 14px 30px -14px rgba(0, 0, 0, 0.5), 0 4px 10px -4px rgba(0, 0, 0, 0.35);
  transform: translateY(-3px);
}

/* Номер шага — той же чип, что у дат в списке обновлений ниже:
   нейтральная подложка, приглушённый текст, никаких hover-эффектов */
.hv2-path-step {
  flex-shrink: 0;
  font-size: 0.74rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  border-radius: 7px;
  padding: 3px 8px;
}

.hv2-path-body {
  flex: 1;
  min-width: 0;
  padding-top: 2px;
}

.hv2-path-title {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
  transition: color 0.2s ease;
}

.hv2-path:hover .hv2-path-title { color: var(--vp-c-brand-1); }

.hv2-path-desc {
  display: block;
  font-size: 0.8rem;
  line-height: 1.55;
  color: var(--vp-c-text-2);
}

.hv2-path-arrow {
  flex-shrink: 0;
  align-self: center;
  color: var(--vp-c-text-3);
  opacity: 0.4;
  transition: opacity 0.2s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s ease;
}

.hv2-path:hover .hv2-path-arrow {
  opacity: 1;
  transform: translateX(4px);
  color: var(--vp-c-brand-1);
}

/* Ссылка «All updates →» в шапке блока */
.hv2-updates-all {
  font-size: 0.78rem;
  font-weight: 600;
  white-space: nowrap;
  color: var(--vp-c-brand-1);
  text-decoration: none !important;
}

.hv2-updates-all:hover { text-decoration: underline !important; }

/* ── Один экран на Full HD: ужимаем чисто воздушные зазоры — верх hero,
     дисклеймер, футер и нижний отступ страницы. Селекторы с запасом
     специфичности (.VPHome / .VPContent), чтобы перебить custom.css
     независимо от порядка загрузки. ── */
.VPHome .VPHero {
  padding-top: 76px !important;
  padding-bottom: 8px !important;
}

.VPContent .VPHome {
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
}

.VPHome .home-notice {
  margin-top: 18px;
}

.VPHome .home-footer {
  margin-top: 14px;
  padding: 12px 0 0;
}

/* ── Клавиатурная навигация: видимый фокус на карточках и ссылках ── */
.hv2-path:focus-visible,
.hv2-updates-all:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

/* ── Адаптив ── */
@media (max-width: 860px) {
  .hv2-paths { grid-template-columns: 1fr; }
}

/* ── Уважение к prefers-reduced-motion: убираем подъёмы и сдвиги,
     смена цвета/фона на hover остаётся ── */
@media (prefers-reduced-motion: reduce) {
  .hv2-path,
  .hv2-path-title,
  .hv2-path-arrow {
    transition: none;
  }

  .hv2-path:hover { transform: none; }

  .hv2-path:hover .hv2-path-arrow { transform: none; }
}
</style>
