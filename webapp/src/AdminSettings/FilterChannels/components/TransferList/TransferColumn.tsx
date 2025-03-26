import React from 'react'
import { Box, Checkbox, Divider, List, ListLink, TextHeading } from '@pexip/components'
import type { ChannelWithChecked } from 'src/types/ChannelWithChecked'

import './TransferColumn.scss'

interface ChannelColumnProps {
  title: string
  channels: ChannelWithChecked[]
  onChange: (channels: ChannelWithChecked[]) => void
}

export const TransferColumn = (props: ChannelColumnProps): JSX.Element => {
  const { title, channels, onChange } = props

  const checkedChannels = channels.filter((channel) => channel.checked)

  return (
    <Box className='TransferColumn'>
      <div className='ChannelSelectorHeader'>
        <Checkbox
          label=''
          name=''
          checked={channels.length > 0 && checkedChannels.length === channels.length}
          ref={(element) => {
            if (element != null) {
              element.indeterminate = checkedChannels.length > 0 && checkedChannels.length < channels.length
            }
          }}
          onClick={() => {
            const checked = checkedChannels.length !== channels.length
            onChange(channels.map((channel) => ({ ...channel, checked })))
          }}
        />
        <div>
          <TextHeading htmlTag='h3'>{title}</TextHeading>
          <span className='ChannelSelectorSubtitle'>
            {checkedChannels.length}/{channels.length} selected
          </span>
        </div>
      </div>

      <Divider />

      <List className='ChannelSelectorList'>
        {channels.map((channel) => (
          <ListLink key={channel.id} className='ChannelSelectorListLink'>
            <Checkbox
              label={channel.display_name}
              name={channel.id}
              checked={channel.checked}
              onChange={(event) => {
                const checked = event.target.checked
                const updatedChannels = channels.map((c) => (c.id === channel.id ? { ...c, checked } : c))
                onChange(updatedChannels)
              }}
            />
          </ListLink>
        ))}
      </List>
    </Box>
  )
}
