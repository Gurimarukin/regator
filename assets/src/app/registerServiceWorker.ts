import { config } from '../shared/config'

export const registerServiceWorker = (): void => {
  if ('serviceWorker' in navigator) {
    console.log('navigator.serviceWorker.controller:', navigator.serviceWorker.controller)

    if (navigator.serviceWorker.controller !== null) {
      const url = navigator.serviceWorker.controller.scriptURL
      console.log('serviceWorker.controller:', url)
      fetchUpdate()
    } else {
      register()
    }
  } else {
    console.error('navigator.serviceWorker is undefined')
  }
}

function register() {
  navigator.serviceWorker
    .register('/app/sw.js', { scope: '/app/' })
    .then(reg => {
      if (reg.installing !== null) {
        console.log('Service worker installing')
      } else if (reg.waiting !== null) {
        console.log('Service worker installed')
      } else if (reg.active !== null) {
        console.log('Service worker active')
      }
    })
    .catch(error => console.error('Registration failed with ' + error))
}

function fetchUpdate() {
  fetch(config.serviceWorker.routes.update.path, {
    method: config.serviceWorker.routes.update.method,
  })
    .then(response => response.text())
    .then(updated => console.log('fetchUpdate:', updated))
}
