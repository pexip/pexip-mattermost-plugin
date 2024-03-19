import { type DisconnectReason } from '@pexip/infinity'
import { ConferenceActionType, type ConferenceAction } from '../ConferenceAction'

export const disconnect = async (dispatch: React.Dispatch<ConferenceAction>, reason: DisconnectReason): Promise<void> => {
  dispatch({
    type: ConferenceActionType.Disconnected,
    body: {
      reason
    }
  })
}
