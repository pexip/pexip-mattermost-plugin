import React from 'react'
import { Button } from '@pexip/components'
import { TransferColumn } from './TransferColumn'
import type { ChannelWithChecked } from 'src/types/ChannelWithChecked'

import './TransferList.scss'

interface TransferListProps {
  allowedChannels: ChannelWithChecked[]
  disallowedChannels: ChannelWithChecked[]
  onChangeAllowedChannels: (channels: ChannelWithChecked[]) => void
  onChangeDisallowedChannels: (channels: ChannelWithChecked[]) => void
}

export const TransferList = (props: TransferListProps): JSX.Element => {
  const { allowedChannels, disallowedChannels, onChangeAllowedChannels, onChangeDisallowedChannels } = props

  const moveToAllowed = (): void => {
    const disallowedSelected = disallowedChannels.filter((channel) => channel.checked)
    const updatedAllowed = [...allowedChannels, ...disallowedSelected.map((c) => ({ ...c, checked: false }))]
    const updatedDisallowed = disallowedChannels.filter((channel) => !channel.checked)
    onChangeAllowedChannels(updatedAllowed)
    onChangeDisallowedChannels(updatedDisallowed)
  }

  const moveToDisallowed = (): void => {
    const allowedSelected = allowedChannels.filter((channel) => channel.checked)
    const updatedDisallowed = [...disallowedChannels, ...allowedSelected.map((c) => ({ ...c, checked: false }))]
    const updatedAllowed = allowedChannels.filter((channel) => !channel.checked)
    onChangeAllowedChannels(updatedAllowed)
    onChangeDisallowedChannels(updatedDisallowed)
  }

  const handleChangeCheckedAllowed = (channels: ChannelWithChecked[]): void => {
    const updatedAllowed = allowedChannels.map((c) => {
      const channel = channels.find((ch) => ch.id === c.id)
      return channel ?? c
    })
    onChangeAllowedChannels(updatedAllowed)
  }

  const handleChangeCheckedDisallowed = (channels: ChannelWithChecked[]): void => {
    const updatedAllowed = disallowedChannels.map((c) => {
      const channel = channels.find((ch) => ch.id === c.id)
      return channel ?? c
    })
    console.log(updatedAllowed)
    onChangeDisallowedChannels(updatedAllowed)
  }

  return (
    <div className='TransferList'>
      <TransferColumn
        title='Disallowed Channels'
        channels={disallowedChannels}
        onChange={handleChangeCheckedDisallowed}
      />

      <div className='ChannelSelectorButtons'>
        <Button aria-label='move selected right' variant='secondary' onClick={moveToAllowed}>
          &gt;
        </Button>
        <Button aria-label='move select left' variant='secondary' onClick={moveToDisallowed}>
          &lt;
        </Button>
      </div>

      <TransferColumn title='Allowed Channels' channels={allowedChannels} onChange={handleChangeCheckedAllowed} />
    </div>
  )
}
