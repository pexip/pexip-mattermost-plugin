import type { Participant } from '@pexip/infinity'
import type { ConnectionState } from '../../types/ConnectionState'

interface ConferenceState {
  localStream: MediaStream | null
  remoteStream: MediaStream | null
  connectionState: ConnectionState
  participants: Participant[]
}

export type { ConferenceState }
