import React, { Component } from 'react';
import { ConferenceManager } from '../services/conference-manager';

import { MattermostManager } from '../services/mattermost-manager';

import './JoinPanel.scss';
import { Channel } from 'mattermost-redux/types/channels';

interface JoinButtonState {
  channel: Channel
}

export class JoinButton extends Component<{}, JoinButtonState> {

  constructor(props: {}) {
    super(props);
    const store = MattermostManager.getStore();
    const state = store.getState();
    const channelId = state.entities.channels.currentChannelId;
    const channel = state.entities.channels.channels[channelId];
    this.state = {
      channel: channel
    }
    ConferenceManager.setChannel(channel);
  }

  private onConnect () {
    ConferenceManager.connect();
  };

  async componentDidMount(): Promise<void> {
    const store = MattermostManager.getStore();
    store.subscribe(async () => {
      const state = store.getState();
      const channelId = state.entities.channels.currentChannelId;
      if (this.state.channel.id != channelId) {
        const channel = state.entities.channels.channels[channelId];
        this.setState({
          channel: channel
        });
        ConferenceManager.setChannel(channel);
      }
    });
  }

  render () {
    return (
      <div className='JoinPanel'>
        <p>Connect to "{this.state.channel.display_name}" room? </p>
        <button onClick={this.onConnect}>
          Join conference
        </button>
      </div>
    );
  }
}

export default JoinButton;
