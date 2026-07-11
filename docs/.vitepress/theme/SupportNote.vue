<script setup>
import { useData } from 'vitepress'
import { computed } from 'vue'

const { lang, page } = useData()
const isUK = computed(() => lang.value === 'uk-UA')

const link  = computed(() => (isUK.value ? '/support' : '/en/support'))
const title = computed(() => (isUK.value ? 'Підтримати проєкт' : 'Support the project'))
const desc  = computed(() => (isUK.value
  ? 'Документація безкоштовна й тримається на спільноті.'
  : 'The docs are free and community-run.'))
const btn   = computed(() => (isUK.value ? 'Підтримати' : 'Support'))

// Don't show the prompt on the support page itself
const hide = computed(() => /(^|\/)support\.md$/.test(page.value.relativePath))
</script>

<template>
  <div v-if="!hide" class="support-cta-wrap">
    <a class="support-cta" :href="link">
      <span class="support-cta-icon">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </span>
      <span class="support-cta-body">
        <span class="support-cta-title">{{ title }}</span>
        <span class="support-cta-desc">{{ desc }}</span>
      </span>
      <span class="support-cta-btn">{{ btn }}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
      </span>
    </a>
  </div>
</template>
