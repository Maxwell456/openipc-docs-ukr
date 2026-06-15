<script setup>
import { useData } from 'vitepress'
import { computed, ref, watch } from 'vue'

const { lang, page } = useData()
const isUK = computed(() => lang.value === 'uk-UA')

const t = computed(() =>
  isUK.value
    ? { q: 'Чи була ця сторінка корисною?', yes: 'Так', no: 'Ні', thanks: 'Дякуємо за відгук!' }
    : { q: 'Was this page helpful?', yes: 'Yes', no: 'No', thanks: 'Thanks for your feedback!' }
)

const voted = ref(null)
const keyFor = () => 'fpv-helpful:' + page.value.relativePath

watch(
  () => page.value.relativePath,
  () => {
    voted.value = typeof localStorage !== 'undefined' ? localStorage.getItem(keyFor()) : null
  },
  { immediate: true }
)

function vote(v) {
  if (voted.value) return
  voted.value = v
  try {
    localStorage.setItem(keyFor(), v)
  } catch {}
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'page_helpful', {
      helpful: v,
      page_path: location.pathname,
      page_title: document.title
    })
  }
}
</script>

<template>
  <div class="fpv-helpful">
    <template v-if="!voted">
      <span class="fpv-helpful-q">{{ t.q }}</span>
      <button class="fpv-helpful-btn" @click="vote('yes')" :aria-label="t.yes">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
        </svg>
        {{ t.yes }}
      </button>
      <button class="fpv-helpful-btn" @click="vote('no')" :aria-label="t.no">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
        </svg>
        {{ t.no }}
      </button>
    </template>
    <span v-else class="fpv-helpful-thanks">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      {{ t.thanks }}
    </span>
  </div>
</template>

<style scoped>
.fpv-helpful {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 40px 0 8px;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}
.fpv-helpful-q {
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.fpv-helpful-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 16px;
  border-radius: 9px;
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
}
.fpv-helpful-btn:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}
.fpv-helpful-thanks {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}
</style>
