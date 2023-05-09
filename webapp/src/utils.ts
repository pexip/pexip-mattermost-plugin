import { getConfig } from 'mattermost-redux/selectors/entities/general'
import type { GlobalState } from 'mattermost-redux/types/store'
import manifest from '../../plugin.json'

interface PluginSettings {
  node: string
  prefix: string
  pin: number
  embedded: boolean
}

export const getPluginServerRoute = (state: GlobalState): string => {
  const config = getConfig(state)

  let basePath = ''
  if (config?.SiteURL != null && config?.SiteURL !== '') {
    basePath = new URL(config.SiteURL).pathname
    if (basePath !== '' && basePath[basePath.length - 1] === '/') {
      basePath = basePath.substr(0, basePath.length - 1)
    }
  }
  return basePath + '/plugins/' + manifest.id
}

export const getPluginSettings = async (state: GlobalState): Promise<PluginSettings> => {
  const baseUrl = getPluginServerRoute(state)
  const response = await fetch(`${baseUrl}/api/settings`)
  const settings: PluginSettings = await response.json()
  return settings
}
