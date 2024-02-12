import type { ConferenceAction } from './ConferenceAction'
import type { ConferenceState } from './ConferenceState'

export const ConferenceReducer = (prevState: ConferenceState, action: ConferenceAction): ConferenceState => {
  switch (action.type) {
    default:
      return prevState
  }
}
