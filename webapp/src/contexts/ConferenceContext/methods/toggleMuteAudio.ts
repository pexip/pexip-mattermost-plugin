import { ConferenceActionType, type ConferenceAction } from '../ConferenceAction'
import { type ConferenceState } from '../ConferenceState'

export const toggleMuteAudio = async (
  state: ConferenceState,
  dispatch: React.Dispatch<ConferenceAction>
): Promise<void> => {
  const { client, audioMuted, localStream } = state

  if (!audioMuted) {
    localStream?.getAudioTracks().forEach((track) => {
      track.stop()
    })
  } else {
    const newStream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: state.inputAudioDeviceId },
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
  }

  dispatch({
    type: ConferenceActionType.ToggleMuteAudio
  })

  await client?.mute({ mute: !audioMuted })
}
