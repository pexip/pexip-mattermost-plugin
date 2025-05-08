import { notifyJoinConference, notifyLeaveConference } from '../../utils/http-requests'
import { ConnectionState } from '../../../types/ConnectionState'
import { ConferenceActionType, type ConferenceAction } from './ConferenceAction'
import type { ConferenceState } from './ConferenceState'
import { closePopUp } from './methods/togglePresentationInPopUp'
import { CallType, type Participant } from '@pexip/infinity'

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
        presentationStream: undefined,
        localVideoStream: undefined,
        localAudioStream: undefined,
        processedVideoStream: undefined,
        remoteStream: undefined,
        participants: [],
        errorMessage: '',
        me: null
      }
    }
    case ConferenceActionType.Connected: {
      closePopUp()
      notifyJoinConference().catch(console.error)
      return {
        ...prevState,
        connectionState: ConnectionState.Connected,
        client: action.body.client,
        audioMuted: false,
        videoMuted: false,
        presenting: false,
        presentationInMain: false,
        presentationInPopUp: false,
        transferring: false
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

      const channelId = prevState.channel?.id
      if (channelId != null) {
        notifyLeaveConference(channelId).catch(console.error)
      }

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
        remoteStream: action.body.remoteStream,
        transferring: false
      }
    }
    case ConferenceActionType.Participants: {
      return {
        ...prevState,
        participants: (action.body.participants as Participant[]).filter(
          (participant) => participant.callType !== CallType.api || participant.uuid === prevState.me?.uuid
        ),
        ...(action.body.participants.length === 1 ? { transferring: false } : {})
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
        presentationInMain: false,
        presentationInPopUp: false
      }
    }
    case ConferenceActionType.RemotePresentationStream: {
      const presentationStream: MediaStream = action.body.presentationStream
      const presentationInMain: boolean = presentationStream != null
      return {
        ...prevState,
        presenting: false,
        presentationStream,
        presentationInMain,
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
    case ConferenceActionType.SetIsDesktopApp: {
      return {
        ...prevState,
        isDesktopApp: action.body.isDesktopApp as boolean
      }
    }
    case ConferenceActionType.DirectMediaChanged: {
      return {
        ...prevState,
        directMedia: action.body.directMedia
      }
    }
    case ConferenceActionType.Me: {
      return {
        ...prevState,
        me: action.body.me
      }
    }
    case ConferenceActionType.Transfer: {
      prevState.client
        ?.disconnect({ reason: 'Transfer' })
        .then(() => {
          const localMediaStream = new MediaStream()
          prevState.localAudioStream?.getTracks().forEach((track) => {
            localMediaStream.addTrack(track)
          })
          prevState.localVideoStream?.getTracks().forEach((track) => {
            localMediaStream.addTrack(track)
          })

          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- we are sure that the type is correct
          prevState.client?.call({ ...action.body, mediaStream: localMediaStream }).catch(console.error)
        })
        .catch(console.error)
      return { ...prevState, transferring: true }
    }
    default:
      return prevState
  }
}
