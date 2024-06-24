import { ConnectionState } from '../../types/ConnectionState'
import { ConferenceActionType, type ConferenceAction } from './ConferenceAction'
import type { ConferenceState } from './ConferenceState'
import { closePopUp } from './methods/togglePresentationInPopUp'

export const ConferenceReducer = (prevState: ConferenceState, action: ConferenceAction): ConferenceState => {
  switch (action.type) {
    case ConferenceActionType.SetConfig: {
      return {
        ...prevState,
        config: action.body
      }
    }
    case ConferenceActionType.Connecting: {
      return {
        ...prevState,
        connectionState: ConnectionState.Connecting,
        channel: action.body.channel,
        errorMessage: ''
      }
    }
    case ConferenceActionType.Connected: {
      closePopUp()
      return {
        ...prevState,
        connectionState: ConnectionState.Connected,
        client: action.body.client,
        audioMuted: false,
        videoMuted: false,
        presenting: false
      }
    }
    case ConferenceActionType.ChangeDevices: {
      const inputVideoDeviceId: string = action.body.inputVideoDeviceId
      const inputAudioDeviceId: string = action.body.inputAudioDeviceId
      const outputAudioDeviceId: string = action.body.outputAudioDeviceId

      return {
        ...prevState,
        ...(inputVideoDeviceId != null && { inputVideoDeviceId }),
        ...(inputAudioDeviceId != null && { inputAudioDeviceId }),
        ...(outputAudioDeviceId != null && { outputAudioDeviceId })
      }
    }

    case ConferenceActionType.UpdateLocalStream: {
      const localVideoStream: MediaStream = action.body.localVideoStream
      const localAudioStream: MediaStream = action.body.localAudioStream
      const processedVideoStream: MediaStream = action.body.processedVideoStream

      return {
        ...prevState,
        ...(localVideoStream != null && { localVideoStream }),
        ...(localAudioStream != null && { localAudioStream }),
        ...(processedVideoStream != null && { processedVideoStream })
      }
    }

    case ConferenceActionType.ChangeEffect: {
      return {
        ...prevState,
        effect: action.body.effect
      }
    }

    case ConferenceActionType.Disconnected: {
      closePopUp()
      prevState.localVideoStream?.getTracks().forEach((track) => {
        track.stop()
      })
      prevState.localAudioStream?.getTracks().forEach((track) => {
        track.stop()
      })
      prevState.presentationStream?.getTracks().forEach((track) => {
        track.stop()
      })

      return {
        ...prevState,
        localVideoStream: undefined,
        localAudioStream: undefined,
        presentationStream: undefined,
        connectionState: ConnectionState.Disconnected,
        errorMessage: ''
      }
    }
    case ConferenceActionType.Error: {
      return {
        ...prevState,
        connectionState: ConnectionState.Error,
        errorMessage: action.body.error
      }
    }
    case ConferenceActionType.RemoteStream: {
      return {
        ...prevState,
        remoteStream: action.body.remoteStream
      }
    }
    case ConferenceActionType.Participants: {
      return {
        ...prevState,
        participants: action.body.participants
      }
    }
    case ConferenceActionType.ToggleMuteAudio: {
      return {
        ...prevState,
        audioMuted: !prevState.audioMuted
      }
    }
    case ConferenceActionType.ToggleMuteVideo: {
      return {
        ...prevState,
        videoMuted: !prevState.videoMuted
      }
    }
    case ConferenceActionType.TogglePresenting: {
      // closePopUp()
      return {
        ...prevState,
        presenting: action.body.presenting,
        presentationStream: action.body.presentationStream,
        presentationInMain: false,
        presentationInPopUp: false
      }
    }
    case ConferenceActionType.RemotePresentationStream: {
      return {
        ...prevState,
        presenting: false,
        presentationStream: action.body.presentationStream,
        presentationInMain: true,
        presentationInPopUp: false
      }
    }
    case ConferenceActionType.TogglePresentationInPopUp: {
      return {
        ...prevState,
        presentationInPopUp: !prevState.presentationInPopUp
      }
    }
    case ConferenceActionType.SwapVideos: {
      return {
        ...prevState,
        presentationInMain: !prevState.presentationInMain
      }
    }
    default:
      return prevState
  }
}
