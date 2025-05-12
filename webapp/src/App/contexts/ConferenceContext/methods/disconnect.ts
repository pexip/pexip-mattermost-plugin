import { type DisconnectReason } from '@pexip/infinity'
import { ConferenceActionType, type ConferenceAction } from '../ConferenceAction'
import { type ConferenceState } from '../ConferenceState'
import { closePopUp } from './togglePresentationInPopUp'
import { notifyLeaveConference } from '../../../utils/http-requests'

export const disconnect = async (
  state: ConferenceState,
  dispatch: React.Dispatch<ConferenceAction>,
  reason: DisconnectReason
): Promise<void> => {
  state.client?.disconnect({ reason }).catch(console.error)

  closePopUp()

  state.localVideoStream?.getTracks().forEach((track) => {
    track.stop()
  })
  state.localAudioStream?.getTracks().forEach((track) => {
    track.stop()
  })
  state.presentationStream?.getTracks().forEach((track) => {
    track.stop()
  })

  notifyLeaveConference().catch(console.error)

  dispatch({
    type: ConferenceActionType.Disconnected,
    body: {
      reason
    }
  })
}
