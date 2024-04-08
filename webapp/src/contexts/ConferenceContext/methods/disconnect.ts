import { type DisconnectReason } from '@pexip/infinity'
import { ConferenceActionType, type ConferenceAction } from '../ConferenceAction'
import { type ConferenceState } from '../ConferenceState'

export const disconnect = async (state: ConferenceState, dispatch: React.Dispatch<ConferenceAction>, reason: DisconnectReason): Promise<void> => {
  state.client?.disconnect({ reason }).catch((e) => { console.error(e) })

  dispatch({
    type: ConferenceActionType.Disconnected,
    body: {
      reason
    }
  })
}
