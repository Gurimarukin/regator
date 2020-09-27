self.addEventListener('install', event => {
  console.log('install:', event)
  event.waitUntil(
    caches.open('v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/images/icon192.png',
        '/images/icon512.png',
        '/global.css',
        '/app.css',
        '/app.js'
      ])
    })
  )
})

self.addEventListener('fetch', event => {
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

          caches.open('v1').then(cache => {
            cache.put(event.request, responseClone)
          })
          return response
        })
        // .catch(function () {
        //   return caches
        //     .match('/sw-test/gallery/myLittleVader.jpg')
        //     .then(response => response ?? {})
        // })
      }
    })
  )
})

export default null
