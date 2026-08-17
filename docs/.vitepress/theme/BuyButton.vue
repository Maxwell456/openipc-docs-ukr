<script setup>
import { useData } from 'vitepress'
import { computed } from 'vue'

// CTA на сторінках заліза. Підпис береться з локалі сторінки, тож у markdown
// лишається тільки посилання — `label` перекриває його для нестандартних
// випадків («Купити на AliExpress» тощо).
const props = defineProps({
  href: { type: String, required: true },
  label: { type: String, default: '' }
})

const { lang } = useData()
const isUK = computed(() => lang.value === 'uk-UA')
const text = computed(() => props.label || (isUK.value ? 'Купити зараз' : 'Buy now'))
</script>

<template>
  <!-- rel: nofollow+sponsored — партнерське посилання не має передавати вагу
       (вимога Google для афіліат-лінків); noopener — бо target="_blank". -->
  <a class="buy-btn" :href="href" target="_blank" rel="nofollow sponsored noopener">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
    {{ text }}
  </a>
</template>
