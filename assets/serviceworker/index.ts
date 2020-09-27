self.addEventListener('install', event => {
  console.log('pouet', event)
  event.waitUntil(
    caches.open('v1').then(cache => {
      return cache.addAll([
        // '/sw-test/',
        // '/sw-test/index.html',
        // '/sw-test/style.css',
        // '/sw-test/app.js',
        // '/sw-test/image-list.js',
        // '/sw-test/star-wars-logo.jpg',
        // '/sw-test/gallery/bountyHunters.jpg',
        // '/sw-test/gallery/myLittleVader.jpg',
        // '/sw-test/gallery/snowTroopers.jpg'
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