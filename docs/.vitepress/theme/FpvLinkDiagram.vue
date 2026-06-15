<script setup>
import { useData } from 'vitepress'
import { computed } from 'vue'

const { lang } = useData()
const isUK = computed(() => lang.value === 'uk-UA')

const t = computed(() =>
  isUK.value
    ? {
        vtx: 'Камера (VTX)',
        gs: 'Наземна станція (GS)',
        sensor: 'Сенсор',
        radio: 'радіоканал',
        player: 'PixelPilot / QGC',
        wifi: 'WiFi RTL8812'
      }
    : {
        vtx: 'Camera (VTX)',
        gs: 'Ground station (GS)',
        sensor: 'Sensor',
        radio: 'radio link',
        player: 'PixelPilot / QGC',
        wifi: 'WiFi RTL8812'
      }
)
</script>

<template>
  <div class="lnk" role="img" :aria-label="`${t.vtx} → ${t.radio} → ${t.gs}`">
    <div class="lnk-stage" :data-label="t.vtx">
      <div class="lnk-row">
        <span class="lnk-node">{{ t.sensor }}</span>
        <i class="lnk-arrow"></i>
        <span class="lnk-node">ISP</span>
        <i class="lnk-arrow"></i>
        <span class="lnk-node lnk-accent">waybeam · H.265</span>
        <i class="lnk-arrow"></i>
        <span class="lnk-node">wfb_tx</span>
        <i class="lnk-arrow"></i>
        <span class="lnk-node">{{ t.wifi }}</span>
      </div>
    </div>

    <div class="lnk-radio">
      <span class="lnk-wave"></span>
      <span class="lnk-wave"></span>
      <span class="lnk-wave"></span>
      <span class="lnk-radio-label">{{ t.radio }}</span>
    </div>

    <div class="lnk-stage" :data-label="t.gs">
      <div class="lnk-row">
        <span class="lnk-node">{{ t.wifi }}</span>
        <i class="lnk-arrow"></i>
        <span class="lnk-node">wfb_rx</span>
        <i class="lnk-arrow"></i>
        <span class="lnk-node lnk-accent">{{ t.player }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lnk {
  margin: 22px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.lnk-stage {
  position: relative;
  width: 100%;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 12px;
  padding: 20px 14px 16px;
  background: var(--vp-c-bg-soft);
}
.lnk-stage::before {
  content: attr(data-label);
  position: absolute;
  top: -9px;
  left: 14px;
  padding: 0 8px;
  background: var(--vp-c-bg);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
}

.lnk-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.lnk-node {
  padding: 7px 13px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.82rem;
  font-weight: 600;
  white-space: nowrap;
  transition: transform 0.15s ease, border-color 0.15s ease;
}
.lnk-node:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
}
.lnk-accent {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 1px var(--vp-c-brand-soft), 0 0 16px -6px var(--vp-c-brand-1);
}

/* connector with a traveling packet */
.lnk-arrow {
  position: relative;
  width: 30px;
  height: 2px;
  background: var(--vp-c-divider);
  flex: 0 0 auto;
}
.lnk-arrow::before {
  content: '';
  position: absolute;
  right: -1px;
  top: 50%;
  width: 0;
  height: 0;
  border-left: 5px solid var(--vp-c-divider);
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  transform: translateY(-50%);
}
.lnk-arrow::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  box-shadow: 0 0 8px var(--vp-c-brand-1);
  transform: translate(-50%, -50%);
  animation: lnk-travel 2s linear infinite;
}
.lnk-arrow:nth-of-type(2)::after { animation-delay: 0.4s; }
.lnk-arrow:nth-of-type(3)::after { animation-delay: 0.8s; }
.lnk-arrow:nth-of-type(4)::after { animation-delay: 1.2s; }
@keyframes lnk-travel {
  0% { left: 0; opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  100% { left: 100%; opacity: 0; }
}

/* radio gap with expanding signal waves */
.lnk-radio {
  position: relative;
  height: 58px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lnk-radio-label {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  padding: 2px 10px;
  z-index: 1;
}
.lnk-wave {
  position: absolute;
  width: 22px;
  height: 22px;
  border: 2px solid var(--vp-c-brand-1);
  border-radius: 50%;
  opacity: 0;
  animation: lnk-pulse 2.1s ease-out infinite;
}
.lnk-wave:nth-child(2) { animation-delay: 0.7s; }
.lnk-wave:nth-child(3) { animation-delay: 1.4s; }
@keyframes lnk-pulse {
  0% { transform: scale(0.4); opacity: 0.7; }
  100% { transform: scale(3.4); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .lnk-arrow::after,
  .lnk-wave { animation: none !important; }
  .lnk-arrow::after { display: none; }
  .lnk-wave:first-child { opacity: 0.5; }
}
</style>
