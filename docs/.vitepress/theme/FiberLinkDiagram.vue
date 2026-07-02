<script setup lang="ts">
// Інтерактивна схема оптоволоконного відеолінку OpenIPC.
// Клік по вузлу — панель із поясненням. Двомовність — за useData().lang.
// A11y: вузли-кнопки, керування з клавіатури, prefers-reduced-motion.
import { useData } from 'vitepress'
import { computed, ref } from 'vue'

const { lang } = useData()
const isUK = computed(() => lang.value === 'uk-UA')

interface Node {
  id: string
  label: () => string
  spec: () => string
  desc: () => string
}

const t = computed(() =>
  isUK.value
    ? {
        air: 'Борт (дрон)',
        ground: 'Земля (НСУ)',
        fiber: 'Одне одномодове волокно',
        down: '1310 нм · відео вниз',
        up: '1550 нм · керування вгору',
        hint: 'Натисніть будь-який вузол, щоб побачити його роль у лінку.',
        power: 'Живлення — від власної батареї дрона; волокно несе лише дані.',
      }
    : {
        air: 'Airborne (drone)',
        ground: 'Ground (station)',
        fiber: 'One single-mode fiber',
        down: '1310 nm · video down',
        up: '1550 nm · control up',
        hint: 'Tap any node to see its role in the link.',
        power: 'Power comes from the drone battery; the fiber carries data only.',
      }
)

const airNodes: Node[] = [
  {
    id: 'cam',
    label: () => (isUK.value ? 'Камера OpenIPC' : 'OpenIPC camera'),
    spec: () => 'Majestic · H.265 · RTSP',
    desc: () =>
      isUK.value
        ? 'Кодує відео (H.265) і віддає RTSP-потік по вбудованому Ethernet 10/100 (напр. SoC SigmaStar SSC338Q). Це рідний IP-вихід камери — жодного Wi-Fi.'
        : 'Encodes video (H.265) and serves an RTSP stream over built-in 10/100 Ethernet (e.g. the SigmaStar SSC338Q SoC). This is the camera’s native IP output — no Wi-Fi.',
  },
  {
    id: 'mcAir',
    label: () => (isUK.value ? 'Медіаконвертер' : 'Media converter'),
    spec: () => '100BASE-TX ↔ FX',
    desc: () =>
      isUK.value
        ? 'Перетворює електричний Ethernet-сигнал камери на оптичний. Живиться від BEC; просадка напруги збиває лінк.'
        : 'Converts the camera’s electrical Ethernet into optics. Powered from a BEC; a voltage sag drops the link.',
  },
  {
    id: 'sfpAir',
    label: () => 'BiDi SFP',
    spec: () => 'Tx 1310 / Rx 1550',
    desc: () =>
      isUK.value
        ? 'Однонитковий WDM-модуль: передає й приймає по ОДНОМУ волокні на двох довжинах хвиль. Наземний SFP має бути дзеркальним (Tx 1550 / Rx 1310).'
        : 'Single-strand WDM module: transmits and receives over ONE fiber on two wavelengths. The ground SFP must be its mirror (Tx 1550 / Rx 1310).',
  },
]

const groundNodes: Node[] = [
  {
    id: 'sfpGnd',
    label: () => 'BiDi SFP',
    spec: () => 'Tx 1550 / Rx 1310',
    desc: () =>
      isUK.value
        ? 'Дзеркальна пара до бортового модуля. Разом вони формують дуплекс по одному волокну.'
        : 'The mirror of the airborne module. Together they form a duplex link over one fiber.',
  },
  {
    id: 'mcGnd',
    label: () => (isUK.value ? 'Медіаконвертер' : 'Media converter'),
    spec: () => 'FX ↔ 100BASE-TX',
    desc: () =>
      isUK.value
        ? 'Повертає оптику назад в Ethernet (RJ45) для наземного пристрою.'
        : 'Turns the optics back into Ethernet (RJ45) for the ground device.',
  },
  {
    id: 'decoder',
    label: () => (isUK.value ? 'Ноутбук / декодер' : 'Laptop / decoder'),
    spec: () => 'mpv · GStreamer',
    desc: () =>
      isUK.value
        ? 'Приймає звичайний RTSP-потік і декодує його з низькою затримкою (mpv, ffplay, GStreamer). PixelPilot тут не потрібен — він для WFB-NG.'
        : 'Receives an ordinary RTSP stream and decodes it with low latency (mpv, ffplay, GStreamer). PixelPilot is not needed here — it targets WFB-NG.',
  },
]

const allNodes = computed(() => [...airNodes, ...groundNodes])
const selectedId = ref<string | null>(null)
const selected = computed(() => allNodes.value.find((n) => n.id === selectedId.value) ?? null)

function pick(id: string) {
  selectedId.value = selectedId.value === id ? null : id
}
</script>

<template>
  <div class="fib" role="group" :aria-label="isUK ? 'Схема оптоволоконного відеолінку' : 'Fiber-optic video link diagram'">
    <!-- Борт -->
    <div class="fib-stage" :data-label="t.air">
      <div class="fib-row">
        <template v-for="(n, i) in airNodes" :key="n.id">
          <button
            type="button"
            class="fib-node"
            :class="{ 'fib-active': selectedId === n.id }"
            :aria-pressed="selectedId === n.id"
            @click="pick(n.id)"
          >
            <span class="fib-node-label">{{ n.label() }}</span>
            <span class="fib-node-spec">{{ n.spec() }}</span>
          </button>
          <i v-if="i < airNodes.length - 1" class="fib-arrow" aria-hidden="true"></i>
        </template>
      </div>
    </div>

    <!-- Волокно -->
    <div class="fib-link" aria-hidden="true">
      <span class="fib-strand fib-strand-down"><b class="fib-pulse fib-pulse-down"></b></span>
      <span class="fib-spool">◉</span>
      <span class="fib-strand fib-strand-up"><b class="fib-pulse fib-pulse-up"></b></span>
      <span class="fib-link-labels">
        <span class="fib-wl fib-wl-down">▼ {{ t.down }}</span>
        <span class="fib-wl fib-wl-up">▲ {{ t.up }}</span>
        <span class="fib-fiber-name">{{ t.fiber }}</span>
      </span>
    </div>

    <!-- Земля -->
    <div class="fib-stage" :data-label="t.ground">
      <div class="fib-row">
        <template v-for="(n, i) in groundNodes" :key="n.id">
          <button
            type="button"
            class="fib-node"
            :class="{ 'fib-active': selectedId === n.id }"
            :aria-pressed="selectedId === n.id"
            @click="pick(n.id)"
          >
            <span class="fib-node-label">{{ n.label() }}</span>
            <span class="fib-node-spec">{{ n.spec() }}</span>
          </button>
          <i v-if="i < groundNodes.length - 1" class="fib-arrow" aria-hidden="true"></i>
        </template>
      </div>
    </div>

    <!-- Панель деталей -->
    <div class="fib-panel" :class="{ 'fib-panel-empty': !selected }" aria-live="polite">
      <template v-if="selected">
        <span class="fib-panel-title">{{ selected.label() }} · <code>{{ selected.spec() }}</code></span>
        <span class="fib-panel-desc">{{ selected.desc() }}</span>
      </template>
      <template v-else>
        <span class="fib-panel-hint">{{ t.hint }}</span>
        <span class="fib-panel-note">{{ t.power }}</span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.fib {
  margin: 24px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

/* Етапи (борт / земля) */
.fib-stage {
  position: relative;
  width: 100%;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 12px;
  padding: 22px 14px 16px;
  background: var(--vp-c-bg-soft);
}
.fib-stage::before {
  content: attr(data-label);
  position: absolute;
  top: -9px;
  left: 14px;
  padding: 0 8px;
  background: var(--vp-c-bg);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
}

.fib-row {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: center;
  gap: 8px;
}

/* Вузли-кнопки */
.fib-node {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 9px 14px;
  border-radius: 9px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  cursor: pointer;
  text-align: left;
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}
.fib-node:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
}
.fib-node.fib-active {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 1px var(--vp-c-brand-soft), 0 0 18px -6px var(--vp-c-brand-1);
}
.fib-node-label {
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  white-space: nowrap;
}
.fib-node-spec {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.68rem;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

/* З'єднувач усередині етапу */
.fib-arrow {
  align-self: center;
  position: relative;
  width: 26px;
  height: 2px;
  background: var(--vp-c-divider);
  flex: 0 0 auto;
}
.fib-arrow::before {
  content: '';
  position: absolute;
  right: -1px;
  top: 50%;
  border-left: 5px solid var(--vp-c-divider);
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  transform: translateY(-50%);
}

/* Оптоволоконна секція між етапами */
.fib-link {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 0;
}
.fib-strand {
  position: relative;
  width: 60%;
  max-width: 340px;
  height: 3px;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--vp-c-brand-soft), var(--vp-c-brand-1), var(--vp-c-brand-soft));
  overflow: hidden;
}
.fib-spool {
  color: var(--vp-c-brand-1);
  font-size: 1.1rem;
  line-height: 1;
  filter: drop-shadow(0 0 6px var(--vp-c-brand-1));
}
.fib-pulse {
  position: absolute;
  top: 50%;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 8px 2px var(--vp-c-brand-1);
  transform: translateY(-50%);
}
.fib-pulse-down { animation: fib-down 2.4s linear infinite; }
.fib-pulse-up { animation: fib-up 2.4s linear infinite; animation-delay: 1.2s; }
@keyframes fib-down {
  0% { left: -8px; opacity: 0; }
  12% { opacity: 1; }
  88% { opacity: 1; }
  100% { left: 100%; opacity: 0; }
}
@keyframes fib-up {
  0% { left: 100%; opacity: 0; }
  12% { opacity: 1; }
  88% { opacity: 1; }
  100% { left: -8px; opacity: 0; }
}

.fib-link-labels {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 6px 14px;
  margin-top: 2px;
}
.fib-wl {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.68rem;
  color: var(--vp-c-brand-1);
}
.fib-wl-up { color: var(--vp-c-text-2); }
.fib-fiber-name {
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
}

/* Панель деталей */
.fib-panel {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
  min-height: 74px;
}
.fib-panel-empty { border-style: dashed; }
.fib-panel-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}
.fib-panel-title code {
  font-size: 0.76rem;
  color: var(--vp-c-brand-1);
}
.fib-panel-desc { font-size: 0.85rem; line-height: 1.55; color: var(--vp-c-text-2); }
.fib-panel-hint { font-size: 0.86rem; font-weight: 600; color: var(--vp-c-text-1); }
.fib-panel-note { font-size: 0.8rem; color: var(--vp-c-text-2); }

@media (max-width: 640px) {
  .fib-strand { width: 78%; }
}

@media (prefers-reduced-motion: reduce) {
  .fib-pulse { animation: none !important; left: 46% !important; opacity: 1 !important; }
}
</style>
