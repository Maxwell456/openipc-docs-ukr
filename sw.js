// Cache version — update this string on every release to force cache invalidation
const CACHE = 'openfpv-v2'

const PRECACHE = [
  '/',
  '/en/',
  '/manifest.json',
  '/favicon.svg',
]

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return
  const url = new URL(e.request.url)

  // Only handle same-origin requests — never intercept third-party (GA, YouTube, etc.)
  if (url.origin !== self.location.origin) return

  // Network-first for HTML navigation — always try to get fresh content
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const clone = res.clone()
          caches.open(CACHE).then((c) => c.put(e.request, clone))
          return res
        })
        .catch(() => caches.match(e.request).then((cached) => cached || caches.match('/')))
    )
    return
  }

  // Cache-first for versioned static assets (VitePress hashes filenames)
  if (/\.(css|js|woff2?|png|svg|jpg|webp|ico)$/.test(url.pathname)) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        if (cached) return cached
        return fetch(e.request).then((res) => {
          // Only cache successful same-origin responses
          if (res.ok) {
            const clone = res.clone()
            caches.open(CACHE).then((c) => c.put(e.request, clone))
          }
          return res
        })
      })
    )
  }
})
