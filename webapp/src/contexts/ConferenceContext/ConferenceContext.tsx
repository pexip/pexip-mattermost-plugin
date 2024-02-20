import React, { createContext, useContext, useMemo, useReducer } from 'react'
import type { ConferenceState } from './ConferenceState'
import { ConferenceReducer } from './ConferenceReducer'
import { connect } from './methods/connect'
import { disconnect } from './methods/disconnect'
import { ConnectionState } from '../../types/ConnectionState'

interface ContextType {
  connect: (conferenceAlias: string, displayName: string) => Promise<void>
  disconnect: () => Promise<void>
  state: ConferenceState
}

const Context = createContext< ContextType | null>(null)

const initialState: ConferenceState = {
  localStream: null,
  remoteStream: null,
  connectionState: ConnectionState.Disconnected,
  participants: []
}

const ConferenceContextProvider = (props: any): JSX.Element => {
  const [state, dispatch] = useReducer(ConferenceReducer, initialState)

  const value = useMemo(() => ({
    connect: async () => { connect(dispatch).catch((e) => { console.error(e) }) },
    disconnect: async () => { disconnect(dispatch).catch((e) => { console.error(e) }) },
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
