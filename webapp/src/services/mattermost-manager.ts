import type { Store, Action } from 'redux'
import type { GlobalState } from 'mattermost-redux/types/store'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class MattermostManager {
  private static store: Store<GlobalState, Action<Record<string, unknown>>>

  static getStore (): Store<GlobalState, Action<Record<string, unknown>>> {
    return MattermostManager.store
  }

  static setStore (store: Store<GlobalState, Action<Record<string, unknown>>>): void {
    MattermostManager.store = store
  }
}
