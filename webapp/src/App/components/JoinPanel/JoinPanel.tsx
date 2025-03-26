import React, { useEffect, useState } from 'react'

import { useConferenceContext } from '../../contexts/ConferenceContext/ConferenceContext'
import { getMattermostStore } from '../../utils/mattermost-store'
import type { Channel } from 'mattermost-redux/types/channels'

import './JoinPanel.scss'

export const JoinPanel = (): JSX.Element => {
  const { connect, state } = useConferenceContext()

  const { config } = state

  const [channel, setChannel] = useState<Channel>()

  const handleConnect = async (): Promise<void> => {
    if (channel != null) {
      await connect(channel)
    } else {
      console.error('Cannot get the current channel')
    }
  }

  const refreshChannel = (): void => {
    const store = getMattermostStore()
    const state = store.getState()
    const channelId = state.entities.channels.currentChannelId
    if (channel?.id !== channelId) {
      const channel = state.entities.channels.channels[channelId]
      setChannel(channel)
    }
  }

  useEffect(() => {
    const store = getMattermostStore()

    refreshChannel()

    const unsubscribe = store.subscribe(() => {
      refreshChannel()
    })
    return unsubscribe
  }, [])

  const filterChannelsEnabled = config?.filterChannels.enabled ?? false
  const allowedChannels = config?.filterChannels.allowedChannels ?? []
  const channelId = channel?.id ?? ''
  const type = channel?.type ?? ''

  const isDirectOrGroupChannel = type === 'D' || type === 'G'

  const shouldAllowChannel = !filterChannelsEnabled || isDirectOrGroupChannel || allowedChannels.includes(channelId)

  return (
    <div className='JoinPanel'>
      {shouldAllowChannel ? (
        <>
          <p>Connect to {channel?.display_name !== '' ? '"' + channel?.display_name + '"' : 'Direct'} room? </p>
          <button
            onClick={() => {
              handleConnect().catch((e) => {
                console.error(e)
              })
            }}
          >
            Join conference
          </button>
        </>
      ) : (
        <p>Conference not available for this channel</p>
      )}
    </div>
  )
}
