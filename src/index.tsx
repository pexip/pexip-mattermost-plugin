import * as React from 'react';
import { PluginRegistry, RHSPlugin } from './types';

import { Store, Action } from 'redux';
import { GlobalState } from 'mattermost-redux/types/store';
import { Channel, ChannelMembership } from 'mattermost-redux/types/channels';
import { Client4 } from 'mattermost-redux/client';

import { ConferenceManager } from './services/conference-manager';
import { ConferenceConfig } from './services/conference-manager';
import { App } from './App';
import { MattermostManager } from './services/mattermost-manager';

const pluginId = 'com.pexip.pexip-video-connect';
const icon = <i id='pexip-vmr-plugin-button' className='icon fa fa-video-camera'/>;
const dropDownText = 'Pexip Video Connect';

class Plugin {
  
  private store: Store<GlobalState, Action<Record<string, unknown>>>;
  private rhsPlugin: RHSPlugin;

  async initialize(registry: PluginRegistry, store: Store<GlobalState, Action<Record<string, unknown>>>) {
    this.store = store;
    MattermostManager.setStore(store);
    const script = document.createElement('script');
    script.src = '/static/plugins/com.pexip.pexip-video-connect/pexrtc-31.js';
    document.getElementsByTagName('head')[0].appendChild(script);
    registry.registerChannelHeaderButtonAction(icon, this.action.bind(this), dropDownText);
    this.rhsPlugin = registry.registerRightHandSidebarComponent(App as any, 'Pexip Video Connect');
  }

  private async action(channel: Channel, channelMembership: ChannelMembership) {
    const config = await Client4.getConfig();
    const pluginConfig = config.PluginSettings.Plugins[pluginId];
    const user = await Client4.getUser(channelMembership.user_id);
    const conferenceConfig: ConferenceConfig = {
      node: pluginConfig.node,
      displayName: user.username,
      vmrPrefix: pluginConfig.prefix,
      hostPin: pluginConfig.pin
    }
    ConferenceManager.setConfig(conferenceConfig);
    if (pluginConfig.embedded) {
      this.store.dispatch(this.rhsPlugin.toggleRHSPlugin);
    } else {
      const vmr = pluginConfig.prefix + channel.name;
      window.open(`https://${pluginConfig.node}/webapp3/m/${vmr}/?pin=${pluginConfig.pin}&name=${user.username}`,
      '', 'width=800;height=800');
    }
  }

}

window.registerPlugin(pluginId, new Plugin());