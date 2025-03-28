import { ConferenceActionType, type ConferenceAction } from '../ConferenceAction'
import { type ConferenceState } from '../ConferenceState'

export const toggleMuteAudio = async (
  state: ConferenceState,
  dispatch: React.Dispatch<ConferenceAction>
): Promise<void> => {
  const { client, audioMuted, localVideoStream, localAudioStream } = state

  if (!audioMuted) {
    localAudioStream?.getAudioTracks().forEach((track) => {
      track.stop()
    })
  } else {
    const newAudioStream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: state.inputAudioDeviceId }
    })

    dispatch({
      type: ConferenceActionType.UpdateLocalStream,
      body: {
        localAudioStream: newAudioStream
      }
    })

    const newLocalVideoStream = state.processedVideoStream ?? localVideoStream
    let newStream: MediaStream
    if (newLocalVideoStream != null) {
      newStream = new MediaStream([...newAudioStream.getTracks(), ...newLocalVideoStream.getTracks()])
    } else {
      newStream = newAudioStream
    }

    client?.setStream(newStream)
  }

  dispatch({
    type: ConferenceActionType.ToggleMuteAudio
  })

  await client?.mute({ mute: !audioMuted })
}
