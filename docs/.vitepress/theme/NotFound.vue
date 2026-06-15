<script setup lang="ts">
import { useData } from 'vitepress'

const { site } = useData()
const isEn = site.value.lang?.startsWith('en')

const t = isEn
  ? {
      code: '404',
      banner: 'SIGNAL LOST',
      title: 'Page not found',
      text: 'No video link to this page — it may have been moved, deleted, or the URL is wrong. Initiating return-to-home.',
      home: 'Return to home',
      rth: 'RTH',
      start: 'Quick start',
      homeLink: '/en/',
      startLink: '/en/getting-started/'
    }
  : {
      code: '404',
      banner: 'SIGNAL LOST',
      title: 'Сторінку не знайдено',
      text: 'Немає відеолінку до цієї сторінки — можливо, її переміщено, видалено або в посиланні помилка. Виконується повернення на базу.',
      home: 'Повернутись додому',
      rth: 'RTH',
      start: 'Швидкий старт',
      homeLink: '/',
      startLink: '/getting-started/'
    }
</script>

<template>
  <div class="nf-wrap">
    <div class="nf-screen" role="img" :aria-label="`${t.banner} — ${t.title}`">
      <!-- decorative feed layers -->
      <div class="nf-static" aria-hidden="true"></div>
      <div class="nf-scanlines" aria-hidden="true"></div>
      <div class="nf-vignette" aria-hidden="true"></div>

      <!-- OSD corners (English tokens — authentic Betaflight/INAV style) -->
      <div class="osd osd-tl" aria-hidden="true"><span class="rec">●</span> REC 00:404</div>
      <div class="osd osd-tr" aria-hidden="true">
        BAT 0.0V
        <span class="bars"><i></i><i></i><i></i><i></i></span>
      </div>
      <div class="osd osd-bl" aria-hidden="true">ALT 0m&nbsp;&nbsp;SPD 0</div>
      <div class="osd osd-br" aria-hidden="true">RSSI 0%&nbsp;&nbsp;LQ 0</div>

      <!-- crosshair -->
      <div class="nf-cross" aria-hidden="true">
        <span class="ch-h"></span><span class="ch-v"></span><span class="ch-box"></span>
      </div>

      <!-- center content -->
      <div class="nf-content">
        <div class="nf-code" :data-code="t.code">{{ t.code }}</div>
        <div class="nf-banner">⚠ {{ t.banner }}</div>
        <div class="nf-failsafe" aria-hidden="true">FAILSAFE</div>
      </div>
    </div>

    <h1 class="nf-title">{{ t.title }}</h1>
    <p class="nf-text">{{ t.text }}</p>
    <div class="nf-actions">
      <a class="nf-btn nf-btn-brand" :href="t.homeLink">
        <span class="nf-rth">{{ t.rth }}</span>{{ t.home }}
      </a>
      <a class="nf-btn nf-btn-alt" :href="t.startLink">{{ t.start }}</a>
    </div>
  </div>
</template>

<style scoped>
.nf-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--vp-nav-height) - 64px);
  padding: 40px 24px 64px;
  text-align: center;
}

/* ---- FPV goggles feed ---- */
.nf-screen {
  position: relative;
  width: min(680px, 92vw);
  aspect-ratio: 16 / 9;
  border-radius: 14px;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 50% 40%, rgba(61, 106, 255, 0.18), transparent 70%),
    #05070d;
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(255, 255, 255, 0.03);
  font-family: var(--vp-font-family-mono, ui-monospace, "SFMono-Regular", Menlo, monospace);
  animation: nf-flicker 6s steps(60) infinite;
}

.nf-static {
  position: absolute;
  inset: -50%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.10;
  mix-blend-mode: screen;
  animation: nf-noise 0.6s steps(4) infinite;
}

.nf-scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.04) 0,
    rgba(255, 255, 255, 0.04) 1px,
    transparent 2px,
    transparent 3px
  );
  pointer-events: none;
}

.nf-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 0, 0.55) 100%);
  pointer-events: none;
}

/* ---- OSD telemetry ---- */
.osd {
  position: absolute;
  font-size: clamp(10px, 1.6vw, 13px);
  letter-spacing: 0.06em;
  color: #d7e3ff;
  text-shadow: 0 0 6px rgba(61, 106, 255, 0.6), 0 1px 2px rgba(0, 0, 0, 0.9);
  font-weight: 600;
}
.osd-tl { top: 12px; left: 14px; }
.osd-tr { top: 12px; right: 14px; display: flex; align-items: center; gap: 6px; }
.osd-bl { bottom: 12px; left: 14px; }
.osd-br { bottom: 12px; right: 14px; }

.rec { color: #ff4d4d; animation: nf-blink 1.1s steps(2) infinite; }

.bars { display: inline-flex; align-items: flex-end; gap: 2px; height: 12px; }
.bars i {
  width: 3px;
  background: rgba(215, 227, 255, 0.25);
  border-radius: 1px;
}
.bars i:nth-child(1) { height: 4px; }
.bars i:nth-child(2) { height: 7px; }
.bars i:nth-child(3) { height: 10px; }
.bars i:nth-child(4) { height: 13px; }

/* ---- crosshair ---- */
.nf-cross {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 84px;
  height: 84px;
  transform: translate(-50%, -50%);
  opacity: 0.5;
}
.ch-h, .ch-v { position: absolute; background: rgba(215, 227, 255, 0.55); }
.ch-h { top: 50%; left: 0; width: 100%; height: 1px; transform: translateY(-50%); }
.ch-v { left: 50%; top: 0; height: 100%; width: 1px; transform: translateX(-50%); }
.ch-box {
  position: absolute;
  inset: 34px;
  border: 1px solid rgba(215, 227, 255, 0.5);
}

/* ---- center content ---- */
.nf-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.nf-code {
  position: relative;
  font-size: clamp(64px, 15vw, 124px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  color: #eaf0ff;
  text-shadow: 0 0 26px rgba(61, 106, 255, 0.55);
  animation: nf-glitch 3.5s infinite;
}

.nf-banner {
  font-size: clamp(13px, 2.4vw, 18px);
  font-weight: 700;
  letter-spacing: 0.32em;
  color: #ff5a5a;
  text-shadow: 0 0 10px rgba(255, 60, 60, 0.5);
  padding-left: 0.32em;
}

.nf-failsafe {
  margin-top: 2px;
  font-size: clamp(9px, 1.5vw, 12px);
  letter-spacing: 0.3em;
  color: #ffd14d;
  border: 1px solid rgba(255, 209, 77, 0.5);
  border-radius: 4px;
  padding: 2px 8px;
  animation: nf-blink 1s steps(2) infinite;
}

/* ---- text + actions ---- */
.nf-title {
  margin-top: 30px;
  font-size: clamp(1.4rem, 4vw, 1.9rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  border: none !important;
}

.nf-text {
  margin-top: 12px;
  max-width: 520px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.nf-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-top: 28px;
}

.nf-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
}

.nf-btn-brand { background: var(--vp-c-brand-1); color: #fff; }
.nf-btn-brand:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(61, 106, 255, 0.35); }

.nf-rth {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  background: rgba(255, 255, 255, 0.22);
  border-radius: 5px;
  padding: 2px 6px;
}

.nf-btn-alt { border: 1px solid var(--vp-c-border); color: var(--vp-c-text-1); }
.nf-btn-alt:hover { transform: translateY(-2px); border-color: var(--vp-c-brand-1); }

/* ---- animations ---- */
@keyframes nf-noise {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-6%, 4%); }
  50% { transform: translate(4%, -5%); }
  75% { transform: translate(-3%, 6%); }
  100% { transform: translate(5%, 2%); }
}
@keyframes nf-flicker {
  0%, 100% { opacity: 1; }
  47% { opacity: 1; }
  48% { opacity: 0.86; }
  49% { opacity: 1; }
  92% { opacity: 1; }
  93% { opacity: 0.9; }
  94% { opacity: 1; }
}
@keyframes nf-blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0.15; }
}
@keyframes nf-glitch {
  0%, 92%, 100% { transform: translate(0, 0); text-shadow: 0 0 26px rgba(61, 106, 255, 0.55); }
  93% { transform: translate(-2px, 1px); text-shadow: 2px 0 #ff3b6b, -2px 0 #3df0ff; }
  95% { transform: translate(2px, -1px); text-shadow: -2px 0 #ff3b6b, 2px 0 #3df0ff; }
  97% { transform: translate(-1px, 0); text-shadow: 0 0 26px rgba(61, 106, 255, 0.55); }
}

@media (prefers-reduced-motion: reduce) {
  .nf-screen, .nf-static, .nf-code, .rec, .nf-failsafe {
    animation: none !important;
  }
}
</style>
