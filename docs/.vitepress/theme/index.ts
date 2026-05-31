import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import NotFound from './NotFound.vue'
import LangSwitcher from './LangSwitcher.vue'
import BackToTop from './BackToTop.vue'
import ReportError from './ReportError.vue'
import HeroSearch from './HeroSearch.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp() {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {})
      })
    }
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'not-found': () => h(NotFound),
      'nav-bar-content-after': () => h(LangSwitcher),
      'nav-screen-content-after': () => h(LangSwitcher),
      'home-hero-image': () => h(HeroSearch),
      'layout-bottom': () => h(BackToTop),
      'doc-after': () => h(ReportError)
    })
  }
}
