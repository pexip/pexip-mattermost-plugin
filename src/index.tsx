import * as React from 'react';
import { PluginRegistry, RHSPlugin } from './types';

import { Store, Action } from 'redux';
import { GlobalState } from 'mattermost-redux/types/store';
import { Channel, ChannelMembership } from 'mattermost-redux/types/channels';
import { Client4 } from 'mattermost-redux/client';

import { Conference } from './Conference/Conference';
import { ConferenceManager } from './services/conference-manager';
import { ConferenceConfig } from './services/conference-manager';

const pluginId = 'com.pexip.pexip-vmr';
const icon = <i id='pexip-vmr-plugin-button' className='icon fa fa-video-camera'/>;
const dropDownText = 'Pexip VMR';

class Plugin {
  
  private store: Store<GlobalState, Action<Record<string, unknown>>>;
  private rhsPlugin: RHSPlugin;

  async initialize(registry: PluginRegistry, store: Store<GlobalState, Action<Record<string, unknown>>>) {
    this.store = store;
    const script = document.createElement('script');
    script.src = '/static/plugins/com.pexip.pexip-vmr/pexrtc-27.2.js';
    document.getElementsByTagName('head')[0].appendChild(script);
    registry.registerChannelHeaderButtonAction(icon, this.action.bind(this), dropDownText);
    this.rhsPlugin = registry.registerRightHandSidebarComponent(Conference as any, 'Pexip VMR');
  }

  private async action(channel: Channel, channelMembership: ChannelMembership) {
    const config = await Client4.getConfig();
    const pluginConfig = config.PluginSettings.Plugins[pluginId];
    const user = await Client4.getUser(channelMembership.user_id);
    const conferenceConfig: ConferenceConfig = {
      node: pluginConfig.node,
      displayName: user.username,
      mattermostChannel: channel.display_name,
      vmr: pluginConfig.prefix + channel.name,
      hostPin: pluginConfig.pin
    }
    ConferenceManager.setConfig(conferenceConfig);
    this.store.dispatch(this.rhsPlugin.toggleRHSPlugin);
  }

}

window.registerPlugin(pluginId, new Plugin());