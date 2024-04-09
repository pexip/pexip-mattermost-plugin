import { ConnectionState } from '../../types/ConnectionState'
import { ConferenceActionType, type ConferenceAction } from './ConferenceAction'
import type { ConferenceState } from './ConferenceState'

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
      return {
        ...prevState,
        connectionState: ConnectionState.Connected,
        client: action.body.client,
        localStream: action.body.localStream,
        audioMuted: false,
        videoMuted: false,
        presenting: false
      }
    }
    case ConferenceActionType.Disconnected: {
      prevState.localStream?.getTracks().forEach((track) => { track.stop() })
      prevState.presentationStream?.getTracks().forEach((track) => { track.stop() })

      return {
        ...prevState,
        localStream: undefined,
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
      return {
        ...prevState,
        presenting: action.body.presenting,
        presentationStream: action.body.presentationStream,
        presentationInMain: false
      }
    }
    case ConferenceActionType.RemotePresentationStream: {
      return {
        ...prevState,
        presenting: false,
        presentationStream: action.body.presentationStream,
        presentationInMain: true
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
