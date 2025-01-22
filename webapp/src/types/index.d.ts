import type { Channel, ChannelMembership } from 'mattermost-redux/types/channels'
import type { Action } from 'redux'

declare global {
  interface Window {
    registerPlugin: (id: string, plugin: any) => void
  }
}

export interface RHSPlugin {
  id: string
  showRHSPlugin: Action
  hideRHSPlugin: Action
  toggleRHSPlugin: Action
}

export interface PluginRegistry {
  registerReducer: (reducer: Reducer) => void
  registerChannelHeaderButtonAction: (
    icon: JSX.Element,
    action: (channel: Channel, channelMembership: ChannelMembership) => Promise<void>,
    dropdownText: string,
    tooltip?: string
  ) => void
  registerRightHandSidebarComponent: (component: React.ElementType, title: string | JSX.Element) => RHSPlugin
  registerWebSocketEventHandler: (event: string, handler: (message: any) => void) => void
  registerGlobalComponent: (component: React.ElementType) => void
}
