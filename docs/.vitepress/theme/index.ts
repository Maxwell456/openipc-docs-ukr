import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import NotFound from './NotFound.vue'
import LangSwitcher from './LangSwitcher.vue'
import BackToTop from './BackToTop.vue'
import ReportError from './ReportError.vue'
import Helpful from './Helpful.vue'
import SupportNote from './SupportNote.vue'
import HeroSearch from './HeroSearch.vue'
import CloseMenu from './CloseMenu.vue'
import WfbCalculator from './WfbCalculator.vue'
import FpvLinkDiagram from './FpvLinkDiagram.vue'
import FiberLinkDiagram from './FiberLinkDiagram.vue'
import Faq from './Faq.vue'
import LatestUpdates from './LatestUpdates.vue'
import UpdatesList from './UpdatesList.vue'
import CryptoCard from './CryptoCard.vue'
import ShareCard from './ShareCard.vue'
import '@fontsource-variable/inter'
import './custom.css'

const inBrowser = typeof window !== 'undefined'
const reduceMotion = () =>
  inBrowser && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ---- Top route-change progress bar (telemetry sweep) ---- */
function setupProgress(router: any) {
  const bar = document.createElement('div')
  bar.className = 'fpv-progress'
  document.body.appendChild(bar)
  let timer: number | undefined

  router.onBeforeRouteChange = () => {
    window.clearTimeout(timer)
    bar.classList.add('fpv-on')
    bar.style.width = '0%'
    requestAnimationFrame(() => (bar.style.width = '75%'))
  }
  router.onAfterRouteChange = () => {
    bar.style.width = '100%'
    timer = window.setTimeout(() => {
      bar.classList.remove('fpv-on')
      bar.style.width = '0%'
    }, 280)
    requestAnimationFrame(() => requestAnimationFrame(initPageFx))
  }
}

/* ---- Click-to-zoom for content images (OSD lightbox) ---- */
let zoomEl: HTMLDivElement | null = null
function closeZoom() {
  if (!zoomEl) return
  const el = zoomEl
  el.classList.remove('fpv-on')
  setTimeout(() => el.remove(), 200)
  zoomEl = null
}
function openZoom(src: string, alt: string) {
  closeZoom()
  const overlay = document.createElement('div')
  overlay.className = 'fpv-zoom'
  const img = document.createElement('img')
  img.src = src
  img.alt = alt
  overlay.appendChild(img)
  overlay.addEventListener('click', closeZoom)
  document.body.appendChild(overlay)
  zoomEl = overlay
  requestAnimationFrame(() => overlay.classList.add('fpv-on'))
}

/* ---- Card 3D tilt ---- */
function attachTilt(card: HTMLElement) {
  if (reduceMotion()) return
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    card.style.transform = `perspective(800px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateY(-3px)`
  })
  card.addEventListener('mouseleave', () => {
    card.style.transform = ''
  })
}

/* ---- Reveal-on-scroll for cards ---- */
let io: IntersectionObserver | null = null
function getObserver() {
  if (io) return io
  io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (en.isIntersecting) {
          en.target.classList.add('fpv-in')
          io!.unobserve(en.target)
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px' }
  )
  return io
}

/* ---- Per-page initialisation (idempotent, re-run after navigation) ---- */
function initPageFx() {
  if (!inBrowser) return

  document.querySelectorAll<HTMLImageElement>('.vp-doc img').forEach((img) => {
    if (img.dataset.fpvZoom || img.closest('a')) return
    img.dataset.fpvZoom = '1'
    img.addEventListener('click', () => openZoom(img.currentSrc || img.src, img.alt))
  })

  document.querySelectorAll<HTMLElement>('.fpv-card').forEach((card) => {
    if (card.dataset.fpvInit) return
    card.dataset.fpvInit = '1'
    attachTilt(card)
    if (reduceMotion()) return
    card.classList.add('fpv-reveal')
    getObserver().observe(card)
  })
}

/* ---- Local-search analytics: send the settled query to GA4 ---- */
// VitePress local search is client-side (no ?q= in the URL), so GA4's built-in
// site search never fires. We forward the settled query as a `search` event
// with a `search_term` param — the GA4 custom dimension `search_term` picks it
// up. Debounced so we log the query the user settled on, not every keystroke.
function setupSearchTracking() {
  let timer: number | undefined
  let last = ''
  document.addEventListener(
    'input',
    (e) => {
      const el = e.target as HTMLElement | null
      if (!(el instanceof HTMLInputElement)) return
      if (!el.closest('.VPLocalSearchBox')) return
      const q = el.value.trim()
      window.clearTimeout(timer)
      if (q.length < 3) return
      timer = window.setTimeout(() => {
        if (q === last) return
        last = q
        const gtag = (window as any).gtag
        if (typeof gtag === 'function') {
          gtag('event', 'search', { search_term: q, page_path: location.pathname })
        }
      }, 900)
    },
    true
  )
}

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
    if (inBrowser) {
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js').catch(() => {})
        })
      }
      setupProgress(router)
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeZoom()
      })
      window.addEventListener('load', initPageFx)
      setupSearchTracking()
    }
    app.component('WfbCalculator', WfbCalculator)
    app.component('FpvLinkDiagram', FpvLinkDiagram)
    app.component('FiberLinkDiagram', FiberLinkDiagram)
    app.component('Faq', Faq)
    app.component('LatestUpdates', LatestUpdates)
    app.component('UpdatesList', UpdatesList)
    app.component('CryptoCard', CryptoCard)
    app.component('ShareCard', ShareCard)
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'not-found': () => h(NotFound),
      'nav-bar-content-after': () => h(LangSwitcher),
      'nav-screen-content-after': () => [h(LangSwitcher), h(CloseMenu)],
      'home-hero-image': () => h(HeroSearch),
      'layout-bottom': () => h(BackToTop),
      'doc-after': () => [h(Helpful), h(SupportNote), h(ReportError)]
    })
  }
}
