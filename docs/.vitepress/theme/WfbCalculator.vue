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

      <!-- FEC -->
      <div class="wfb-calc__row">
        <span class="wfb-calc__label">FEC (fec_k / fec_n)</span>
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
        FEC {{ fec_k }}/{{ fec_n }} = {{ Math.round(fec_k / fec_n * 100) }}%
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
    fecHint: 'Менше k/n — надійніше, але нижчий бітрейт',
    videoLabel: 'Відеобітрейт після FEC',
    hints: ['Замало для FPV', 'Мінімум для FPV', 'Добре для FPV', 'Відмінно для FPV'],
  },
  en: {
    mcsLabel: 'MCS Index (modulation scheme)',
    bwLabel: 'Channel bandwidth',
    giLabel: 'Guard Interval',
    giLong: 'Long (800 ns)',
    giShort: 'Short (400 ns)',
    fecHint: 'Lower k/n = more robust, less bitrate',
    videoLabel: 'Video bitrate after FEC',
    hints: ['Too low for FPV', 'Minimum for FPV', 'Good for FPV', 'Excellent for FPV'],
  },
}

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

const t       = computed(() => lang.value.startsWith('uk') ? T.uk : T.en)
const mcs     = ref(1)
const bw      = ref(20)
const gi      = ref('long')
const fec_k   = ref(8)
const fec_n   = ref(12)

const phyRate = computed(() => MCS_RATES[bw.value][gi.value][mcs.value])

const videoBitrate = computed(() => {
  const k = Math.max(1, Math.min(fec_k.value, fec_n.value))
  const n = Math.max(k, fec_n.value)
  return +(phyRate.value * (k / n)).toFixed(1)
})

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

@media (max-width: 600px) {
  .wfb-calc {
    flex-direction: column;
  }
  .wfb-calc__result {
    width: 100%;
  }
}
</style>
