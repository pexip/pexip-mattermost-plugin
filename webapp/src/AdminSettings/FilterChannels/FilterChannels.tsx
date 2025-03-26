import React, { useEffect } from 'react'
import { type Channel } from 'mattermost-redux/types/channels'
import { Client4 } from 'mattermost-redux/client'
import { getConfig } from 'mattermost-redux/selectors/entities/general'
import { getMattermostStore } from 'src/App/utils/mattermost-store'
import { ToggleEnable } from './components/ToggleEnable/ToggleEnable'
import { TransferList } from './components/TransferList/TransferList'
import { type ChannelWithChecked } from 'src/types/ChannelWithChecked'

interface FilterChannelsValue {
  enabled: boolean
  allowedChannels: string[]
}

interface FilterChannelsProps {
  id: string
  label: string
  helpText: React.ReactNode
  value: FilterChannelsValue
  disabled: boolean
  config: string
  currentState: string
  license: {
    IsLicensed: boolean
  }
  setByEnv: boolean
  onChange: (id: string, values: any) => void
  registerSaveAction: () => void
  setSaveNeeded: () => void
  unRegisterSaveAction: () => void
}

// Component based on https://mui.com/material-ui/react-transfer-list/
export const FilterChannels = (props: FilterChannelsProps): JSX.Element => {
  const { onChange, setSaveNeeded } = props

  const [enabled, setEnabled] = React.useState(props.value?.enabled ?? false)

  const [allowedChannels, setAllowedChannels] = React.useState<ChannelWithChecked[]>([])
  const [disallowedChannels, setDisallowedChannels] = React.useState<ChannelWithChecked[]>([])

  const handleToggleEnableChange = (enabled: boolean): void => {
    setEnabled(enabled)
    onChange(props.id, {
      enabled,
      allowedChannels: props.value?.allowedChannels ?? []
    })
    setSaveNeeded()
  }

  const handleChangeAllowedChannels = (channels: ChannelWithChecked[]): void => {
    setAllowedChannels(channels)
    onChange(props.id, {
      enabled: true,
      allowedChannels: channels.map((c) => c.id)
    })
    setSaveNeeded()
  }

  useEffect(() => {
    const state = getMattermostStore().getState()
    const config = getConfig(state)
    if (config.SiteURL != null) {
      const url: string = config.SiteURL
      Client4.setUrl(url)
    }
    const page = 0
    const perPage = 2000
    Client4.getAllChannels(page, perPage)
      .then((allChannels) => {
        const channels = Object.values(allChannels)
          .filter((channel) => channel.type === 'O' || channel.type !== 'P')
          .map((channel) => ({ ...channel, checked: false }))
        const allowedChannelsIds = props.value?.allowedChannels ?? []
        const allowedChannels = channels.filter((channel: Channel) => allowedChannelsIds.includes(channel.id))
        const disallowedChannels = channels.filter((channel: Channel) => !allowedChannelsIds.includes(channel.id))
        setAllowedChannels(allowedChannels)
        setDisallowedChannels(disallowedChannels)
      })
      .catch(console.error)
  }, [])

  return (
    <div>
      <ToggleEnable enabled={enabled} onChange={handleToggleEnableChange} />
      {enabled && (
        <TransferList
          allowedChannels={allowedChannels}
          disallowedChannels={disallowedChannels}
          onChangeAllowedChannels={handleChangeAllowedChannels}
          onChangeDisallowedChannels={setDisallowedChannels}
        />
      )}
    </div>
  )
}
