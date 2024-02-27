import { ConferenceActionType, type ConferenceAction } from '../ConferenceAction'
import { type ConferenceState } from '../ConferenceState'

export const disconnect = async (state: ConferenceState, dispatch: React.Dispatch<ConferenceAction>): Promise<void> => {
  await state.client?.disconnect({ reason: 'User initiated disconnect' })
  dispatch({
    type: ConferenceActionType.Disconnected
  })
}
