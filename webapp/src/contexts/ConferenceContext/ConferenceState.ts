import type { ConnectionState } from '../../types/ConnectionState'

interface ConferenceState {
  localStream: MediaStream | null
  remoteStream: MediaStream | null
  connectionState: ConnectionState
}

export type { ConferenceState }
