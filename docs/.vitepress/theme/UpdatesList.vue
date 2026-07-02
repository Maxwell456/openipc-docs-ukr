<script setup lang="ts">
// Повний список постів оновлень, згрупований за роками (новіші зверху).
// Локаль сторінки визначає, які пости показувати (укр чи en).
import { computed } from 'vue'
import { useData } from 'vitepress'
import { data as posts } from './posts.data'
import type { UpdatePost } from './posts.data'

const { lang } = useData()

const groups = computed(() => {
  const isEn = lang.value.startsWith('en')
  const list = posts.filter((p) => p.lang === (isEn ? 'en' : 'uk'))
  const out: { year: string; items: UpdatePost[] }[] = []
  for (const p of list) {
    const year = p.date.slice(0, 4)
    const last = out[out.length - 1]
    if (last && last.year === year) last.items.push(p)
    else out.push({ year, items: [p] })
  }
  return out
})

function fmt(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}
</script>

<template>
  <section v-for="g in groups" :key="g.year">
    <h2 :id="g.year">{{ g.year }}</h2>
    <div class="hv2-updates">
      <a v-for="p in g.items" :key="p.url" class="hv2-update" :href="p.url">
        <time class="hv2-update-date" :datetime="p.date">{{ fmt(p.date) }}</time>
        <span class="hv2-update-title">{{ p.title }}</span>
        <svg class="hv2-update-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
      </a>
    </div>
  </section>
</template>

<!-- Стилі рядків (.hv2-update*) — спільні з LatestUpdates.vue, живуть
     у custom.css, секція "Updates list". -->
