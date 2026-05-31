<script setup>
import { useData } from 'vitepress'
import { computed } from 'vue'

const { lang, page } = useData()
const isUK = computed(() => lang.value === 'uk-UA')

const basePath = computed(() => {
  let rel = page.value.relativePath.replace(/\.md$/, '')
  if (rel.startsWith('en/')) rel = rel.slice(3)
  if (rel === 'index') return ''
  if (rel.endsWith('/index')) return rel.slice(0, -6)
  return rel
})

const ukPath = computed(() => basePath.value ? `/${basePath.value}` : '/')
const enPath = computed(() => basePath.value ? `/en/${basePath.value}` : '/en/')
</script>

<template>
  <div class="nav-lang-switcher">
    <a :href="ukPath" :class="['nav-lang-btn', { 'nav-lang-btn--active': isUK }]">UKR</a>
    <a :href="enPath" :class="['nav-lang-btn', { 'nav-lang-btn--active': !isUK }]">ENG</a>
  </div>
</template>
