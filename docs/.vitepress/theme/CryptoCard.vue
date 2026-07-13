<script setup>
import { ref } from 'vue'

const props = defineProps({
  address: { type: String, required: true },
  title: { type: String, required: true },
  hint: { type: String, default: '' },
  copyLabel: { type: String, default: 'Копіювати' },
  copiedLabel: { type: String, default: 'Скопійовано' }
})

const copied = ref(false)
let timer

async function copy() {
  try {
    await navigator.clipboard.writeText(props.address)
  } catch {
    // Fallback for non-secure contexts / older browsers
    const ta = document.createElement('textarea')
    ta.value = props.address
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }
  copied.value = true
  clearTimeout(timer)
  timer = setTimeout(() => (copied.value = false), 2200)
}
</script>

<template>
  <button
    type="button"
    class="doc-nav-item crypto-card"
    :aria-label="`${copyLabel}: ${address}`"
    @click="copy"
  >
    <span class="doc-nav-icon">
      <!-- TRON (TRC) gem in the same stroke style as the other card icons -->
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M4.5 4.5 19.5 7 11.5 20.5 Z"/>
        <path d="M4.5 4.5 10.5 10.5 19.5 7"/>
        <path d="M10.5 10.5 11.5 20.5"/>
      </svg>
    </span>
    <span class="doc-nav-body">
      <span class="doc-nav-title">{{ title }}</span>
      <span class="doc-nav-desc crypto-address">{{ address }}</span>
      <span v-if="hint" class="doc-nav-desc crypto-hint">{{ hint }}</span>
    </span>
    <span class="crypto-copy" :class="{ 'is-copied': copied }">
      <svg v-if="!copied" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
      <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
      {{ copied ? copiedLabel : copyLabel }}
    </span>
  </button>
</template>
