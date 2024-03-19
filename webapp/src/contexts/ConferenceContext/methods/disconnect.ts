import { ConferenceActionType, type ConferenceAction } from '../ConferenceAction'
import { type ConferenceState } from '../ConferenceState'

export const disconnect = async (state: ConferenceState, dispatch: React.Dispatch<ConferenceAction>): Promise<void> => {
  dispatch({
    type: ConferenceActionType.Disconnected
  })

  await state.client?.disconnect({ reason: 'User initiated disconnect' })

  state.localStream?.getTracks().forEach((track) => { track.stop() })
}
