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
    // setUserSettingsListener((userSettings) => {
    //   // TODO: Only stop the local stream that changed or that aren\'t muted

    //   // TODO: Get the localStream
    //   const audioTracks = localStream.getAudioTracks()
    //   const audioMuted = audioTracks.length === 0 || !audioTracks.some((track) => track.readyState === 'live')

    //   const videoTracks = localStream.getVideoTracks()
    //   const videoMuted = videoTracks.length === 0 || !videoTracks.some((track) => track.readyState === 'live')

    //   console.error(audioTracks.length)
    //   console.error(audioTracks[0].readyState)
    //   console.error(videoTracks.length)
    //   console.error(videoTracks[0].readyState)
    //   // TODO: Only stop the local stream that changed or that aren't muted
    //   // track.getCapabilities().deviceId
    //   console.error(audioMuted, videoMuted)

    //   if (!(audioMuted && videoMuted)) {
    //     // console.error({
    //     //   audio: audioMuted ? false : { deviceId: userSettings.inputAudioDeviceId },
    //     //   video: videoMuted ? false : { deviceId: userSettings.inputVideoDeviceId }
    //     // })
    //     localStream.getTracks().forEach((track) => { track.stop() })

    //     navigator.mediaDevices.getUserMedia({
    //       audio: audioMuted ? false : { deviceId: userSettings.inputAudioDeviceId },
    //       video: videoMuted ? false : { deviceId: userSettings.inputVideoDeviceId }
    //     })
    //       .then((localStream) => {
    //         client.setStream(localStream)
    //         dispatch({
    //           type: ConferenceActionType.ChangeDevices,
    //           body: {
    //             localStream,
    //             audioSinkId: userSettings.outputAudioDeviceId
    //           }
    //         })
    //       })
    //       .catch((e) => { console.error(e) })
    // }
    // TODO: Change sinkId
    // dispatch({
    //   type: ConferenceActionType.Connected,
    //   body: {
    //     client,
    //     localStream,
    //     audioSinkId: userSettings.outputAudioDeviceId
    //   }
    // })
    // })
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
