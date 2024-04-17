import type { Client, Participant } from '@pexip/infinity'
import type { ConnectionState } from 'src/types/ConnectionState'
import type { ConferenceConfig } from 'src/types/ConferenceConfig'
import type { Channel } from 'mattermost-redux/types/channels'

interface ConferenceState {
  config: ConferenceConfig | null
  channel: Channel | null
  client: Client | null
  localStream: MediaStream | undefined
  remoteStream: MediaStream | undefined
  audioSinkId: string | undefined
  presentationStream: MediaStream | undefined
  connectionState: ConnectionState
  audioMuted: boolean
  videoMuted: boolean
  presenting: boolean
  presentationInMain: boolean
  participants: Participant[]
  errorMessage: string
}

export type { ConferenceState }
