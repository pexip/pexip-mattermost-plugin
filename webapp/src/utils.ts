import { getConfig } from 'mattermost-redux/selectors/entities/general'
import type { GlobalState } from 'mattermost-redux/types/store'
import manifest from '../../plugin.json'
import { Client4 } from 'mattermost-redux/client'
import type { Store, Action } from 'redux'

let mattermostStore: Store<GlobalState, Action>

export enum DisplayNameType {
  Username = 'username',
  Nickname = 'nickname',
  FirstAndLastName = 'firstAndLastName'
}

export interface PluginSettings {
  node: string
  prefix: string
  pin: number
  displayNameType: DisplayNameType
  embedded: boolean
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

export const setMattermostStore = (store: Store<GlobalState, Action>): void => {
  mattermostStore = store
}

export const getMattermostStore = (): Store<GlobalState, Action> => {
  return mattermostStore
}

const getPluginServerRoute = (state: GlobalState): string => {
  const config = getConfig(state)
  return (config.SiteURL ?? '') + '/plugins/' + manifest.id
}
