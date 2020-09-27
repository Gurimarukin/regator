import App from './App.svelte'

// register service worker

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/app/static/sw.js', { scope: '/app/' })
    .then(reg => {
      if (reg.installing) {
        console.log('Service worker installing')
      } else if (reg.waiting) {
        console.log('Service worker installed')
      } else if (reg.active) {
        console.log('Service worker active')
      }
    })
    .catch(error => {
      // registration failed
      console.log('Registration failed with ' + error)
    })
} else {
  console.warn("'serviceWorker' not in navigator")
}

const target = document.getElementById('root')
const app = target === null ? null : new App({ target })

export default app
