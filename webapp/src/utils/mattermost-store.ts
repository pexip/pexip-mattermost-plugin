import type { Store, Action } from 'redux'
import type { GlobalState } from 'mattermost-redux/types/store'

let mattermostStore: Store<GlobalState, Action>

export const setMattermostStore = (store: Store<GlobalState, Action>): void => {
  mattermostStore = store
}

export const getMattermostStore = (): Store<GlobalState, Action> => {
  return mattermostStore
}
