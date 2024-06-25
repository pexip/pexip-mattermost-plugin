import { ClientCallType, createCallSignals, createInfinityClient, createInfinityClientSignals } from '@pexip/infinity'
import { ConferenceActionType, type ConferenceAction } from '../ConferenceAction'
import { changeEffect } from './changeEffect'
import { type ConferenceState } from '../ConferenceState'
import { filterMediaDevices } from './filterMediaDevices'
import { notifyJoinConference } from 'src/utils/http-requests'
import { getMattermostStore } from 'src/utils/mattermost-store'


interface ConnectParams {
  host: string
  conferenceAlias: string
  hostPin: string
  displayName: string
}

export const connect = async (
  params: ConnectParams,
  state: ConferenceState,
  dispatch: React.Dispatch<ConferenceAction>
): Promise<void> => {
  const { host, conferenceAlias, hostPin, displayName } = params

  const clientSignals = createInfinityClientSignals([])
  const callSignals = createCallSignals([])
  const client = createInfinityClient(clientSignals, callSignals)

  callSignals.onRemoteStream.add((remoteStream) => {
    dispatch({
      type: ConferenceActionType.RemoteStream,
      body: {
        remoteStream
      }
    })
  })

  clientSignals.onParticipants.add((event) => {
    if (event.id === 'main') {
      dispatch({
        type: ConferenceActionType.Participants,
        body: {
          participants: event.participants
        }
      })
    }
  })

  clientSignals.onConnected.add(() => {
    notifyJoinConference(getMattermostStore().getState().entities.channels.currentChannelId).catch((error) => {
      console.error(error)
    })
  })

  clientSignals.onDisconnected.add(() => {
    dispatch({ type: ConferenceActionType.Disconnected })
  })

  callSignals.onRemotePresentationStream.add((presentationStream) => {
    dispatch({
      type: ConferenceActionType.RemotePresentationStream,
      body: {
        presentationStream
      }
    })
  })

  const filteredDevicesIds = await filterMediaDevices({
    inputVideoDeviceId: state.inputVideoDeviceId,
    inputAudioDeviceId: state.inputAudioDeviceId,
    outputAudioDeviceId: state.outputAudioDeviceId
  })

  let localVideoStream: MediaStream
  let localAudioStream: MediaStream
  let response
  try {
    localVideoStream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: filteredDevicesIds.inputVideoDeviceId }
    })

    localAudioStream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: filteredDevicesIds.inputAudioDeviceId }
    })

    dispatch({
      type: ConferenceActionType.UpdateLocalStream,
      body: {
        localVideoStream,
        localAudioStream
      }
    })

    const processedVideoStream = await changeEffect(localVideoStream, state.effect, state, dispatch)

    const newVideoStream = processedVideoStream ?? localVideoStream

    response = await client.call({
      host,
      conferenceAlias,
      pin: hostPin,
      displayName,
      bandwidth: 0,
      callType: ClientCallType.AudioVideo,
      mediaStream: new MediaStream([...newVideoStream.getTracks(), ...localAudioStream.getTracks()])
    })
  } catch (e) {
    dispatch({
      type: ConferenceActionType.Error,
      body: {
        error: e.message
      }
    })
    return
  }

  if (response?.status === 200) {
    dispatch({
      type: ConferenceActionType.Connected,
      body: {
        client,
        localVideoStream,
        localAudioStream
      }
    })

    // Get the deviceId from the localStream, because in Firefox the user can choose a different device

    const newInputVideoDeviceId =
      localVideoStream.getVideoTracks().length > 0 ? localVideoStream.getVideoTracks()[0].getSettings().deviceId : ''
    const newInputAudioDeviceId =
      localAudioStream.getAudioTracks().length > 0 ? localAudioStream.getAudioTracks()[0].getSettings().deviceId : ''

    dispatch({
      type: ConferenceActionType.ChangeDevices,
      body: {
        inputVideoDeviceId: newInputVideoDeviceId,
        inputAudioDeviceId: newInputAudioDeviceId,
        outputAudioDeviceId: state.outputAudioDeviceId
      }
    })
  } else {
    dispatch({
      type: ConferenceActionType.Error,
      body: {
        error: 'Cannot connect'
      }
    })
  }
}
