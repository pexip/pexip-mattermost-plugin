import React, { Component } from 'react'
import { Conference } from './Conference/Conference'
import { ConferenceManager, ConnectionState } from './services/conference-manager'
import JoinPanel from './JoinPanel/JoinPanel'
import Loading from './Loading/Loading'
import ErrorPanel from './ErrorPanel/ErrorPanel'
import type { Subscription } from 'rxjs'

import './App.scss'
import { MattermostManager } from './services/mattermost-manager'
import { notifyJoinConference } from './utils'

interface AppState {
  connectionState: ConnectionState
}

export class App extends Component<any, AppState> {
  private connectionSubscription: Subscription

  constructor (props: any) {
    super(props)
    this.state = {
      connectionState: ConnectionState.Disconnected
    }
  }

  componentDidMount (): void {
    this.connectionSubscription = ConferenceManager.connectionState$.subscribe((connectionState) => {
      if (connectionState === ConnectionState.Connected) {
        const mattermostState = MattermostManager.getStore().getState()
        const channel = ConferenceManager.getChannel()
        notifyJoinConference(mattermostState, channel.id).catch((error) => {
          console.error(error)
        })
      }
      this.setState({ connectionState })
    })
  }

  componentWillUnmount (): void {
    this.connectionSubscription.unsubscribe()
  }

  render (): JSX.Element {
    let component
    switch (this.state.connectionState) {
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
        component = <ErrorPanel
          message={ConferenceManager.getError()}
          onGoBack={() => { this.setState({ connectionState: ConnectionState.Disconnected }) }} />
        break
    }
    return (
      <div className='App' data-testid='App'>
        {component}
      </div>
    )
  }
}
