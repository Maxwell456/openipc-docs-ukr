<template>
  <div class="lat-timer" ref="root">
    <!-- Дисплей завжди темний незалежно від теми: на фото потрібен
         максимальний контраст білих цифр, однаковий для всіх користувачів -->
    <div class="lat-timer__screen" role="timer" aria-live="off">
      <div class="lat-timer__ms">{{ msText }}<span class="lat-timer__unit">ms</span></div>
      <div class="lat-timer__row">
        <span class="lat-timer__meta">{{ t.frame }} <b>{{ frameText }}</b></span>
        <span class="lat-timer__meta"><b>{{ fps }}</b> fps · {{ frameMs }} {{ t.msFrame }}</span>
      </div>
      <!-- Смуга кадрів: активна комірка зсувається щокадру. На фото з довгою
           витримкою світяться дві сусідні — ознака, що знімок захопив два кадри -->
      <div class="lat-timer__ticks" aria-hidden="true">
        <span
          v-for="i in 10" :key="i"
          class="lat-timer__tick"
          :class="{ 'lat-timer__tick--on': frames % 10 === i - 1 }"
        ></span>
      </div>
    </div>

    <div class="lat-timer__controls">
      <button class="lat-timer__btn" @click="toggle">{{ running ? t.pause : t.start }}</button>
      <button class="lat-timer__btn" @click="reset">{{ t.reset }}</button>
      <button class="lat-timer__btn" @click="toggleFullscreen">{{ t.fullscreen }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()

const T = {
  uk: {
    frame: 'кадр',
    msFrame: 'мс/кадр',
    start: 'Старт',
    pause: 'Пауза',
    reset: 'Скинути',
    fullscreen: 'На весь екран',
  },
  en: {
    frame: 'frame',
    msFrame: 'ms/frame',
    start: 'Start',
    pause: 'Pause',
    reset: 'Reset',
    fullscreen: 'Fullscreen',
  },
}
const t = computed(() => (lang.value.startsWith('uk') ? T.uk : T.en))

const root = ref(null)
const running = ref(false)
const elapsed = ref(0) // мс від старту (без пауз)
const frames = ref(0)
const fps = ref(0)

let rafId = 0
let startStamp = 0 // performance.now() останнього старту
let acc = 0        // накопичено до паузи
let fpsWindowStart = 0
let fpsFrames = 0

function loop(now) {
  elapsed.value = acc + (now - startStamp)
  frames.value++
  fpsFrames++
  // fps рахуємо вікнами по ~500 мс — швидко реагує і не «миготить»
  if (now - fpsWindowStart >= 500) {
    fps.value = Math.round((fpsFrames * 1000) / (now - fpsWindowStart))
    fpsWindowStart = now
    fpsFrames = 0
  }
  rafId = requestAnimationFrame(loop)
}

function start() {
  if (running.value) return
  running.value = true
  startStamp = performance.now()
  fpsWindowStart = startStamp
  fpsFrames = 0
  rafId = requestAnimationFrame(loop)
}

function pause() {
  if (!running.value) return
  running.value = false
  acc = elapsed.value
  cancelAnimationFrame(rafId)
}

function toggle() {
  running.value ? pause() : start()
}

function reset() {
  acc = 0
  elapsed.value = 0
  frames.value = 0
  startStamp = performance.now()
}

function toggleFullscreen() {
  if (!document.fullscreenElement) root.value?.requestFullscreen?.()
  else document.exitFullscreen()
}

onMounted(start)
onBeforeUnmount(() => cancelAnimationFrame(rafId))

const msText = computed(() => String(Math.floor(elapsed.value)).padStart(6, '0'))
const frameText = computed(() => String(frames.value).padStart(6, '0'))
const frameMs = computed(() => (fps.value ? (1000 / fps.value).toFixed(1) : '—'))
</script>

<style scoped>
.lat-timer {
  border: 1px solid var(--vp-c-border);
  border-radius: 14px;
  background: #0a0c10;
  padding: 1.25rem;
  margin: 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.lat-timer__screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 1.25rem 0.5rem;
}

.lat-timer__ms {
  font-family: ui-monospace, SFMono-Regular, 'Cascadia Mono', Consolas, monospace;
  font-variant-numeric: tabular-nums;
  font-size: clamp(2.8rem, 9vw, 4.6rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.04em;
  color: #fff;
}

.lat-timer__unit {
  font-size: 0.3em;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  margin-left: 0.35em;
  letter-spacing: 0.08em;
}

.lat-timer__row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem 1.4rem;
}

.lat-timer__meta {
  font-family: ui-monospace, SFMono-Regular, 'Cascadia Mono', Consolas, monospace;
  font-variant-numeric: tabular-nums;
  font-size: 0.85rem;
  color: #8b94a7;
}

.lat-timer__meta b {
  color: #e6e9f0;
  font-weight: 600;
}

.lat-timer__ticks {
  display: flex;
  gap: 6px;
  margin-top: 0.35rem;
}

.lat-timer__tick {
  width: 22px;
  height: 10px;
  border-radius: 3px;
  background: #1c212b;
}

.lat-timer__tick--on {
  background: var(--vp-c-brand-1);
}

.lat-timer__controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.lat-timer__btn {
  padding: 6px 16px;
  border-radius: 8px;
  border: 1px solid #2a3040;
  background: #12151c;
  color: #cbd2e0;
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}

.lat-timer__btn:hover {
  border-color: var(--vp-c-brand-1);
  color: #fff;
}

/* Повноекранний режим — тільки великі цифри по центру, для чистого фото */
.lat-timer:fullscreen {
  border: none;
  border-radius: 0;
  justify-content: center;
  align-items: center;
}

.lat-timer:fullscreen .lat-timer__ms {
  font-size: 17vmin;
}

.lat-timer:fullscreen .lat-timer__meta {
  font-size: 2.4vmin;
}

.lat-timer:fullscreen .lat-timer__tick {
  width: 4.4vmin;
  height: 2vmin;
}
</style>
