import { Location, To, createBrowserHistory } from 'history'
import { readable } from 'svelte/store'

type HistoryStore = {
  readonly location: Location<State>
  readonly navigate: (
    to: To,
    options?: { readonly replace?: boolean; readonly state?: State },
    // eslint-disable-next-line functional/no-return-void
  ) => void
  // eslint-disable-next-line functional/no-return-void
  readonly go: (delta: number) => void
}

// eslint-disable-next-line @typescript-eslint/ban-types
type State = object | null

const historyStoreEmpty = (): HistoryStore => {
  const { pathname, search, hash } = window.location
  return {
    location: { state: null, key: '', pathname, search, hash },
    navigate: _ => {},
    go: _ => {},
  }
}

export const historyStore = readable<HistoryStore>(historyStoreEmpty(), set => {
  const { go, ...history } = createBrowserHistory()
  const navigate: HistoryStore['navigate'] = (to, options) =>
    options?.replace === true
      ? history.replace(to, options.state)
      : history.push(to, options?.state)
  const unlisten = history.listen(({ location }) => set({ location, navigate, go }))
  return unlisten
})
