import React from 'react'
import type { PluginRegistry, RHSPlugin } from './types'

import type { Store, Action } from 'redux'
import type { GlobalState } from 'mattermost-redux/types/store'
import type { Channel, ChannelMembership } from 'mattermost-redux/types/channels'
import { Client4 } from 'mattermost-redux/client'

import { getConfig } from 'mattermost-redux/selectors/entities/general'
import { DisplayNameType, type PluginSettings, getPluginSettings, notifyJoinConference, setMattermostStore, getMattermostStore } from './utils'
import { App } from './App'

import manifest from '../../plugin.json'
import type { ConferenceConfig } from './types/ConferenceConfig'
import { ConferenceContextProvider } from './contexts/ConferenceContext/ConferenceContext'

import '@pexip/components/dist/style.css'

const pluginId = manifest.id
const icon = <i id='pexip-vmr-plugin-button' className='icon fa fa-video-camera'/>
const dropDownText = 'Pexip Video Connect'

let conferenceConfig: ConferenceConfig
const RightHandSidebarComponent = (): JSX.Element => {
  return (
    <ConferenceContextProvider>
      <App config={conferenceConfig} />
    </ConferenceContextProvider>
  )
}

class Plugin {
  private store: Store<GlobalState, Action>
  private rhsPlugin: RHSPlugin

  initialize (registry: PluginRegistry, store: Store<GlobalState, Action>): void {
    this.store = store
    setMattermostStore(store)
    registry.registerChannelHeaderButtonAction(icon, this.action.bind(this), dropDownText)
    this.rhsPlugin = registry.registerRightHandSidebarComponent(RightHandSidebarComponent, 'Pexip Video Connect')
  }

  private async action (channel: Channel, channelMembership: ChannelMembership): Promise<void> {
    const settings = await this.getSettings()
    const userId: string = channelMembership.user_id
    conferenceConfig = await this.getConferenceConfig(settings, userId)

    if (settings.embedded) {
      this.store.dispatch(this.rhsPlugin.toggleRHSPlugin)
    } else {
      const vmr = settings.prefix + channel.name
      const channelId: string = channel.id
      notifyJoinConference(this.store.getState(), channelId).catch((error) => {
        console.error(error)
      })
      const { node, hostPin, displayName } = conferenceConfig
      window.open(`https://${node}/webapp3/m/${vmr}/express?pin=${hostPin}&name=${displayName}`,
        '', 'width=800;height=800')
    }
  }

  private async getSettings (): Promise<PluginSettings> {
    const state: GlobalState = getMattermostStore().getState()
    return await getPluginSettings(state)
  }

  private async getConferenceConfig (settings: PluginSettings, userId: string): Promise<ConferenceConfig> {
    const state: GlobalState = getMattermostStore().getState()
    const config = getConfig(state)
    if (config.SiteURL != null) {
      const url: string = config.SiteURL
      Client4.setUrl(url)
    }
    const user = await Client4.getUser(userId)

    let displayName = user.username
    switch (settings.displayNameType) {
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
      node: settings.node,
      displayName,
      vmrPrefix: settings.prefix,
      hostPin: settings.pin.toString()
    }
    return conferenceConfig
  }
}

window.registerPlugin(pluginId, new Plugin())
