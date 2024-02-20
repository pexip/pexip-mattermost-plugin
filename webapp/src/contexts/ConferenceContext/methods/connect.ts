import { ClientCallType, createCallSignals, createInfinityClient, createInfinityClientSignals } from '@pexip/infinity'
import { ConferenceActionType, type ConferenceAction } from '../ConferenceAction'

interface ConnectParams {
  host: string
  conferenceAlias: string
  hostPin: string
  displayName: string
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

  const localStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
  })

  const response = await client.call({
    host,
    conferenceAlias,
    pin: hostPin,
    displayName,
    bandwidth: 0,
    callType: ClientCallType.AudioVideo,
    mediaStream: localStream
  })

  if (response?.status === 200) {
    dispatch({
      type: ConferenceActionType.Connected,
      body: {
        client,
        localStream
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
