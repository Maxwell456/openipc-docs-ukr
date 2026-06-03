<script setup lang="ts">
import { ref, shallowRef, computed, markRaw, onMounted, onBeforeUnmount } from 'vue'
import { useData, useRouter, withBase } from 'vitepress'
import MiniSearch from 'minisearch'

const { lang, localeIndex } = useData()
const router = useRouter()

const t = computed(() =>
  lang.value.startsWith('en')
    ? { placeholder: 'Search the documentation', aria: 'Search', eyebrow: 'Quick search', popular: 'Popular:', empty: 'Nothing found for' }
    : { placeholder: 'Пошук по документації', aria: 'Пошук', eyebrow: 'Швидкий пошук', popular: 'Популярне:', empty: 'Нічого не знайдено за запитом' }
)

const chips = computed(() => {
  const p = lang.value.startsWith('en') ? '/en' : ''
  return [
    { label: 'APFPV', link: `${p}/software/apfpv` },
    { label: 'WFB-NG', link: `${p}/software/wfb-ng` },
    { label: 'OpenIPC 4G', link: `${p}/software/openipc-4g` },
    { label: 'Venc', link: `${p}/software/waybeam-venc` },
  ]
})

interface Result { id: string; title: string; titles: string[] }

const index = shallowRef<MiniSearch<Result> | null>(null)
const query = ref('')
const open = ref(false)
const root = ref<HTMLElement | null>(null)

onMounted(async () => {
  try {
    // @ts-ignore - virtual module provided by VitePress
    const mod = await import('@localSearchIndex')
    const json = (await mod.default[localeIndex.value]?.())?.default
    if (!json) return
    index.value = markRaw(
      MiniSearch.loadJSON<Result>(json, {
        fields: ['title', 'titles', 'text'],
        storeFields: ['title', 'titles'],
        searchOptions: {
          fuzzy: 0.2,
          prefix: true,
          boost: { title: 4, text: 2, titles: 1 },
          boostDocument: (id: any) =>
            typeof id === 'string' && id.includes('/updates/') ? 0.2 : 1,
        },
      })
    )
  } catch {
    /* search index unavailable — chips still work */
  }
  document.addEventListener('click', onDocClick)
})

onBeforeUnmount(() => document.removeEventListener('click', onDocClick))

const results = computed<Result[]>(() => {
  const q = query.value.trim()
  if (!index.value || !q) return []
  return index.value.search(q).slice(0, 8) as unknown as Result[]
})

function onDocClick(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false
}

function go(id: string) {
  open.value = false
  query.value = ''
  router.go(withBase(id))
}

function onEnter() {
  if (results.value.length) go(results.value[0].id)
}
</script>

<template>
  <div class="hero-search-card" ref="root">
    <div class="hero-search-aurora" aria-hidden="true"></div>

    <div class="hero-search-inner">
      <span class="hero-search-eyebrow">
        <span class="hero-search-dot" aria-hidden="true"></span>{{ t.eyebrow }}
      </span>

      <div class="hero-search-fieldwrap">
        <div class="hero-search-field">
          <svg class="hero-search-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            class="hero-search-input"
            type="search"
            :placeholder="t.placeholder"
            :aria-label="t.aria"
            v-model="query"
            @focus="open = true"
            @keydown.enter="onEnter"
            @keydown.esc="query = ''"
          />
        </div>

        <ul v-if="open && results.length" class="hero-search-results">
          <li v-for="r in results" :key="r.id">
            <a :href="withBase(r.id)" @click.prevent="go(r.id)">
              <span class="r-title">{{ r.title }}</span>
              <span v-if="r.titles && r.titles.length" class="r-crumbs">{{ r.titles.join(' › ') }}</span>
            </a>
          </li>
        </ul>

        <div v-else-if="open && query.trim()" class="hero-search-empty">
          {{ t.empty }} «{{ query.trim() }}»
        </div>
      </div>

      <div class="hero-search-chips">
        <span class="hero-search-chips-label">{{ t.popular }}</span>
        <a v-for="c in chips" :key="c.link" :href="c.link" class="hero-search-chip">{{ c.label }}</a>
      </div>
    </div>
  </div>
</template>
