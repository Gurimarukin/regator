import App from './App.svelte'
import { registerServiceWorker } from './registerServiceWorker'

registerServiceWorker()

const target = document.getElementById('root')
const app = target === null ? null : new App({ target })

export default app
