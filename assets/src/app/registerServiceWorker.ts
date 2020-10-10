import { config } from '../shared/config'
import { Future, pipe } from '../shared/fp'

export const registerServiceWorker = (): Future<void> =>
  'serviceWorker' in navigator
    ? (() => {
        console.log('navigator.serviceWorker.controller:', navigator.serviceWorker.controller)
        return navigator.serviceWorker.controller !== null
          ? (() => {
              const url = navigator.serviceWorker.controller.scriptURL
              console.log('serviceWorker.controller:', url)
              return fetchUpdate()
            })()
          : register()
      })()
    : Future.right(console.error('navigator.serviceWorker is undefined'))

function register(): Future<void> {
  return pipe(
    Future.apply(() => navigator.serviceWorker.register('/app/sw.js', { scope: '/app/' })),
    Future.map(reg =>
      reg.installing !== null
        ? console.log('Service worker installing')
        : reg.waiting !== null
        ? console.log('Service worker installed')
        : reg.active !== null
        ? console.log('Service worker active')
        : undefined,
    ),
    Future.recover(error => Future.right(console.error('Registration failed with ' + error))),
  )
}

function fetchUpdate(): Future<void> {
  return pipe(
    Future.apply(() =>
      fetch(config.serviceWorker.routes.update.path, {
        method: config.serviceWorker.routes.update.method,
      }),
    ),
    Future.chain(response => Future.apply(() => response.text())),
    Future.map(updated => console.log('fetchUpdate:', updated)),
  )
}
