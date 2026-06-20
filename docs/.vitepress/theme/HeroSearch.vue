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

// Rotating example queries shown as a decorative placeholder when the
// field is idle — a small "show, don't just tell" touch that hints at
// what's searchable without the user having to guess. Each phrase is
// pulled straight from a real page title so it's guaranteed to surface
// a result, not a guess at what might be documented.
const examples = computed(() =>
  lang.value.startsWith('en')
    ? [
        'Search the documentation',
        'Try "WFB-NG configuration"',
        'Try "Building an FPV drone"',
        'Try "Waybeam Venc"',
        'Try "QuadroFleet 4G/LTE"',
      ]
    : [
        'Пошук по документації',
        'Напр. «WFB-NG конфігурація»',
        'Напр. «Збірка та налаштування дрона»',
        'Напр. «Waybeam Venc»',
        'Напр. «QuadroFleet 4G/LTE»',
      ]
)
const placeholderIndex = ref(0)
const dynamicPlaceholder = computed(() => examples.value[placeholderIndex.value % examples.value.length])
let placeholderTimer: number | undefined

const chips = computed(() => {
  const p = lang.value.startsWith('en') ? '/en' : ''
  return [
    { label: 'APFPV', link: `${p}/software/apfpv`, color: '#3d6aff' },
    { label: 'WFB-NG', link: `${p}/software/wfb-ng`, color: '#6f4dff' },
    { label: 'OpenIPC 4G', link: `${p}/software/openipc-4g`, color: '#22c55e' },
    { label: 'Waybeam Venc', link: `${p}/software/waybeam-venc`, color: '#f59e0b' },
  ]
})

interface Result { id: string; title: string; titles: string[] }

const index = shallowRef<MiniSearch<Result> | null>(null)
const query = ref('')
const open = ref(false)
const focused = ref(false)
const root = ref<HTMLElement | null>(null)
const input = ref<HTMLInputElement | null>(null)

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
  document.addEventListener('keydown', onGlobalKeydown)
  placeholderTimer = window.setInterval(() => {
    if (focused.value || query.value) return
    placeholderIndex.value++
  }, 2800)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onGlobalKeydown)
  window.clearInterval(placeholderTimer)
})

// Pressing "/" anywhere on the page jumps focus to the search field —
// the same convention GitHub, Linear and most modern doc sites use.
function onGlobalKeydown(e: KeyboardEvent) {
  if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return
  const target = e.target as HTMLElement
  const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
  if (isTyping) return
  e.preventDefault()
  input.value?.focus()
}

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
  <div class="hero-search" ref="root">
    <div class="hero-search-fieldwrap">
      <div class="hero-search-field" :class="{ 'is-focused': focused }">
        <span class="hero-search-icon-well">
          <svg class="hero-search-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <div class="hero-search-input-wrap">
          <input
            ref="input"
            class="hero-search-input"
            type="search"
            placeholder=""
            :aria-label="t.aria"
            v-model="query"
            @focus="open = true; focused = true"
            @blur="focused = false"
            @keydown.enter="onEnter"
            @keydown.esc="($event.target as HTMLInputElement).blur(); query = ''"
          />
          <Transition name="ph-fade" mode="out-in">
            <span
              v-if="!focused && !query"
              :key="placeholderIndex % examples.length"
              class="hero-search-placeholder-cycle"
              aria-hidden="true"
            >{{ dynamicPlaceholder }}</span>
          </Transition>
        </div>
        <Transition name="kbd-fade" mode="out-in">
          <kbd class="hero-search-kbd" :key="focused ? 'esc' : 'slash'">{{ focused ? 'esc' : '/' }}</kbd>
        </Transition>
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
      <a v-for="c in chips" :key="c.link" :href="c.link" class="hero-search-chip">
        <span class="hero-search-chip-dot" :style="{ background: c.color, color: c.color }" aria-hidden="true"></span>
        {{ c.label }}
      </a>
    </div>
  </div>
</template>
