import React, { useEffect } from 'react'
import { Box, Button, Checkbox, Divider, List, ListLink, TextHeading } from '@pexip/components'
import { getMattermostStore } from 'src/App/utils/mattermost-store'
import { getAllChannels } from 'mattermost-redux/selectors/entities/channels'
import { type Channel } from 'mattermost-redux/types/channels'

import './FilterChannels.scss'

// Component based on https://mui.com/material-ui/react-transfer-list/
export const FilterChannels = (): JSX.Element => {
  const [enabled, setEnabled] = React.useState(false)

  const [allowedChannels, setAllowedChannels] = React.useState<Array<Channel & { checked: boolean }>>([])
  const [disallowedChannels, setDisallowedChannels] = React.useState<Array<Channel & { checked: boolean }>>([])

  const store = getMattermostStore()

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
  }

  const moveToDisallowed = (): void => {
    const selected = allowedChannels
      .filter((channel) => channel.checked)
      .map((channel) => ({ ...channel, checked: false }))
    const updatedDisallowed = [...disallowedChannels, ...selected]
    const updatedAllowed = allowedChannels.filter((channel) => !channel.checked)
    setAllowedChannels(updatedAllowed)
    setDisallowedChannels(updatedDisallowed)
  }

  // const indeterminateSvg = (
  //   <svg
  //     // class='MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-q7mezt'
  //     focusable='false'
  //     aria-hidden='true'
  //     viewBox='0 0 24 24'
  //     data-testid='IndeterminateCheckBoxIcon'
  //   >
  //     <path d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z'></path>
  //   </svg>
  // )

  useEffect(() => {
    const channels = Object.values(getAllChannels(store.getState()))
      .filter((channel) => channel.team_id !== '' && channel.display_name !== '')
      .map((channel) => ({ ...channel, checked: false }))

    setAllowedChannels([])
    setDisallowedChannels(channels)
    // const disallowedChannels = channels.filter((channel) => !allowedChannels.includes(channel))
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
              setEnabled(true)
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
              setEnabled(false)
            }}
          />
          <span>False</span>
        </label>
      </div>

      {enabled && channelSelector}
    </div>
  )
}
