import { ConferenceActionType, type ConferenceAction } from '../ConferenceAction'
import { type ConferenceState } from '../ConferenceState'

export interface DevicesIds {
  inputAudioDeviceId: string
  inputVideoDeviceId: string
  outputAudioDeviceId: string
}

const hasDeviceIdChanged = (mediaStream: MediaStream | undefined, deviceId: string): boolean => {
  if (mediaStream != null && mediaStream.getTracks().length > 0) {
    const track = mediaStream.getTracks()[0]
    const deviceIdChanged = track.getSettings().deviceId !== deviceId
    return deviceIdChanged
  }
  return false
}

export const changeDevices = async (
  devicesIds: DevicesIds,
  state: ConferenceState,
  dispatch: React.Dispatch<ConferenceAction>
): Promise<void> => {
  const { inputAudioDeviceId, inputVideoDeviceId, outputAudioDeviceId } = devicesIds
  const { audioMuted, videoMuted, localVideoStream, localAudioStream, client } = state

  dispatch({
    type: ConferenceActionType.ChangeDevices,
    body: {
      outputAudioDeviceId
    }
  })

  let newLocalVideoStream: MediaStream | null = null
  if (hasDeviceIdChanged(localVideoStream, inputVideoDeviceId)) {
    if (!videoMuted) {
      newLocalVideoStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: inputVideoDeviceId }
      })

      localVideoStream?.getTracks().forEach((track) => {
        track.stop()
      })

      dispatch({
        type: ConferenceActionType.UpdateLocalStream,
        body: {
          localVideoStream: newLocalVideoStream
        }
      })
    }

    dispatch({
      type: ConferenceActionType.ChangeDevices,
      body: {
        inputVideoDeviceId
      }
    })
  }

  let newLocalAudioStream: MediaStream | null = null
  if (hasDeviceIdChanged(localAudioStream, inputAudioDeviceId)) {
    if (!audioMuted) {
      newLocalAudioStream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: inputAudioDeviceId }
      })

      localAudioStream?.getTracks().forEach((track) => {
        track.stop()
      })

      dispatch({
        type: ConferenceActionType.UpdateLocalStream,
        body: {
          localAudioStream: newLocalAudioStream
        }
      })
    }

    dispatch({
      type: ConferenceActionType.ChangeDevices,
      body: {
        inputAudioDeviceId
      }
    })
  }

  if (newLocalVideoStream != null || newLocalAudioStream != null) {
    const videoTracks: MediaStreamTrack[] = newLocalVideoStream?.getVideoTracks() ?? []
    const audioTracks: MediaStreamTrack[] = newLocalAudioStream?.getAudioTracks() ?? []
    client?.setStream(new MediaStream([...videoTracks, ...audioTracks]))
  }
}
