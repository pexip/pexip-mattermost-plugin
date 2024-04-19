import { type UserSettings } from 'src/utils/user-settings'
import { ConferenceActionType, type ConferenceAction } from '../ConferenceAction'
import { type ConferenceState } from '../ConferenceState'

export const changeDevices = async (userSettings: UserSettings, state: ConferenceState, dispatch: React.Dispatch<ConferenceAction>): Promise<void> => {
  const { audioMuted, videoMuted, localStream, client } = state

  dispatch({
    type: ConferenceActionType.ChangeDevices,
    body: {
      audioSinkId: userSettings.outputAudioDeviceId
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
        audioDeviceIdChanged =
          audioTrack.getSettings().deviceId !== userSettings.inputAudioDeviceId
      }
      if (localStream.getVideoTracks().length > 0) {
        videoTrack = localStream.getVideoTracks()[0]
        videoDeviceIdChanged = videoTrack.getSettings().deviceId !== userSettings.inputVideoDeviceId
      }
    }

    const shouldRequestNewAudio = !audioMuted && audioDeviceIdChanged
    const shouldRequestNewVideo = !videoMuted && videoDeviceIdChanged

    if (shouldRequestNewAudio || shouldRequestNewVideo) {
      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: shouldRequestNewAudio ? { deviceId: userSettings.inputAudioDeviceId } : false,
        video: shouldRequestNewVideo ? { deviceId: userSettings.inputVideoDeviceId } : false
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
        type: ConferenceActionType.ChangeDevices,
        body: {
          localStream: newStream
        }
      })
    }
  }
}
