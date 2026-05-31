<script setup lang="ts">
import { useData } from 'vitepress'

const { site } = useData()
const isEn = site.value.lang?.startsWith('en')

const t = isEn
  ? {
      code: '404',
      title: 'Page not found',
      text: 'The page may have been moved or deleted, or the link is incorrect.',
      home: 'Go to homepage',
      start: 'Quick start',
      homeLink: '/en/',
      startLink: '/en/getting-started/'
    }
  : {
      code: '404',
      title: 'Сторінку не знайдено',
      text: 'Можливо, сторінку переміщено чи видалено, або посилання вказано з помилкою.',
      home: 'На головну',
      start: 'Швидкий старт',
      homeLink: '/',
      startLink: '/getting-started/'
    }
</script>

<template>
  <div class="nf-wrap">
    <div class="nf-glow" aria-hidden="true"></div>
    <div class="nf-content">
      <div class="nf-code">{{ t.code }}</div>
      <h1 class="nf-title">{{ t.title }}</h1>
      <p class="nf-text">{{ t.text }}</p>
      <div class="nf-actions">
        <a class="nf-btn nf-btn-brand" :href="t.homeLink">{{ t.home }}</a>
        <a class="nf-btn nf-btn-alt" :href="t.startLink">{{ t.start }}</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nf-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--vp-nav-height) - 64px);
  padding: 48px 24px;
  overflow: hidden;
}

.nf-glow {
  position: absolute;
  top: 0;
  left: 50%;
  width: min(720px, 90vw);
  height: 460px;
  transform: translateX(-50%);
  background: radial-gradient(ellipse at center, rgba(61, 106, 255, 0.16), transparent 68%);
  pointer-events: none;
}

.nf-content {
  position: relative;
  text-align: center;
  max-width: 540px;
}

.nf-code {
  font-size: clamp(72px, 16vw, 132px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  background: linear-gradient(120deg, var(--vp-c-brand-1) 30%, #7c9bff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nf-title {
  margin-top: 12px;
  font-size: clamp(1.4rem, 4vw, 1.9rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  border: none !important;
}

.nf-text {
  margin-top: 12px;
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
  display: inline-block;
  padding: 10px 22px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
}

.nf-btn-brand {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.nf-btn-brand:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(61, 106, 255, 0.35);
}

.nf-btn-alt {
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-1);
}

.nf-btn-alt:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
}
</style>
