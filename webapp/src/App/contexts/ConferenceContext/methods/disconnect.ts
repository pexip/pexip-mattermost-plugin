import { type DisconnectReason } from '@pexip/infinity'
import { ConferenceActionType, type ConferenceAction } from '../ConferenceAction'
import { type ConferenceState } from '../ConferenceState'
import { getMattermostStore } from 'src/App/utils/mattermost-store'
import { notifyLeaveConference } from 'src/App/utils/http-requests'
import { ConnectionState } from 'src/types/ConnectionState'

export const disconnect = async (
  state: ConferenceState,
  dispatch: React.Dispatch<ConferenceAction>,
  reason: DisconnectReason
): Promise<void> => {
  if (state.connectionState === ConnectionState.Connected) {
    state.client?.disconnect({ reason }).catch(console.error)

    notifyLeaveConference(getMattermostStore().getState().entities.channels.currentChannelId).catch((error) => {
      console.error(error)
    })
  }

  dispatch({
    type: ConferenceActionType.Disconnected,
    body: {
      reason
    }
  })
}
