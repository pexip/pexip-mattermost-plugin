import { ConferenceActionType, type ConferenceAction } from '../ConferenceAction'
import { type ConferenceState } from '../ConferenceState'

export const toggleMuteAudio = async (state: ConferenceState, dispatch: React.Dispatch<ConferenceAction>): Promise<void> => {
  const { client, audioMuted } = state

  dispatch({
    type: ConferenceActionType.ToggleMuteAudio
  })

  await client?.mute({ mute: !audioMuted })
}
