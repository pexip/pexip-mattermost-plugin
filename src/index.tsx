import * as React from 'react';
import { PluginRegistry, RHSPlugin } from './types';

import { Store, Action } from 'redux';
import { GlobalState } from 'mattermost-redux/types/store';
import { Channel, ChannelMembership } from 'mattermost-redux/types/channels';
import { Client4 } from 'mattermost-redux/client';

import { Call } from './Call/Call';
import { CallManager } from './services/callManager';

const pluginId = 'com.pexip.pexip-vmr';
const icon = <i className='icon fa fa-video-camera'/>;
const dropDownText = 'Pexip VMR';

class Plugin {
  
  private store: Store<GlobalState, Action<Record<string, unknown>>>;
  private rhsPlugin: RHSPlugin;

  initialize(registry: PluginRegistry, store: Store<GlobalState, Action<Record<string, unknown>>>) {
    this.store = store;
    console.log(registry);
    registry.registerChannelHeaderButtonAction(icon, this.action.bind(this), dropDownText);
    this.rhsPlugin = registry.registerRightHandSidebarComponent(Call as any, 'Pexip VMR');
  }

  private async action(channel: Channel, channelMembership: ChannelMembership) {
    const url = await this.getPexipInfinityUrl();
    const displayName = await this.getDisplayName(channelMembership.user_id);
    CallManager.setUrl(url);
    CallManager.setDisplayName(displayName);
    CallManager.setChannel(channel.name);
    this.store.dispatch(this.rhsPlugin.showRHSPlugin);
  }

  private async getPexipInfinityUrl() {
    const config = await Client4.getConfig();
    const pluginConfig = config.PluginSettings.Plugins[pluginId];
    let url = pluginConfig.pexipinfinityurl;
    if (!url) {
      const plugins = await Client4.getPlugins();
      const settings = plugins.active.find( (plugin:any) => plugin.id === pluginId).settings_schema.settings;
      const defaultUrl = settings.find( (setting: any) => setting.key === 'PexipInfinityUrl').default;
      url = defaultUrl;
    }
    return url;
  }

  private async getDisplayName(userId: string) {
    const user = await Client4.getUser(userId);
    return user.username;
  }

}

window.registerPlugin(pluginId, new Plugin());