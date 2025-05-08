import { type DisplayNameType } from './DisplayNameType'

export interface PluginSettings {
  node: string
  prefix: string
  pin: number
  displayNameType: DisplayNameType
  embedded: boolean
  showJoinLeaveNotifications: boolean
  filterChannels: {
    enabled: boolean
    allowedChannels: string[]
  }
}
