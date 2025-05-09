import type { Client, Participant } from '@pexip/infinity'
import type { ConnectionState } from '../../../types/ConnectionState'
import type { ConferenceConfig } from '../../../types/ConferenceConfig'
import type { Channel } from 'mattermost-redux/types/channels'
import type { Effect } from '../../../types/Effect'

interface ConferenceState {
  config: ConferenceConfig | null
  channel: Channel | null
  client: Client | null
  localVideoStream: MediaStream | undefined
  localAudioStream: MediaStream | undefined
  processedVideoStream: MediaStream | undefined
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
  presentationInPopUp: boolean
  participants: Participant[]
  errorMessage: string
  isDesktopApp: boolean
  directMedia: boolean
  me: Participant | null
  transferring: boolean
}

export type { ConferenceState }
