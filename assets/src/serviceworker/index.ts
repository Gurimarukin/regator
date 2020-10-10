import * as localforage from 'localforage'

import { config } from '../shared/config'

const VERSION = 'version'
const versionStore = localforage.createInstance({
  driver: localforage.INDEXEDDB,
  name: 'Version',
  storeName: 'versionStore'
})

self.addEventListener('install', event => {
  console.log('[ServiceWorker] onInstall')
  event.waitUntil(
    updateVersion().then(version => {
      console.log('[ServiceWorker] [onInstall] Installed version:', version)
      return caches
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
          console.log('[ServiceWorker] [onInstall] Skip waiting on install')
          return self.skipWaiting()
        })
    })
  )
})

self.addEventListener('activate', event => {
  console.log('[ServiceWorker] [onActivate]')
  event.waitUntil(updateCache())
})

self.addEventListener('fetch', event => {
  if (
    event.request.method === config.serviceWorker.routes.update.method &&
    event.request.url.endsWith(config.serviceWorker.routes.update.path)
  ) {
    event.respondWith(
      updateVersion()
        .catch(_ => getVersion())
        .then(version =>
          updateCache()
            .catch(_ => {})
            .then(_ => new Response(version, { headers: { 'content-type': 'text/plain' } }))
        )
    )
  } else {
    event.respondWith(
      caches
        .match(event.request)
        .then(response => (response !== undefined ? response : fetch(event.request)))
    )
  }
})

const getVersion = (): Promise<string | null> =>
  versionStore.getItem<string>(VERSION).then(_ => {
    console.log('[ServiceWorker] getVersion:', _)
    return _
  })
const setVersion = (version: string): Promise<string> =>
  versionStore.setItem(VERSION, version).then(_ => {
    console.log('[ServiceWorker] setVersion:', _)
    return _
  })

const updateVersion = (): Promise<string> =>
  fetch('/api/service-worker/version')
    .then(response => response.text())
    .then(newVersion => {
      console.log('[ServiceWorker] fetchVersion, newVersion:', newVersion)
      return setVersion(newVersion)
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
    .then(_ =>
      Promise.all([getVersion(), caches.keys()]).then(([currentVersion, cacheNames]) => {
        console.log('[ServiceWorker] currentVersion:', currentVersion)
        return (
          Promise.all(
            cacheNames.map(cacheName => {
              if (cacheName !== currentVersion) {
                console.log('[ServiceWorker] Deleting old cache:', cacheName)
                return caches.delete(cacheName)
              }
              return undefined
            })
          )
            // claim() sets this worker as the active worker for all clients that match the workers
            // scope and triggers an oncontrollerchange event for the clients.
            .then(_ => {
              console.log('[ServiceWorker] Claiming clients for version', currentVersion)
              return self.clients.claim()
            })
        )
      })
    )

export default null
