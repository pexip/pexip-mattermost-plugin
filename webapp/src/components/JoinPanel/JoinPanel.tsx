import React, { useEffect, useState } from 'react'

import { useConferenceContext } from '@contexts/ConferenceContext/ConferenceContext'
import type { Channel } from 'mattermost-redux/types/channels'
import { getMattermostStore } from 'src/utils/mattermost-store'

import './JoinPanel.scss'

export const JoinPanel = (): JSX.Element => {
  const { connect } = useConferenceContext()

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

  const isChannel = channel?.team_id !== ''

  let component
  if (isChannel) {
    component = <>
      <p>Connect to {'"' + channel?.display_name + '"'} room? </p>
      <button onClick={ () => { handleConnect().catch((e) => { console.error(e) }) }}>
        Join conference
      </button>
    </>
  } else {
    component = <>
      <p>Video conferences are only available for Channels.</p>
      <p>Select a channel to start!</p>
    </>
  }
  return (
    <div className='JoinPanel'>
      {component}
    </div>
  )
}
