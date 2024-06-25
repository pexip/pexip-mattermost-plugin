import { type DisconnectReason } from '@pexip/infinity'
import { ConferenceActionType, type ConferenceAction } from '../ConferenceAction'
import { type ConferenceState } from '../ConferenceState'
import { getMattermostStore } from 'src/utils/mattermost-store'
import { notifyLeaveConference } from 'src/utils/http-requests'

export const disconnect = async (
  state: ConferenceState,
  dispatch: React.Dispatch<ConferenceAction>,
  reason: DisconnectReason
): Promise<void> => {
  state.client?.disconnect({ reason }).catch(console.error)

  const globalState = getMattermostStore().getState()
  notifyLeaveConference(globalState.entities.channels.currentChannelId).catch((error) => {
    console.error(error)
  })

  dispatch({
    type: ConferenceActionType.Disconnected,
    body: {
      reason
    }
  })
}
