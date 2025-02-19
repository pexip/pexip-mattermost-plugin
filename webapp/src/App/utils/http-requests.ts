import { getConfig } from 'mattermost-redux/selectors/entities/general'
import manifest from '../../../../plugin.json'
import { Client4 } from 'mattermost-redux/client'
import { type PluginSettings } from '../../types/PluginSettings'
import { getMattermostStore } from './mattermost-store'

export const getPluginSettings = async (): Promise<PluginSettings> => {
  const baseUrl = getPluginServerRoute()
  const response = await fetch(`${baseUrl}/api/settings`, Client4.getOptions({}))
  const settings: PluginSettings = await response.json()
  return settings
}

export const notifyJoinConference = async (channelId: string): Promise<void> => {
  const baseUrl = getPluginServerRoute()
  await fetch(
    `${baseUrl}/api/notify_join_conference`,
    Client4.getOptions({
      method: 'POST',
      body: JSON.stringify({ channelId })
    })
  )
}

export const getPluginServerRoute = (): string => {
  const state = getMattermostStore().getState()
  const config = getConfig(state)
  return (config.SiteURL ?? '') + '/plugins/' + manifest.id
}

export const notifyLeaveConference = async (channelId: string): Promise<void> => {
  const baseUrl = getPluginServerRoute()
  await fetch(
    `${baseUrl}/api/notify_leave_conference`,
    Client4.getOptions({
      method: 'POST',
      body: JSON.stringify({ channelId })
    })
  )
}
