import { ClientCallType, createCallSignals, createInfinityClient, createInfinityClientSignals } from '@pexip/infinity'
import { ConferenceActionType, type ConferenceAction } from '../ConferenceAction'

interface ConnectParams {
  host: string
  conferenceAlias: string
  hostPin: string
  displayName: string
  inputVideoDeviceId: string
  inputAudioDeviceId: string
  outputAudioDeviceId: string
}

export const connect = async (params: ConnectParams, dispatch: React.Dispatch<ConferenceAction>): Promise<void> => {
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

  let localVideoStream: MediaStream
  let localAudioStream: MediaStream
  let response
  try {
    localVideoStream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: params.inputVideoDeviceId }
    })

    localAudioStream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: params.inputAudioDeviceId }
    })

    response = await client.call({
      host,
      conferenceAlias,
      pin: hostPin,
      displayName,
      bandwidth: 0,
      callType: ClientCallType.AudioVideo,
      mediaStream: new MediaStream([...localVideoStream.getTracks(), ...localAudioStream.getTracks()])
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
        outputAudioDeviceId: params.outputAudioDeviceId
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
