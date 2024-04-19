import React, { createContext, useContext, useMemo, useReducer } from 'react'
import type { ConferenceState } from './ConferenceState'
import { ConferenceReducer } from './ConferenceReducer'
import { connect } from './methods/connect'
import { disconnect } from './methods/disconnect'
import { ConnectionState } from '../../types/ConnectionState'
import type { ConferenceConfig } from '../../types/ConferenceConfig'
import { ConferenceActionType } from './ConferenceAction'
import type { Channel } from 'mattermost-redux/types/channels'
import { toggleMuteAudio } from './methods/toggleMuteAudio'
import { toggleMuteVideo } from './methods/toggleMuteVideo'
import { toggleMutePresenting } from './methods/togglePresenting'
import { type DisconnectReason } from '@pexip/infinity'
import { changeDevices } from './methods/changeDevices'
import { type UserSettings } from 'src/utils/user-settings'

interface ContextType {
  setConfig: (config: ConferenceConfig) => void
  connect: (channel: Channel) => Promise<void>
  disconnect: () => Promise<void>
  toggleMuteAudio: () => Promise<void>
  toggleMuteVideo: () => Promise<void>
  togglePresenting: () => Promise<void>
  changeDevices: (userSettings: UserSettings) => Promise<void>
  swapVideos: () => void
  state: ConferenceState
}

const Context = createContext< ContextType | null>(null)

const initialState: ConferenceState = {
  config: null,
  channel: null,
  client: null,
  localStream: undefined,
  remoteStream: undefined,
  audioSinkId: undefined,
  presentationStream: undefined,
  connectionState: ConnectionState.Disconnected,
  audioMuted: false,
  videoMuted: false,
  presenting: false,
  presentationInMain: false,
  participants: [],
  errorMessage: ''
}

const ConferenceContextProvider = (props: any): JSX.Element => {
  const [state, dispatch] = useReducer(ConferenceReducer, initialState)

  const beforeUnloadHandler = (event: Event): void => {
    const disconnectReason: DisconnectReason = 'Browser closed'
    disconnect(state, dispatch, disconnectReason).catch((e) => { console.error(e) })
  }

  const value = useMemo(() => ({
    setConfig: (config: ConferenceConfig): void => {
      dispatch({ type: ConferenceActionType.SetConfig, body: config })
    },
    connect: async (channel: Channel) => {
      dispatch({
        type: ConferenceActionType.Connecting,
        body: { channel }
      })
      connect({
        host: 'https://' + state.config?.node,
        conferenceAlias: state.config?.vmrPrefix + channel.name,
        hostPin: state.config?.hostPin ?? '',
        displayName: state.config?.displayName ?? 'User'
      }, dispatch).catch((e) => { console.error(e) })
      addEventListener('beforeunload', beforeUnloadHandler)
    },
    disconnect: async () => {
      const disconnectReason: DisconnectReason = 'User initiated disconnect'
      disconnect(state, dispatch, disconnectReason).catch((e) => { console.error(e) })
      removeEventListener('beforeunload', beforeUnloadHandler)
    },
    toggleMuteAudio: async () => { toggleMuteAudio(state, dispatch).catch((e) => { console.error(e) }) },
    toggleMuteVideo: async () => { toggleMuteVideo(state, dispatch).catch((e) => { console.error(e) }) },
    togglePresenting: async () => { toggleMutePresenting(state, dispatch).catch((e) => { console.error(e) }) },
    changeDevices: async (userSettings: UserSettings) => { changeDevices(userSettings, state, dispatch).catch((e) => { console.error(e) }) },
    swapVideos: async () => {
      dispatch({
        type: ConferenceActionType.SwapVideos
      })
    },
    state
  }), [state])

  return <Context.Provider value={value}>{props.children}</Context.Provider>
}

const useConferenceContext = (): ContextType => {
  const context = useContext(Context)
  if (context == null) {
    throw new Error('useConferenceContext has to be used within <ConferenceContextProvider>')
  }
  return context
}

export { ConferenceContextProvider, useConferenceContext }
