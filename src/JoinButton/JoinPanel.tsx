import React, { Component } from 'react';
import { ConferenceManager } from '../services/conference-manager';

import { MattermostManager } from '../services/mattermost-manager';

import './JoinPanel.scss';

interface JoinButtonState {
  channelId: string;
  channelDisplayName: string;
}

export class JoinButton extends Component<{}, JoinButtonState> {

  constructor(props: {}) {
    super(props);
    const store = MattermostManager.getStore();
    const state = store.getState();
    const channelId = state.entities.channels.currentChannelId;
    const channel = state.entities.channels.channels[channelId];
    const channelDisplayName = channel.display_name;
    this.state = {
      channelId: channelId,
      channelDisplayName: channelDisplayName
    }
    this.updateChannelName(channel.name);
  }

  private onConnect () {
    ConferenceManager.connect();
  };

  private updateChannelName(channelName: string) {
    const config = ConferenceManager.getConfig();
    config.channel = channelName;
    ConferenceManager.setConfig(config);
  }

  async componentDidMount(): Promise<void> {
    const store = MattermostManager.getStore();
    store.subscribe(async () => {
      const state = store.getState();
      const channelId = state.entities.channels.currentChannelId;
      if (this.state.channelId != channelId) {
        const channel = state.entities.channels.channels[channelId];
        this.setState({
          channelId: channelId,
          channelDisplayName: channel.display_name,
        });
        this.updateChannelName(channel.name);
      }
    });
  }

  render () {
    return (
      <div className='JoinPanel'>
        <p>Connect to "{this.state.channelDisplayName}" room? </p>
        <button onClick={this.onConnect}>
          Join conference
        </button>
      </div>
    );
  }
}

export default JoinButton;
