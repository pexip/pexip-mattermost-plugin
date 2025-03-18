import React, { useEffect } from 'react'
import { Box, Button, Checkbox, Divider, List, ListLink, TextHeading } from '@pexip/components'
import { type Channel } from 'mattermost-redux/types/channels'
import { Client4 } from 'mattermost-redux/client'

import './FilterChannels.scss'
import { getConfig } from 'mattermost-redux/selectors/entities/general'
import { getMattermostStore } from 'src/App/utils/mattermost-store'

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
  const [enabled, setEnabled] = React.useState(props.value?.enabled ?? false)

  const [allowedChannels, setAllowedChannels] = React.useState<Array<Channel & { checked: boolean }>>([])
  const [disallowedChannels, setDisallowedChannels] = React.useState<Array<Channel & { checked: boolean }>>([])

  const allowedSelected = allowedChannels.filter((channel) => channel.checked)
  const disallowedSelected = disallowedChannels.filter((channel) => channel.checked)

  const moveToAllowed = (): void => {
    const selected = disallowedChannels
      .filter((channel) => channel.checked)
      .map((channel) => ({ ...channel, checked: false }))
    const updatedAllowed = [...allowedChannels, ...selected]
    const updatedDisallowed = disallowedChannels.filter((channel) => !channel.checked)
    setAllowedChannels(updatedAllowed)
    setDisallowedChannels(updatedDisallowed)
    props.onChange(props.id, {
      enabled: true,
      allowedChannels: updatedAllowed.map((c) => c.id)
    })
    props.setSaveNeeded()
  }

  const moveToDisallowed = (): void => {
    const selected = allowedChannels
      .filter((channel) => channel.checked)
      .map((channel) => ({ ...channel, checked: false }))
    const updatedDisallowed = [...disallowedChannels, ...selected]
    const updatedAllowed = allowedChannels.filter((channel) => !channel.checked)
    setAllowedChannels(updatedAllowed)
    setDisallowedChannels(updatedDisallowed)
    props.onChange(props.id, {
      enabled: true,
      allowedChannels: updatedAllowed.map((c) => c.id)
    })
    props.setSaveNeeded()
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

  const channelSelector = (
    <div className='ChannelSelector'>
      <Box className='ChannelSelectorColumn'>
        <div className='ChannelSelectorHeader'>
          <Checkbox
            label=''
            name=''
            checked={disallowedChannels.length > 0 && disallowedSelected.length === disallowedChannels.length}
            ref={(element) => {
              if (element != null) {
                element.indeterminate =
                  disallowedSelected.length > 0 && disallowedSelected.length < disallowedChannels.length
              }
            }}
            onClick={() => {
              if (disallowedSelected.length === disallowedChannels.length) {
                const updatedChannels = disallowedChannels.map((c) => ({ ...c, checked: false }))
                setDisallowedChannels(updatedChannels)
              }
              if (disallowedSelected.length < disallowedChannels.length) {
                const updatedChannels = disallowedChannels.map((c) => ({ ...c, checked: true }))
                setDisallowedChannels(updatedChannels)
              }
            }}
          />
          <div>
            <TextHeading htmlTag='h3'>Disallowed Channels</TextHeading>
            <span className='ChannelSelectorSubtitle'>
              {disallowedSelected.length}/{disallowedChannels.length} selected
            </span>
          </div>
        </div>
        <Divider />
        <List className='ChannelSelectorList'>
          {disallowedChannels.map((channel) => (
            <ListLink key={channel.id} className='ChannelSelectorListLink'>
              <Checkbox
                label={channel.display_name}
                name={channel.id}
                checked={channel.checked}
                onChange={(event) => {
                  const checked = event.target.checked
                  const updatedChannels = disallowedChannels.map((c) => (c.id === channel.id ? { ...c, checked } : c))
                  setDisallowedChannels(updatedChannels)
                }}
              />
            </ListLink>
          ))}
        </List>
      </Box>

      <div className='ChannelSelectorButtons'>
        <Button aria-label='move selected right' variant='secondary' onClick={moveToAllowed}>
          &gt;
        </Button>
        <Button aria-label='move select left' variant='secondary' onClick={moveToDisallowed}>
          &lt;
        </Button>
      </div>

      <Box className='ChannelSelectorColumn'>
        <div className='ChannelSelectorHeader'>
          <Checkbox
            label=''
            name=''
            checked={allowedChannels.length > 0 && allowedSelected.length === allowedChannels.length}
            ref={(element) => {
              if (element != null) {
                const indeterminate = allowedSelected.length > 0 && allowedSelected.length < allowedChannels.length
                element.indeterminate = indeterminate
              }
            }}
            onClick={() => {
              if (allowedSelected.length === allowedChannels.length) {
                const updatedChannels = allowedChannels.map((c) => ({ ...c, checked: false }))
                setAllowedChannels(updatedChannels)
              }
              if (allowedSelected.length < allowedChannels.length) {
                const updatedChannels = allowedChannels.map((c) => ({ ...c, checked: true }))
                setAllowedChannels(updatedChannels)
              }
            }}
          />
          <div>
            <TextHeading htmlTag='h3'>Allowed Channels</TextHeading>
            <span className='ChannelSelectorSubtitle'>
              {allowedSelected.length}/{allowedChannels.length} selected
            </span>
          </div>
        </div>
        <Divider />
        <List className='ChannelSelectorList'>
          {allowedChannels.map((channel) => (
            <ListLink key={channel.id} className='ChannelSelectorListLink'>
              <Checkbox
                label={channel.display_name}
                name={channel.id}
                checked={channel.checked}
                onChange={(event) => {
                  const checked = event.target.checked
                  const updatedChannels = allowedChannels.map((c) => (c.id === channel.id ? { ...c, checked } : c))
                  setAllowedChannels(updatedChannels)
                }}
              />
            </ListLink>
          ))}
        </List>
      </Box>
    </div>
  )

  return (
    <div className='FilterChannels'>
      <div className='EnableFilter'>
        <label>
          <input
            type='radio'
            name='PluginSettings.Plugins.com+pexip+pexip-app.FilterChannels'
            value='true'
            checked={enabled}
            onChange={() => {
              const enabled = true
              setEnabled(enabled)
              props.onChange(props.id, {
                enabled,
                allowedChannels: props.value?.allowedChannels ?? []
              })
              props.setSaveNeeded()
            }}
          />
          <span>True</span>
        </label>

        <label>
          <input
            type='radio'
            id='disable'
            name='PluginSettings.Plugins.com+pexip+pexip-app.FilterChannels'
            value='false'
            checked={!enabled}
            onChange={() => {
              const enabled = false
              setEnabled(enabled)
              props.onChange(props.id, {
                enabled,
                allowedChannels: props.value?.allowedChannels ?? []
              })
              props.setSaveNeeded()
            }}
          />
          <span>False</span>
        </label>
      </div>

      {enabled && channelSelector}
    </div>
  )
}
