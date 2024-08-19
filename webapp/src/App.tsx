import React, { useEffect } from 'react'

import type { ConferenceConfig } from './types/ConferenceConfig'
import { useConferenceContext } from './contexts/ConferenceContext/ConferenceContext'
import { ConnectionState } from './types/ConnectionState'
import { JoinPanel } from './components/JoinPanel/JoinPanel'
import { Conference } from './components/Conference/Conference'
import { Loading } from './components/Loading/Loading'
import { ErrorPanel } from './components/ErrorPanel/ErrorPanel'

import './App.scss'

interface AppProps {
  config: ConferenceConfig
}

export const App = (props: AppProps): JSX.Element => {
  const { setConfig, state } = useConferenceContext()

  useEffect(() => {
    console.log('Pexip launched')
    setConfig(props.config)
  }, [])

  let component
  switch (state.connectionState) {
    case ConnectionState.Disconnected:
      component = <JoinPanel />
      break
    case ConnectionState.Connected:
      component = <Conference />
      break
    case ConnectionState.Connecting:
      component = <Loading />
      break
    case ConnectionState.Error:
      component = <ErrorPanel />
      break
  }

  return (
    <div className='App' data-testid='App'>
      {component}
    </div>
  )
}
