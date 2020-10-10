import { IO, pipe } from '../shared/fp'
import App from './App.svelte'
import { registerServiceWorker } from './registerServiceWorker'

const app = pipe(
  IO.runFuture(registerServiceWorker()),
  IO.map(_ => {
    const target = document.getElementById('root')
    return target === null ? null : new App({ target })
  }),
  IO.runUnsafe,
)

export default app
