import { ClientCallType, createCallSignals, createInfinityClient, createInfinityClientSignals } from '@pexip/infinity'
import { ConferenceActionType, type ConferenceAction } from '../ConferenceAction'
import { getUserSettings } from 'src/utils/user-settings'

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

  let localStream: MediaStream
  let response
  try {
    const userSettings = await getUserSettings()
    localStream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: userSettings.inputAudioDeviceId },
      video: { deviceId: userSettings.inputVideoDeviceId }
    })

    response = await client.call({
      host,
      conferenceAlias,
      pin: hostPin,
      displayName,
      bandwidth: 0,
      callType: ClientCallType.AudioVideo,
      mediaStream: localStream
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
