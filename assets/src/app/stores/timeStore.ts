import { readable } from 'svelte/store'

import { Future, Task, pipe } from '../../shared/fp'

export const timeStore = readable(new Date(), set => {
  const untilNextSecond = Date.now() % 1000 + 1

  const promise: Promise<number> = pipe(
    Future.apply(() => Promise.resolve()),
    Task.delay(untilNextSecond),
    Future.map(_ => set(new Date())),
    Future.map(_ => setInterval(() => set(new Date()), 1000)),
    Future.runUnsafe,
  )

  return () => promise.then(clearInterval)
})
