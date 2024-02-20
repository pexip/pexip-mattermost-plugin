import React from 'react'

import { getMattermostStore } from '../../utils'
import { useConferenceContext } from '../../contexts/ConferenceContext/ConferenceContext'

import './JoinPanel.scss'

export const JoinPanel = (): JSX.Element => {
  const { connect } = useConferenceContext()

  // constructor (props: any) {
  //   super(props)
  //   const store = getMattermostStore()
  //   const state = store.getState()
  //   const channelId = state.entities.channels.currentChannelId
  //   const channel = state.entities.channels.channels[channelId]
  //   this.state = { channel }
  //   // ConferenceManager.setChannel(channel)
  // }

  // private onConnect (): void {
  //   // ConferenceManager.connect()
  // }

  // async componentDidMount (): Promise<void> {
  //   const store = getMattermostStore()
  //   store.subscribe(() => {
  //     const state = store.getState()
  //     const channelId = state.entities.channels.currentChannelId
  //     if (this.state.channel.id !== channelId) {
  //       const channel = state.entities.channels.channels[channelId]
  //       this.setState({ channel })
  //       // ConferenceManager.setChannel(channel)
  //     }
  //   })
  // }

  const handleConnect = async (): Promise<void> => {
    const conferenceAlias = ''
    const displayName = 'Marcos'
    await connect(conferenceAlias, displayName)
  }

  const store = getMattermostStore()
  const state = store.getState()

  const channelId = state.entities.channels.currentChannelId
  const channel = state.entities.channels.channels[channelId]

  const isChannel = channel.team_id !== ''

  let component
  if (isChannel) {
    component = <>
      <p>Connect to {'"' + channel.display_name + '"'} room? </p>
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
