import React, { Component } from 'react'
import { ConferenceManager } from '../services/conference-manager'

import { MattermostManager } from '../services/mattermost-manager'
import type { Channel } from 'mattermost-redux/types/channels'

import './JoinPanel.scss'

interface JoinButtonState {
  channel: Channel
}

export class JoinButton extends Component<any, JoinButtonState> {
  constructor (props: any) {
    super(props)
    const store = MattermostManager.getStore()
    const state = store.getState()
    const channelId = state.entities.channels.currentChannelId
    const channel = state.entities.channels.channels[channelId]
    this.state = { channel }
    ConferenceManager.setChannel(channel)
  }

  private onConnect (): void {
    ConferenceManager.connect()
  }

  async componentDidMount (): Promise<void> {
    const store = MattermostManager.getStore()
    store.subscribe(() => {
      const state = store.getState()
      const channelId = state.entities.channels.currentChannelId
      if (this.state.channel.id !== channelId) {
        const channel = state.entities.channels.channels[channelId]
        this.setState({ channel })
        ConferenceManager.setChannel(channel)
      }
    })
  }

  render (): JSX.Element {
    return (
      <div className='JoinPanel'>
        <p>Connect to {'"' + this.state.channel.display_name + '"'} room? </p>
        <button onClick={ this.onConnect }>
          Join conference
        </button>
      </div>
    )
  }
}

export default JoinButton
