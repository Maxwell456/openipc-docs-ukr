<script setup>
import { useData } from 'vitepress'
import { computed } from 'vue'

const { lang } = useData()
const label = computed(() => (lang.value.startsWith('en') ? 'Close' : 'Закрити'))

// Closing the mobile nav screen is driven by VitePress's hamburger toggle.
// Since the screen is open, clicking it flips the state back to closed.
function close() {
  document.querySelector('.VPNavBarHamburger')?.click()
}
</script>

<template>
  <button type="button" class="nav-close-btn" @click="close" :aria-label="label">
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
      stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
    <span>{{ label }}</span>
  </button>
</template>
