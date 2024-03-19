import { ConferenceActionType, type ConferenceAction } from '../ConferenceAction'
import { type ConferenceState } from '../ConferenceState'

export const toggleMuteVideo = async (state: ConferenceState, dispatch: React.Dispatch<ConferenceAction>): Promise<void> => {
  const { client, videoMuted } = state

  dispatch({
    type: ConferenceActionType.ToggleMuteVideo
  })

  await client?.muteVideo({ muteVideo: !videoMuted })
}
