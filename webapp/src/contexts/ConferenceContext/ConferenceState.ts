import type { Client, Participant } from '@pexip/infinity'
import type { ConnectionState } from 'src/types/ConnectionState'
import type { ConferenceConfig } from 'src/types/ConferenceConfig'
import type { Channel } from 'mattermost-redux/types/channels'

interface ConferenceState {
  config: ConferenceConfig | null
  channel: Channel | null
  client: Client | null
  localStream: MediaStream | null
  remoteStream: MediaStream | null
  presentationStream: MediaStream | null
  connectionState: ConnectionState
  isAudioMuted: boolean
  isVideoMuted: boolean
  isPresenting: boolean
  participants: Participant[]
}

export type { ConferenceState }
