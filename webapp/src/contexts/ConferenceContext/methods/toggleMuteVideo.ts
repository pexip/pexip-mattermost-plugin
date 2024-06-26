import { ConferenceActionType, type ConferenceAction } from '../ConferenceAction'
import { type ConferenceState } from '../ConferenceState'
import { changeEffect } from './changeEffect'

export const toggleMuteVideo = async (
  state: ConferenceState,
  dispatch: React.Dispatch<ConferenceAction>
): Promise<void> => {
  const { client, videoMuted, localVideoStream, localAudioStream } = state

  if (!videoMuted) {
    localVideoStream?.getVideoTracks().forEach((track) => {
      track.stop()
    })
  } else {
    let newVideoStream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: state.inputVideoDeviceId }
    })

    dispatch({
      type: ConferenceActionType.UpdateLocalStream,
      body: {
        localVideoStream: newVideoStream
      }
    })

    const processedVideoStream = await changeEffect(newVideoStream, state.effect, state, dispatch)
    newVideoStream = processedVideoStream ?? newVideoStream

    let newStream: MediaStream

    if (localAudioStream != null) {
      newStream = new MediaStream([...newVideoStream.getTracks(), ...localAudioStream.getTracks()])
    } else {
      newStream = newVideoStream
    }
    client?.setStream(newStream)
  }

  dispatch({
    type: ConferenceActionType.ToggleMuteVideo
  })

  await client?.muteVideo({ muteVideo: !videoMuted })
}
