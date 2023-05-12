import React from 'react'
import type { PluginRegistry, RHSPlugin } from './types'

import type { Store, Action } from 'redux'
import type { GlobalState } from 'mattermost-redux/types/store'
import type { Channel, ChannelMembership } from 'mattermost-redux/types/channels'
import { Client4 } from 'mattermost-redux/client'

import { ConferenceManager, type ConferenceConfig } from './services/conference-manager'
import { App } from './App'
import { MattermostManager } from './services/mattermost-manager'
import { getPluginServerRoute, getPluginSettings } from './utils'

import manifest from '../../plugin.json'

const pluginId = manifest.id
const icon = <i id='pexip-vmr-plugin-button' className='icon fa fa-video-camera'/>
const dropDownText = 'Pexip Video Connect'

class Plugin {
  private store: Store<GlobalState, Action<Record<string, unknown>>>
  private rhsPlugin: RHSPlugin

  initialize (registry: PluginRegistry, store: Store<GlobalState, Action<Record<string, unknown>>>): void {
    this.store = store
    console.log(registry)
    console.log(store)
    MattermostManager.setStore(store)
    const script = document.createElement('script')
    script.src = getPluginServerRoute(store.getState()) + '/public/pexrtc-31.js'
    document.getElementsByTagName('head')[0].appendChild(script)
    registry.registerChannelHeaderButtonAction(icon, this.action.bind(this), dropDownText)
    this.rhsPlugin = registry.registerRightHandSidebarComponent(App as any, 'Pexip Video Connect')
  }

  private async action (channel: Channel, channelMembership: ChannelMembership): Promise<void> {
    // const config = await Client4.getConfig()
    //  const settings = await MattermostManager.getStore().dispatch(getSettings());
    const pluginConfig = await getPluginSettings(MattermostManager.getStore().getState())
    // const pluginConfig = config.PluginSettings.Plugins[pluginId]
    const user = await Client4.getUser(channelMembership.user_id)
    const conferenceConfig: ConferenceConfig = {
      node: pluginConfig.Node,
      displayName: user.username,
      vmrPrefix: pluginConfig.Prefix,
      hostPin: pluginConfig.Pin.toString()
    }
    ConferenceManager.setConfig(conferenceConfig)
    if (pluginConfig.Embedded) {
      this.store.dispatch(this.rhsPlugin.toggleRHSPlugin)
    } else {
      const vmr = pluginConfig.Prefix + channel.name
      window.open(`https://${pluginConfig.Node}/webapp3/m/${vmr}/?pin=${pluginConfig.Pin}&name=${user.username}`,
        '', 'width=800;height=800')
    }
  }
}

window.registerPlugin(pluginId, new Plugin())
