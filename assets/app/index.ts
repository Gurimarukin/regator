import App from './App.svelte'

// register service worker

if ('serviceWorker' in navigator) {
  console.log("'serviceWorker' in navigator")
  navigator.serviceWorker
    .register('/app/sw.js', { scope: '/app/' })
    .then(reg => {
      console.log('reg:', reg)
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
      console.error('Registration failed with ' + error)
    })
} else {
  console.error('navigator.serviceWorker is undefined')
}

const target = document.getElementById('root')
const app = target === null ? null : new App({ target })

export default app
