import { ConferenceActionType, type ConferenceAction } from '../ConferenceAction'
import { type ConferenceState } from '../ConferenceState'

export const toggleMuteAudio = async (state: ConferenceState, dispatch: React.Dispatch<ConferenceAction>): Promise<void> => {
  const { client, audioMuted } = state

  await client?.mute({ mute: !audioMuted })

  dispatch({
    type: ConferenceActionType.ToggleMuteAudio
  })
}
