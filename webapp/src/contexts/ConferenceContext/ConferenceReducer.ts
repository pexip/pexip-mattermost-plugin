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
        channel: action.body.channel
      }
    }
    case ConferenceActionType.Connected: {
      return {
        ...prevState,
        connectionState: ConnectionState.Connected,
        client: action.body.client,
        localStream: action.body.localStream
      }
    }
    case ConferenceActionType.RemoteStream: {
      return {
        ...prevState,
        remoteStream: action.body.remoteStream
      }
    }
    default:
      return prevState
  }
}
