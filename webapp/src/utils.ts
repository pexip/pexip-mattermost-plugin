import { getConfig } from 'mattermost-redux/selectors/entities/general'
import type { GlobalState } from 'mattermost-redux/types/store'
import manifest from '../../plugin.json'
import { Client4 } from 'mattermost-redux/client'

export enum DisplayNameType {
  Username = 'username',
  Nickname = 'nickname',
  FirstAndLastName = 'firstAndLastName'
}

interface PluginSettings {
  node: string
  prefix: string
  pin: number
  displayNameType: DisplayNameType
  embedded: boolean
}

export const getPluginServerRoute = (state: GlobalState): string => {
  const config = getConfig(state)
  return (config.SiteURL ?? '') + '/plugins/' + manifest.id
}

export const getPluginSettings = async (state: GlobalState): Promise<PluginSettings> => {
  const baseUrl = getPluginServerRoute(state)
  const response = await fetch(`${baseUrl}/api/settings`, Client4.getOptions({}))
  const settings: PluginSettings = await response.json()
  return settings
}

export const notifyJoinConference = async (state: GlobalState, channelId: string): Promise<void> => {
  const baseUrl = getPluginServerRoute(state)
  await fetch(`${baseUrl}/api/notify_join_conference`, Client4.getOptions({
    method: 'POST',
    body: JSON.stringify({ channelId })
  }))
}
