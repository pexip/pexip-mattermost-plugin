import React, { Component } from 'react'

import type { Channel } from 'mattermost-redux/types/channels'
import { getMattermostStore } from '../../utils'

import './JoinPanel.scss'

interface JoinButtonState {
  channel: Channel
}

export class JoinPanel extends Component<any, JoinButtonState> {
  constructor (props: any) {
    super(props)
    const store = getMattermostStore()
    const state = store.getState()
    const channelId = state.entities.channels.currentChannelId
    const channel = state.entities.channels.channels[channelId]
    this.state = { channel }
    // ConferenceManager.setChannel(channel)
  }

  private onConnect (): void {
    // ConferenceManager.connect()
  }

  async componentDidMount (): Promise<void> {
    const store = getMattermostStore()
    store.subscribe(() => {
      const state = store.getState()
      const channelId = state.entities.channels.currentChannelId
      if (this.state.channel.id !== channelId) {
        const channel = state.entities.channels.channels[channelId]
        this.setState({ channel })
        // ConferenceManager.setChannel(channel)
      }
    })
  }

  render (): JSX.Element {
    const isChannel = this.state.channel.team_id !== ''
    let component
    if (isChannel) {
      component = (
        <>
          <p>Connect to {'"' + this.state.channel.display_name + '"'} room? </p>
          <button onClick={ this.onConnect.bind(this) }>
            Join conference
          </button>
        </>
      )
    } else {
      component = (
        <>
          <p>Video conferences are only available for Channels.</p>
          <p>Select a channel to start!</p>
        </>
      )
    }
    return (
      <div className='JoinPanel'>
        {component}
      </div>
    )
  }
}
