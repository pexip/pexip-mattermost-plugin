import { ActionType } from './actions'
import { initialState, type State } from './state'

export const reducer = (state: State = initialState, action: { type: string; data: boolean }): State => {
  switch (action.type) {
    case ActionType.HideScreenSharingModal:
      return {
        ...state,
        showScreenSharingModal: false
      }
    case ActionType.ShowScreenSharingModal:
      return {
        ...state,
        showScreenSharingModal: true
      }
    default:
      return state
  }
}
