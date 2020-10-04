export const registerServiceWorker = () => {
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

const register = () => {
  navigator.serviceWorker
    .register('/app/sw.js', { scope: '/app/' })
    .then(reg => {
      if (reg.installing) {
        console.log('Service worker installing')
      } else if (reg.waiting) {
        console.log('Service worker installed')
      } else if (reg.active) {
        console.log('Service worker active')
      }
    })
    .catch(error => console.error('Registration failed with ' + error))
}

const fetchUpdate = () => {
  fetch('update', { method: 'POST' })
    .then(response => response.text())
    .then(updated => console.log('fetchUpdate:', updated))
}
