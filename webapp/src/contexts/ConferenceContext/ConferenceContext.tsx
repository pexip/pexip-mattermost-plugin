import React, { createContext, useContext, useMemo, useReducer } from 'react'
import type { ConferenceState } from './ConferenceState'
import { ConferenceReducer } from './ConferenceReducer'
import { connect } from './methods/connect'
import { disconnect } from './methods/disconnect'
import { ConnectionState } from '../../types/ConnectionState'
import type { ConferenceConfig } from '../../types/ConferenceConfig'
import { ConferenceActionType } from './ConferenceAction'
import type { Channel } from 'mattermost-redux/types/channels'

interface ContextType {
  setConfig: (config: ConferenceConfig) => void
  connect: (channel: Channel) => Promise<void>
  disconnect: () => Promise<void>
  toggleMuteAudio: () => Promise<void>
  toggleMuteVideo: () => Promise<void>
  togglePresenting: () => Promise<void>
  state: ConferenceState
}

const Context = createContext< ContextType | null>(null)

const initialState: ConferenceState = {
  config: null,
  channel: null,
  client: null,
  localStream: null,
  remoteStream: null,
  presentationStream: null,
  connectionState: ConnectionState.Disconnected,
  isAudioMuted: false,
  isVideoMuted: false,
  isPresenting: false,
  participants: []
}

const ConferenceContextProvider = (props: any): JSX.Element => {
  const [state, dispatch] = useReducer(ConferenceReducer, initialState)

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
    },
    disconnect: async () => { disconnect(dispatch).catch((e) => { console.error(e) }) },
    toggleMuteAudio: async () => {},
    toggleMuteVideo: async () => {},
    togglePresenting: async () => {},
    state
  }), [state])

  return <Context.Provider value={value}>{props.children}</Context.Provider>
}

const useConferenceContext = (): ContextType => {
  const context = useContext(Context)
  if (context == null) {
    throw new Error('useConferenceContext has to be used within <ConferenceContextProvider')
  }
  return context
}

export { ConferenceContextProvider, useConferenceContext }
