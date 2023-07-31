import React from 'react'
import type { PluginRegistry, RHSPlugin } from './types'

import type { Store, Action } from 'redux'
import type { GlobalState } from 'mattermost-redux/types/store'
import type { Channel, ChannelMembership } from 'mattermost-redux/types/channels'
import { Client4 } from 'mattermost-redux/client'

import { ConferenceManager, type ConferenceConfig } from './services/conference-manager'
import { App } from './App'
import { MattermostManager } from './services/mattermost-manager'
import { DisplayNameType, getPluginServerRoute, getPluginSettings, notifyJoinConference } from './utils'
import { getConfig } from 'mattermost-redux/selectors/entities/general'

import manifest from '../../plugin.json'

const pluginId = manifest.id
const icon = <i id='pexip-vmr-plugin-button' className='icon fa fa-video-camera'/>
const dropDownText = 'Pexip Video Connect'

class Plugin {
  private store: Store<GlobalState, Action<Record<string, unknown>>>
  private rhsPlugin: RHSPlugin

  initialize (registry: PluginRegistry, store: Store<GlobalState, Action<Record<string, unknown>>>): void {
    this.store = store
    MattermostManager.setStore(store)
    const script = document.createElement('script')
    script.src = getPluginServerRoute(store.getState()) + '/public/pexrtc-31.js'
    document.getElementsByTagName('head')[0].appendChild(script)
    registry.registerChannelHeaderButtonAction(icon, this.action.bind(this), dropDownText)
    this.rhsPlugin = registry.registerRightHandSidebarComponent(App as any, 'Pexip Video Connect')
  }

  private async action (channel: Channel, channelMembership: ChannelMembership): Promise<void> {
    const state = MattermostManager.getStore().getState()
    const config = getConfig(state)
    const pluginConfig = await getPluginSettings(state)
    if (config.SiteURL != null) {
      Client4.setUrl(config.SiteURL)
    }
    const user = await Client4.getUser(channelMembership.user_id)

    let displayName = user.username
    switch (pluginConfig.displayNameType) {
      case DisplayNameType.Nickname: {
        if (user.nickname !== '') {
          displayName = user.nickname
        }
        break
      }
      case DisplayNameType.FirstAndLastName: {
        const realName = `${user.first_name} ${user.last_name}`.trim()
        if (realName !== '') {
          displayName = realName
        }
      }
    }

    const conferenceConfig: ConferenceConfig = {
      node: pluginConfig.node,
      displayName,
      vmrPrefix: pluginConfig.prefix,
      hostPin: pluginConfig.pin.toString()
    }
    ConferenceManager.setConfig(conferenceConfig)
    if (pluginConfig.embedded) {
      this.store.dispatch(this.rhsPlugin.toggleRHSPlugin)
    } else {
      const vmr = pluginConfig.prefix + channel.name
      notifyJoinConference(this.store.getState(), channel.id).catch((error) => {
        console.error(error)
      })
      window.open(`https://${pluginConfig.node}/webapp3/m/${vmr}/express?pin=${pluginConfig.pin}&name=${displayName}`,
        '', 'width=800;height=800')
    }
  }
}

window.registerPlugin(pluginId, new Plugin())
