const CACHE = 'otakuflix-v1'
const STATIC = ['/', '/index.html', '/manifest.json']

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()))
})

self.addEventListener('fetch', e => {
  const { request } = e
  // Cache-first for same-origin, network-first for TMDB images
  if (request.url.includes('image.tmdb.org')) {
    e.respondWith(
      caches.open(CACHE).then(async cache => {
        const cached = await cache.match(request)
        if (cached) return cached
        try {
          const res = await fetch(request)
          if (res.ok) cache.put(request, res.clone())
          return res
        } catch { return cached || new Response('', { status: 404 }) }
      })
    )
  } else if (request.destination === 'document' || request.destination === 'script' || request.destination === 'style') {
    e.respondWith(
      caches.match(request).then(cached => cached || fetch(request))
    )
  }
})
