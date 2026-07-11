<script setup>
import { ref } from 'vue'

const props = defineProps({
  url: { type: String, default: 'https://openfpv.com.ua/' },
  title: { type: String, default: 'Поділитися' },
  desc: { type: String, default: '' },
  toast: { type: String, default: 'Посилання скопійовано' }
})

const shown = ref(false)
let timer

async function share() {
  try {
    await navigator.clipboard.writeText(props.url)
  } catch {
    // Fallback for non-secure contexts / older browsers
    const ta = document.createElement('textarea')
    ta.value = props.url
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }
  shown.value = true
  clearTimeout(timer)
  timer = setTimeout(() => (shown.value = false), 2000)
}
</script>

<template>
  <button
    type="button"
    class="doc-nav-item doc-nav-wide"
    :aria-label="`${title}: ${url}`"
    @click="share"
  >
    <span class="doc-nav-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
    </span>
    <span class="doc-nav-body">
      <span class="doc-nav-title">{{ title }}</span>
      <span class="doc-nav-desc">{{ desc }}</span>
    </span>
    <svg class="doc-nav-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
  </button>
  <Transition name="share-toast">
    <div v-if="shown" class="share-toast" role="status" aria-live="polite">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
      {{ toast }}
    </div>
  </Transition>
</template>
