import React from 'react'

import { Icon, IconTypes } from '@pexip/components'
import { useConferenceContext } from '@contexts/ConferenceContext/ConferenceContext'
import { Tooltip } from '@components/Tooltip/Tooltip'

import './Toolbar.scss'

export const Toolbar = (): JSX.Element => {
  const { toggleMuteAudio, toggleMuteVideo, togglePresenting, disconnect, state } = useConferenceContext()
  const { isAudioMuted, isVideoMuted, isPresenting } = state

  return (
    <div className='Toolbar'>
      <Tooltip text={ isAudioMuted ? 'Unmute audio' : 'Mute audio'}>
        <button onClick={ () => { toggleMuteAudio().catch((e) => { console.error(e) }) }}>
            <Icon source={ isAudioMuted ? IconTypes.IconMicrophoneOff : IconTypes.IconMicrophoneOn }/>
        </button>
      </Tooltip>
      <Tooltip text={ isVideoMuted ? 'Unmute video' : 'Mute video'}>
        <button onClick={ () => { toggleMuteVideo().catch((e) => { console.error(e) }) }}>
            <Icon source={ isVideoMuted ? IconTypes.IconVideoOff : IconTypes.IconVideoOn }/>
        </button>
      </Tooltip>
      <Tooltip text={(isPresenting ? 'Stop' : 'Start') + ' sharing screen'}>
        <button onClick={ () => { togglePresenting().catch((e) => { console.error(e) }) }} className={state.isPresenting ? 'selected' : ''}>
            <Icon source={ IconTypes.IconPresentationOn }/>
        </button>
      </Tooltip>
      <Tooltip text='Disconnect'>
        <button className='disconnect' onClick={() => { disconnect().catch((e) => { console.error(e) }) }}>
            <Icon source={ IconTypes.IconLeave }/>
        </button>
      </Tooltip>
    </div>
  )

  // private onShareScreen (): void {
  //   ConferenceManager.shareScreen()
  //   // If the other end start present, hide the update the sharing button state
  //   this.subscriptionMainStream?.unsubscribe()
  //   if (ConferenceManager.isSharingScreen()) {
  //     this.subscriptionMainStream = ConferenceManager.mainStream$.subscribe(() => {
  //       if (!ConferenceManager.isSharingScreen()) {
  //         this.subscriptionMainStream.unsubscribe()
  //         this.setState({})
  //       }
  //     })
  //   }
  //   this.setState({})
  // }
}
