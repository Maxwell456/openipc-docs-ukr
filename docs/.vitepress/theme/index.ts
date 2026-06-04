import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import NotFound from './NotFound.vue'
import LangSwitcher from './LangSwitcher.vue'
import BackToTop from './BackToTop.vue'
import ReportError from './ReportError.vue'
import HeroSearch from './HeroSearch.vue'
import CloseMenu from './CloseMenu.vue'
import WfbCalculator from './WfbCalculator.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {})
      })
    }
    app.component('WfbCalculator', WfbCalculator)
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'not-found': () => h(NotFound),
      'nav-bar-content-after': () => h(LangSwitcher),
      'nav-screen-content-after': () => [h(LangSwitcher), h(CloseMenu)],
      'home-hero-image': () => h(HeroSearch),
      'layout-bottom': () => h(BackToTop),
      'doc-after': () => h(ReportError)
    })
  }
}
