<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()
const isMac = ref(false)

onMounted(() => {
  const p = (navigator.platform || navigator.userAgent || '')
  isMac.value = /Mac|iPhone|iPad|iPod/.test(p)
})

const t = computed(() =>
  lang.value.startsWith('en')
    ? { placeholder: 'Search the documentation…', aria: 'Search', eyebrow: 'Quick search', popular: 'Popular:' }
    : { placeholder: 'Пошук по документації…', aria: 'Пошук', eyebrow: 'Швидкий пошук', popular: 'Популярне:' }
)

// Popular articles — chips link straight to the page (not into search results)
const chips = computed(() => {
  const p = lang.value.startsWith('en') ? '/en' : ''
  return [
    { label: 'APFPV', link: `${p}/software/apfpv` },
    { label: 'WFB-NG', link: `${p}/software/wfb-ng` },
    { label: 'OpenIPC 4G', link: `${p}/software/openipc-4g` },
  ]
})

function openSearch() {
  const btn = document.querySelector<HTMLButtonElement>('#local-search button')
  if (btn) {
    btn.click()
    return
  }
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true }))
}
</script>

<template>
  <div class="hero-search-card">
    <div class="hero-search-aurora" aria-hidden="true"></div>

    <div class="hero-search-inner">
      <span class="hero-search-eyebrow">
        <span class="hero-search-dot" aria-hidden="true"></span>{{ t.eyebrow }}
      </span>

      <button type="button" class="hero-search" :aria-label="t.aria" @click="openSearch">
        <svg class="hero-search-icon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span class="hero-search-text">{{ t.placeholder }}</span>
        <span class="hero-search-keys" aria-hidden="true">
          <kbd>{{ isMac ? '⌘' : 'Ctrl' }}</kbd><kbd>K</kbd>
        </span>
      </button>

      <div class="hero-search-chips">
        <span class="hero-search-chips-label">{{ t.popular }}</span>
        <a v-for="c in chips" :key="c.link" :href="c.link" class="hero-search-chip">
          {{ c.label }}
        </a>
      </div>
    </div>
  </div>
</template>
