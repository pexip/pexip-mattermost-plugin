import type { Client, Participant } from '@pexip/infinity'
import type { ConnectionState } from 'src/types/ConnectionState'
import type { ConferenceConfig } from 'src/types/ConferenceConfig'
import type { Channel } from 'mattermost-redux/types/channels'
import type { Effect } from 'src/types/Effect'

interface ConferenceState {
  config: ConferenceConfig | null
  channel: Channel | null
  client: Client | null
  localVideoStream: MediaStream | undefined
  localAudioStream: MediaStream | undefined
  remoteStream: MediaStream | undefined
  inputVideoDeviceId: string
  inputAudioDeviceId: string
  outputAudioDeviceId: string
  effect: Effect
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
