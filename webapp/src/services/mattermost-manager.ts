import { Store, Action } from 'redux';
import { GlobalState } from 'mattermost-redux/types/store';

export class MattermostManager {

  private static store: Store<GlobalState, Action<Record<string, unknown>>>;

  static getStore (): Store<GlobalState, Action<Record<string, unknown>>> {
    return MattermostManager.store;
  }

  static setStore (store: Store<GlobalState, Action<Record<string, unknown>>>) {
    MattermostManager.store = store;
  }

}