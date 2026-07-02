<script setup lang="ts">
// Компактний згорнутий FAQ-акордеон. Джерело — frontmatter `faq:` сторінки
// (той самий масив, що йде в JSON-LD schema), тож зміст не дублюється.
import { useData } from 'vitepress'
import { computed } from 'vue'

const { frontmatter } = useData()
const items = computed(
  () => (frontmatter.value.faq ?? []) as { q: string; a: string }[]
)
</script>

<template>
  <div class="faq-acc" v-if="items.length">
    <details v-for="(it, i) in items" :key="i" class="faq-item">
      <summary class="faq-q">
        <span>{{ it.q }}</span>
        <svg class="faq-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </summary>
      <div class="faq-a">{{ it.a }}</div>
    </details>
  </div>
</template>

<style scoped>
.faq-acc {
  margin: 18px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
}

.faq-item {
  border-bottom: 1px solid var(--vp-c-divider);
}
.faq-item:last-child {
  border-bottom: none;
}

.faq-q {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  list-style: none;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  transition: background 0.15s ease, color 0.15s ease;
}
.faq-q::-webkit-details-marker {
  display: none;
}
.faq-q:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-brand-1);
}

.faq-chevron {
  flex-shrink: 0;
  color: var(--vp-c-text-3);
  transition: transform 0.2s ease, color 0.15s ease;
}
.faq-item[open] .faq-chevron {
  transform: rotate(180deg);
  color: var(--vp-c-brand-1);
}

.faq-a {
  padding: 0 16px 14px;
  font-size: 0.86rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

@media (prefers-reduced-motion: reduce) {
  .faq-chevron {
    transition: none;
  }
}
</style>
