import React from 'react'
import type { PluginRegistry, RHSPlugin } from './types'

import type { Store, Action } from 'redux'
import type { GlobalState } from 'mattermost-redux/types/store'
import type { Channel, ChannelMembership } from 'mattermost-redux/types/channels'
import { Client4 } from 'mattermost-redux/client'

import { ConferenceManager, type ConferenceConfig } from './services/conference-manager'
import { App } from './App'
import { MattermostManager } from './services/mattermost-manager'

import manifest from '../../plugin.json'

const pluginId = 'com.pexip.pexip-video-connect'
const icon = <i id='pexip-vmr-plugin-button' className='icon fa fa-video-camera'/>
const dropDownText = 'Pexip Video Connect'

class Plugin {
  private store: Store<GlobalState, Action<Record<string, unknown>>>
  private rhsPlugin: RHSPlugin

  initialize (registry: PluginRegistry, store: Store<GlobalState, Action<Record<string, unknown>>>): void {
    this.store = store
    MattermostManager.setStore(store)
    const script = document.createElement('script')
    script.src = '/static/plugins/com.pexip.pexip-video-connect/pexrtc-31.js'
    document.getElementsByTagName('head')[0].appendChild(script)
    registry.registerChannelHeaderButtonAction(icon, this.action.bind(this), dropDownText)
    this.rhsPlugin = registry.registerRightHandSidebarComponent(App as any, 'Pexip Video Connect')
  }

  private async action (channel: Channel, channelMembership: ChannelMembership): Promise<void> {
    const config = await Client4.getConfig()
    const pluginConfig = config.PluginSettings.Plugins[pluginId]
    const user = await Client4.getUser(channelMembership.user_id)
    const conferenceConfig: ConferenceConfig = {
      node: pluginConfig.node,
      displayName: user.username,
      vmrPrefix: pluginConfig.prefix,
      hostPin: pluginConfig.pin
    }
    ConferenceManager.setConfig(conferenceConfig)
    if (pluginConfig.embedded as boolean) {
      this.store.dispatch(this.rhsPlugin.toggleRHSPlugin)
    } else {
      const vmr = pluginConfig.prefix as string + channel.name
      window.open(`https://${pluginConfig.node as string}/webapp3/m/${vmr}/?pin=${pluginConfig.pin as string}&name=${user.username}`,
        '', 'width=800;height=800')
    }
  }
}

window.registerPlugin(manifest.id, new Plugin())
