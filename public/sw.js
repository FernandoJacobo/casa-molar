/* Casa Molar (demo): deja el cronómetro de cepillado disponible sin conexión. */
const CACHE = 'casa-molar-v1'

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['/cepillado', '/favicon.svg'])).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()))
})

self.addEventListener('fetch', (e) => {
  const { request } = e
  const url = new URL(request.url)
  if (request.method !== 'GET' || url.origin !== location.origin) return

  // Archivos con hash: primero caché.
  if (url.pathname.startsWith('/_nuxt/') || url.pathname.startsWith('/_fonts/')) {
    e.respondWith(caches.match(request).then(r => r || fetch(request).then((res) => {
      const copia = res.clone()
      caches.open(CACHE).then(c => c.put(request, copia))
      return res
    })))
    return
  }

  // Páginas: primero red, y si no hay, la copia guardada.
  if (request.mode === 'navigate') {
    e.respondWith(fetch(request).then((res) => {
      const copia = res.clone()
      caches.open(CACHE).then(c => c.put(request, copia))
      return res
    }).catch(() => caches.match(request)))
  }
})
