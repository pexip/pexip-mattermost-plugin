import { ConferenceActionType, type ConferenceAction } from '../ConferenceAction'
import { type ConferenceState } from '../ConferenceState'

export interface DevicesIds {
  inputAudioDeviceId: string
  inputVideoDeviceId: string
  outputAudioDeviceId: string
}

export const changeDevices = async (
  devicesIds: DevicesIds,
  state: ConferenceState,
  dispatch: React.Dispatch<ConferenceAction>
): Promise<void> => {
  const { inputAudioDeviceId, inputVideoDeviceId, outputAudioDeviceId } = devicesIds
  const { audioMuted, videoMuted, localStream, client } = state

  dispatch({
    type: ConferenceActionType.ChangeDevices,
    body: {
      inputVideoDeviceId,
      inputAudioDeviceId,
      outputAudioDeviceId
    }
  })

  if (!(audioMuted && videoMuted)) {
    let audioDeviceIdChanged = true
    let videoDeviceIdChanged = true
    let audioTrack
    let videoTrack

    if (localStream != null) {
      if (localStream.getAudioTracks().length > 0) {
        audioTrack = localStream.getAudioTracks()[0]
        audioDeviceIdChanged = audioTrack.getSettings().deviceId !== inputAudioDeviceId
      }
      if (localStream.getVideoTracks().length > 0) {
        videoTrack = localStream.getVideoTracks()[0]
        videoDeviceIdChanged = videoTrack.getSettings().deviceId !== inputVideoDeviceId
      }
    }

    const shouldRequestNewAudio = !audioMuted && audioDeviceIdChanged
    const shouldRequestNewVideo = !videoMuted && videoDeviceIdChanged

    if (shouldRequestNewAudio || shouldRequestNewVideo) {
      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: shouldRequestNewAudio ? { deviceId: inputAudioDeviceId } : false,
        video: shouldRequestNewVideo ? { deviceId: inputVideoDeviceId } : false
      })

      if (!audioMuted && audioTrack != null) {
        if (shouldRequestNewAudio) {
          audioTrack.stop()
        } else {
          newStream.addTrack(audioTrack)
        }
      }

      if (!audioMuted && videoTrack != null) {
        if (shouldRequestNewVideo) {
          videoTrack.stop()
        } else {
          newStream.addTrack(videoTrack)
        }
      }

      client?.setStream(newStream)

      dispatch({
        type: ConferenceActionType.UpdateLocalStream,
        body: {
          localStream: newStream
        }
      })
    }
  }
}
