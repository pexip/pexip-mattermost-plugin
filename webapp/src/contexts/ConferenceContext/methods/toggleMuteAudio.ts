import { getUserSettings } from 'src/utils/user-settings'
import { ConferenceActionType, type ConferenceAction } from '../ConferenceAction'
import { type ConferenceState } from '../ConferenceState'

export const toggleMuteAudio = async (state: ConferenceState, dispatch: React.Dispatch<ConferenceAction>): Promise<void> => {
  const { client, audioMuted, localStream } = state

  if (audioMuted) {
    const userSettings = await getUserSettings()

    const newStream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: userSettings.inputAudioDeviceId },
      video: false
    })

    localStream?.getVideoTracks().forEach((track) => {
      newStream.addTrack(track)
    })

    client?.setStream(newStream)

    dispatch({
      type: ConferenceActionType.ChangeDevices,
      body: {
        localStream: newStream
      }
    })
  } else {
    localStream?.getAudioTracks().forEach((track) => { track.stop() })
  }

  dispatch({
    type: ConferenceActionType.ToggleMuteAudio
  })

  await client?.mute({ mute: !audioMuted })
}
