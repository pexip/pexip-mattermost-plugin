import { type Action, ActionType } from './actions'
import { initialState, type State } from './state'

export const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.HideScreenSharingModal:
      return {
        ...state,
        showScreenSharingModal: false
      }
    case ActionType.ShowScreenSharingModal:
      return {
        ...state,
        showScreenSharingModal: true,
        screenSharingSourceId: null
      }
    case ActionType.StartScreenSharing:
      return {
        ...state,
        screenSharingSourceId: action.payload as string
      }
    default:
      return state
  }
}
