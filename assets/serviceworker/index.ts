let version = 'version'

self.addEventListener('install', event => {
  console.log('[ServiceWorker] Installed version:', version)
  event.waitUntil(
    caches
      .open(version)
      .then(cache =>
        cache.addAll([
          '/app/',
          '/app/index.html',
          '/app/images/icon192.png',
          '/app/images/icon512.png',
          '/app/manifest.json',
          '/app/global.css',
          '/app/app.css',
          '/app/app.js'
        ])
      )
      .then(_ => {
        console.log('[ServiceWorker] Skip waiting on install')
        return self.skipWaiting()
      })
  )
})

const updateCache = () =>
  // Just for debugging, list all controlled clients.
  self.clients
    .matchAll({ includeUncontrolled: true })
    .then(clientList => {
      const urls = clientList.map(client => client.url)
      console.log('[ServiceWorker] Matching clients:', urls.join(', '))
    })
    // Delete old cache entries that don’t match the current version.
    .then(_ => caches.keys())
    .then(cacheNames =>
      Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== version) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
          return undefined
        })
      )
    )
    .then(updateVersion)
    // claim() sets this worker as the active worker for all clients that match the workers
    // scope and triggers an oncontrollerchange event for the clients.
    .then(_ => {
      console.log('[ServiceWorker] Claiming clients for version', version)
      return self.clients.claim()
    })

const updateVersion = (): Promise<void> =>
  // fetch('/api/serviceworker/version')
  //   .then(response => response.text())
  Promise.resolve(`v${Date.now()}`).then(newVersion => {
    console.log('[ServiceWorker] fetchVersion, newVersion:', newVersion)
    version = newVersion
  })

self.addEventListener('activate', event => event.waitUntil(updateCache()))

self.addEventListener('fetch', event => {
  if (event.request.method === 'GET' && event.request.url.includes('/app/update')) {
    event.respondWith(
      updateCache().then(_ => new Response(version, { headers: { 'content-type': 'text/plain' } }))
    )
  } else {
    event.respondWith(
      caches.match(event.request).then(response => {
        // caches.match() always resolves
        // but in case of success response will have value
        if (response !== undefined) {
          return response
        } else {
          return fetch(event.request).then((response: Response) => {
            // response may be used only once
            // we need to save clone to put one copy in cache
            // and serve second one
            let responseClone = response.clone()
            caches.open(version).then(cache => cache.put(event.request, responseClone))
            return response
          })
        }
      })
    )
  }
})

export default null
