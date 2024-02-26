import { ConferenceActionType, type ConferenceAction } from '../ConferenceAction'
import { type ConferenceState } from '../ConferenceState'

export const toggleMuteVideo = async (state: ConferenceState, dispatch: React.Dispatch<ConferenceAction>): Promise<void> => {
  const { client, videoMuted } = state

  await client?.muteVideo({ muteVideo: !videoMuted })

  dispatch({
    type: ConferenceActionType.ToggleMuteVideo
  })
}
