import React, { useEffect } from 'react'
import { type Channel } from 'mattermost-redux/types/channels'
import { Client4 } from 'mattermost-redux/client'
import { getConfig } from 'mattermost-redux/selectors/entities/general'
import { getMattermostStore } from 'src/App/utils/mattermost-store'
import { TransferList } from './components/TransferList/TransferList'
import { type ChannelWithChecked } from 'src/types/ChannelWithChecked'

interface FilterChannelsProps {
  id: string
  label: string
  helpText: React.ReactNode
  value: string[]
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

  const [allowedChannels, setAllowedChannels] = React.useState<ChannelWithChecked[]>([])
  const [disallowedChannels, setDisallowedChannels] = React.useState<ChannelWithChecked[]>([])

  const handleChangeDisallowedChannels = (channels: ChannelWithChecked[]): void => {
    setDisallowedChannels(channels)
    onChange(
      props.id,
      channels.map((c) => c.id)
    )
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
        const disallowedChannelsIds = props.value ?? []
        const allowedChannels = channels.filter((channel: Channel) => !disallowedChannelsIds.includes(channel.id))
        const disallowedChannels = channels.filter((channel: Channel) => disallowedChannelsIds.includes(channel.id))
        setAllowedChannels(allowedChannels)
        setDisallowedChannels(disallowedChannels)
      })
      .catch(console.error)
  }, [])

  return (
    <TransferList
      allowedChannels={allowedChannels}
      disallowedChannels={disallowedChannels}
      onChangeAllowedChannels={setAllowedChannels}
      onChangeDisallowedChannels={handleChangeDisallowedChannels}
    />
  )
}
