import React from 'react'
import type { PluginRegistry, RHSPlugin } from './types'
import type { Store, Action } from 'redux'
import type { GlobalState } from 'mattermost-redux/types/store'
import type { Channel, ChannelMembership } from 'mattermost-redux/types/channels'
import { Client4 } from 'mattermost-redux/client'
import { getConfig } from 'mattermost-redux/selectors/entities/general'
import { getPluginServerRoute, getPluginSettings, notifyJoinConference } from './App/utils/http-requests'
import { App } from './App/App'
import manifest from '../../plugin.json'
import type { ConferenceConfig } from './types/ConferenceConfig'
import ConferenceContextProvider from './App/contexts/ConferenceContext'
import { DisplayNameType } from './types/DisplayNameType'
import { type PluginSettings } from './types/PluginSettings'
import { getMattermostStore, setMattermostStore } from './App/utils/mattermost-store'
import { type UserSettings, settingsEventEmitter } from './App/utils/user-settings'
import ScreenSharingModal from './ScreenSharingModal'
import { reducer } from './reducer'
import { FilterChannels } from './AdminSettings/FilterChannels/FilterChannels'

import '@pexip/components/dist/style.css'

const pluginId = manifest.id
const icon = <i id='pexip-vmr-plugin-button' className='icon fa fa-video-camera' />
const title = 'Pexip'

let conferenceConfig: ConferenceConfig
const RightHandSidebarComponent = (): JSX.Element => {
  return (
    <ConferenceContextProvider onShowScreenSharingModal={() => {}} screenSharingSourceId={null}>
      <App config={conferenceConfig} />
    </ConferenceContextProvider>
  )
}

class Plugin {
  private store: Store<GlobalState, Action>
  private rhsPlugin: RHSPlugin

  initialize(registry: PluginRegistry, store: Store<GlobalState, Action>): void {
    this.store = store
    setMattermostStore(store)
    registry.registerReducer(reducer)
    registry.registerGlobalComponent(ScreenSharingModal)
    registry.registerChannelHeaderButtonAction(icon, this.action.bind(this), title)
    registry.registerWebSocketEventHandler('custom_' + manifest.id + '_change_user_settings', (message) => {
      settingsEventEmitter.emit('settingschange', message.data as UserSettings)
    })
    // Custom setting example: https://github.com/mattermost/mattermost-plugin-demo/blob/master/plugin.json
    registry.registerAdminConsoleCustomSetting('FilterChannels', FilterChannels, { showTitle: true })

    this.rhsPlugin = registry.registerRightHandSidebarComponent(RightHandSidebarComponent, title)
  }

  private async action(channel: Channel, channelMembership: ChannelMembership): Promise<void> {
    const settings = await getPluginSettings()
    const userId: string = channelMembership.user_id
    conferenceConfig = await this.getConferenceConfig(settings, userId)

    if (settings.embedded) {
      this.store.dispatch(this.rhsPlugin.toggleRHSPlugin)
    } else {
      if (settings.filterChannels.enabled && !settings.filterChannels.allowedChannels.includes(channel.id)) {
        ;(window as any).openInteractiveDialog({
          dialog: {
            title: (
              <span style={{ marginLeft: '0.5em' }}>
                {/* Workaround to hide the cancel button */}
                <style>{'#interactiveDialogModal .cancel-button { display: none}'}</style>
                Conference not available
              </span>
            ),
            icon_url: getPluginServerRoute() + '/public/icon.svg',
            introduction_text:
              'Conference not available for this channel. Use a different channel or ask your administrator to enable it.',
            submit_label: 'Close',
            notify_on_cancel: false
          }
        })
        return
      }
      const vmr = settings.prefix + channel.id
      const channelId: string = channel.id
      notifyJoinConference(channelId).catch(console.error)
      const { node, hostPin, displayName } = conferenceConfig
      window.open(
        `https://${node}/webapp3/m/${vmr}/express?pin=${hostPin}&name=${displayName}`,
        '',
        'width=800;height=800'
      )
    }
  }

  private async getConferenceConfig(settings: PluginSettings, userId: string): Promise<ConferenceConfig> {
    const state = getMattermostStore().getState()
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
      hostPin: settings.pin.toString(),
      filterChannels: settings.filterChannels
    }
    return conferenceConfig
  }
}

window.registerPlugin(pluginId, new Plugin())
