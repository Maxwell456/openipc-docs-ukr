<script setup lang="ts">
// Три останні пости оновлень на головній. Дані — з posts.data.mts
// (вже відсортовані: новіші зверху), тож тут лише фільтр локалі та зріз.
import { computed } from 'vue'
import { data as posts } from './posts.data'

const latest = computed(() => posts.filter((p) => p.lang === 'uk').slice(0, 3))

function fmt(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}
</script>

<template>
  <div class="hv2-updates">
    <a v-for="p in latest" :key="p.url" class="hv2-update" :href="p.url">
      <time class="hv2-update-date" :datetime="p.date">{{ fmt(p.date) }}</time>
      <span class="hv2-update-title">{{ p.title }}</span>
      <svg class="hv2-update-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
    </a>
  </div>
</template>

<!-- Стилі рядків (.hv2-update*) — спільні з UpdatesList.vue, живуть
     у custom.css, секція "Updates list". -->
