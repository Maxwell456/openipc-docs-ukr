<template>
  <div class="wfb-calc">
    <div class="wfb-calc__inputs">

      <!-- MCS Index -->
      <div class="wfb-calc__row">
        <span class="wfb-calc__label">{{ t.mcsLabel }}</span>
        <div class="wfb-calc__btns">
          <button
            v-for="i in 8" :key="i - 1"
            class="wfb-calc__btn"
            :class="{ 'wfb-calc__btn--active': mcs === i - 1 }"
            @click="mcs = i - 1"
          >{{ i - 1 }}</button>
        </div>
        <small class="wfb-calc__sub">{{ MCS_LABELS[mcs] }}</small>
      </div>

      <!-- Bandwidth -->
      <div class="wfb-calc__row">
        <span class="wfb-calc__label">{{ t.bwLabel }}</span>
        <div class="wfb-calc__btns">
          <button class="wfb-calc__btn" :class="{ 'wfb-calc__btn--active': bw === 20 }" @click="bw = 20">20 MHz</button>
          <button class="wfb-calc__btn" :class="{ 'wfb-calc__btn--active': bw === 40 }" @click="bw = 40">40 MHz</button>
        </div>
      </div>

      <!-- Guard Interval -->
      <div class="wfb-calc__row">
        <span class="wfb-calc__label">{{ t.giLabel }}</span>
        <div class="wfb-calc__btns">
          <button class="wfb-calc__btn" :class="{ 'wfb-calc__btn--active': gi === 'long' }" @click="gi = 'long'">{{ t.giLong }}</button>
          <button class="wfb-calc__btn" :class="{ 'wfb-calc__btn--active': gi === 'short' }" @click="gi = 'short'">{{ t.giShort }}</button>
        </div>
      </div>

      <!-- FEC presets -->
      <div class="wfb-calc__row">
        <span class="wfb-calc__label">{{ t.fecPresetsLabel }}</span>
        <div class="wfb-calc__btns">
          <button
            v-for="p in FEC_PRESETS" :key="p.k + '/' + p.n"
            class="wfb-calc__btn"
            :class="{ 'wfb-calc__btn--active': fec_k === p.k && fec_n === p.n }"
            @click="fec_k = p.k; fec_n = p.n"
          >{{ t.fecPresets[p.key] }} ({{ p.k }}/{{ p.n }})</button>
        </div>
      </div>

      <!-- FEC sliders -->
      <div class="wfb-calc__row">
        <div class="wfb-calc__fec">
          <div class="wfb-calc__fec-group">
            <code>fec_k</code>
            <input type="range" v-model.number="fec_k" min="1" :max="fec_n" step="1" />
            <strong>{{ fec_k }}</strong>
          </div>
          <span class="wfb-calc__fec-sep">/</span>
          <div class="wfb-calc__fec-group">
            <code>fec_n</code>
            <input type="range" v-model.number="fec_n" :min="fec_k" max="16" step="1" />
            <strong>{{ fec_n }}</strong>
          </div>
        </div>
        <small class="wfb-calc__sub">{{ t.fecHint }}</small>

        <!-- FEC overhead bar -->
        <div class="wfb-calc__bar-wrap">
          <div class="wfb-calc__bar-video" :style="{ width: fecRatio * 100 + '%' }">
            <span>{{ t.videoLabel }}</span>
          </div>
          <div class="wfb-calc__bar-overhead">
            <span>FEC</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Result -->
    <div class="wfb-calc__result" :style="{ borderColor: tierColor }">
      <div class="wfb-calc__result-phy">PHY: {{ phyRate }} Mbps</div>
      <div class="wfb-calc__result-label">{{ t.videoLabel }}</div>
      <div class="wfb-calc__result-value" :style="{ color: tierColor }">
        {{ videoBitrate }}<span class="wfb-calc__unit"> Mbps</span>
      </div>
      <div class="wfb-calc__result-hint" :style="{ color: tierColor }">{{ tierHint }}</div>
      <div class="wfb-calc__result-fec">
        FEC {{ fec_k }}/{{ fec_n }} · {{ Math.round(fecRatio * 100) }}% {{ t.ofPhy }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()

const T = {
  uk: {
    mcsLabel: 'MCS Index (схема модуляції)',
    bwLabel: 'Ширина каналу',
    giLabel: 'Guard Interval',
    giLong: 'Long (800 нс)',
    giShort: 'Short (400 нс)',
    fecPresetsLabel: 'FEC — швидкий вибір',
    fecPresets: { conservative: 'Консерв.', default: 'Стандарт', aggressive: 'Агресивно' },
    fecHint: 'Менше k/n — надійніше, але нижчий бітрейт',
    videoLabel: 'Відеобітрейт',
    ofPhy: 'від PHY',
    hints: ['Замало для FPV', 'Мінімум для FPV', 'Добре для FPV', 'Відмінно для FPV'],
  },
  en: {
    mcsLabel: 'MCS Index (modulation scheme)',
    bwLabel: 'Channel bandwidth',
    giLabel: 'Guard Interval',
    giLong: 'Long (800 ns)',
    giShort: 'Short (400 ns)',
    fecPresetsLabel: 'FEC — quick select',
    fecPresets: { conservative: 'Conservative', default: 'Balanced', aggressive: 'Aggressive' },
    fecHint: 'Lower k/n = more robust, less bitrate',
    videoLabel: 'Video bitrate',
    ofPhy: 'of PHY',
    hints: ['Too low for FPV', 'Minimum for FPV', 'Good for FPV', 'Excellent for FPV'],
  },
}

const FEC_PRESETS = [
  { key: 'conservative', k: 4,  n: 12 },
  { key: 'default',      k: 8,  n: 12 },
  { key: 'aggressive',   k: 11, n: 12 },
]

const MCS_LABELS = [
  'BPSK 1/2', 'QPSK 1/2', 'QPSK 3/4',
  '16-QAM 1/2', '16-QAM 3/4', '64-QAM 2/3',
  '64-QAM 3/4', '64-QAM 5/6',
]

const MCS_RATES = {
  20: {
    long:  [6.5, 13.0, 19.5, 26.0, 39.0,  52.0,  58.5,  65.0],
    short: [7.2, 14.4, 21.7, 28.9, 43.3,  57.8,  65.0,  72.2],
  },
  40: {
    long:  [13.5, 27.0, 40.5, 54.0,  81.0, 108.0, 121.5, 135.0],
    short: [15.0, 30.0, 45.0, 60.0,  90.0, 120.0, 135.0, 150.0],
  },
}

const t     = computed(() => lang.value.startsWith('uk') ? T.uk : T.en)
const mcs   = ref(1)
const bw    = ref(20)
const gi    = ref('long')
const fec_k = ref(8)
const fec_n = ref(12)

const phyRate = computed(() => MCS_RATES[bw.value][gi.value][mcs.value])

const fecRatio = computed(() => {
  const k = Math.max(1, Math.min(fec_k.value, fec_n.value))
  const n = Math.max(k, fec_n.value)
  return k / n
})

const videoBitrate = computed(() => +(phyRate.value * fecRatio.value).toFixed(1))

const TIERS = [
  { max: 8,        color: '#ef4444' },
  { max: 15,       color: '#f59e0b' },
  { max: 25,       color: '#22c55e' },
  { max: Infinity, color: '#3d6aff' },
]

const tierIdx   = computed(() => TIERS.findIndex(tier => videoBitrate.value < tier.max))
const tierColor = computed(() => TIERS[Math.max(0, tierIdx.value)].color)
const tierHint  = computed(() => t.value.hints[Math.max(0, tierIdx.value)])
</script>

<style scoped>
.wfb-calc {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  padding: 1.25rem;
  margin: 1.5rem 0;
  background: var(--vp-c-bg-soft);
}
.wfb-calc__inputs {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
.wfb-calc__row {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.wfb-calc__label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-2);
}
.wfb-calc__sub {
  font-size: 0.73rem;
  color: var(--vp-c-text-2);
}
.wfb-calc__btns {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.wfb-calc__btn {
  padding: 4px 11px;
  border-radius: 5px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.84rem;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}
.wfb-calc__btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.wfb-calc__btn--active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #fff !important;
}
.wfb-calc__fec {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.wfb-calc__fec-group {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.84rem;
}
.wfb-calc__fec-group code {
  color: var(--vp-c-text-2);
  font-size: 0.78rem;
  background: none;
  padding: 0;
}
.wfb-calc__fec-group strong {
  min-width: 22px;
  text-align: right;
}
.wfb-calc__fec-group input[type="range"] {
  width: 90px;
  accent-color: var(--vp-c-brand-1);
  cursor: pointer;
}
.wfb-calc__fec-sep {
  font-size: 1.2rem;
  color: var(--vp-c-text-2);
  font-weight: 300;
}

/* FEC overhead bar */
.wfb-calc__bar-wrap {
  display: flex;
  height: 22px;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 4px;
  font-size: 0.7rem;
  font-weight: 600;
}
.wfb-calc__bar-video {
  background: var(--vp-c-brand-1);
  display: flex;
  align-items: center;
  padding: 0 6px;
  color: #fff;
  transition: width 0.3s;
  white-space: nowrap;
  overflow: hidden;
}
.wfb-calc__bar-overhead {
  flex: 1;
  background: var(--vp-c-bg-mute, #2a2b3d);
  display: flex;
  align-items: center;
  padding: 0 6px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

/* Result panel */
.wfb-calc__result {
  min-width: 175px;
  border: 2px solid;
  border-radius: 10px;
  padding: 1rem 1.25rem;
  text-align: center;
  transition: border-color 0.3s;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.wfb-calc__result-phy {
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
}
.wfb-calc__result-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-2);
  margin-top: 0.5rem;
}
.wfb-calc__result-value {
  font-size: 2.4rem;
  font-weight: 800;
  line-height: 1.1;
  transition: color 0.3s;
}
.wfb-calc__unit {
  font-size: 1rem;
  font-weight: 400;
}
.wfb-calc__result-hint {
  font-size: 0.8rem;
  font-weight: 700;
  margin-top: 0.35rem;
  transition: color 0.3s;
}
.wfb-calc__result-fec {
  font-size: 0.73rem;
  color: var(--vp-c-text-2);
  margin-top: 0.5rem;
}

@media (max-width: 640px) {
  .wfb-calc {
    flex-direction: column;
  }
  .wfb-calc__result {
    width: 100%;
  }
  .wfb-calc__fec-group input[type="range"] {
    width: 110px;
  }
}
</style>
