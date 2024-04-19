import { getUserSettings } from 'src/utils/user-settings'
import { ConferenceActionType, type ConferenceAction } from '../ConferenceAction'
import { type ConferenceState } from '../ConferenceState'

export const toggleMuteVideo = async (state: ConferenceState, dispatch: React.Dispatch<ConferenceAction>): Promise<void> => {
  const { client, videoMuted, localStream } = state

  if (!videoMuted) {
    localStream?.getVideoTracks().forEach((track) => { track.stop() })
  } else {
    const userSettings = await getUserSettings()

    const newStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { deviceId: userSettings.inputVideoDeviceId }
    })

    localStream?.getAudioTracks().forEach((track) => {
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
    type: ConferenceActionType.ToggleMuteVideo
  })

  await client?.muteVideo({ muteVideo: !videoMuted })
}
