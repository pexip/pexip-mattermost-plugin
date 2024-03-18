import React, { useState } from 'react'

import { Icon, IconTypes, Video } from '@pexip/components'
import { useConferenceContext } from '@contexts/ConferenceContext/ConferenceContext'
import { Toolbar } from './Toolbar/Toolbar'
import { ParticipantList } from './ParticipantList/ParticipantList'
import { Tooltip } from '../Tooltip/Tooltip'
import { Selfview } from '@pexip/media-components'

import './Conference.scss'

export const Conference = (): JSX.Element => {
  const { state, swapVideos } = useConferenceContext()
  const {
    channel,
    localStream,
    remoteStream,
    presentationStream,
    presentationInMain
  } = state

  const pipRef = React.createRef<HTMLDivElement>()
  const [pipHidden, setPipHidden] = useState(false)

  const handleTogglePip = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    pipRef.current?.classList.toggle('closed')
    setPipHidden(!pipHidden)
  }

  return (
    <div className='Conference'>
      <div className='header'>{channel?.display_name} Room</div>
      <div className='conference-container'>

        <div className='video-container main'>
          <Video srcObject={presentationInMain ? presentationStream : remoteStream} />
        </div>

        <div className='pip' ref={pipRef}>

          {localStream != null && (
            <div className='video-container local'>
              <Selfview localMediaStream={localStream} isVideoInputMuted={false} shouldShowUserAvatar={false} username={''}/>
            </div>
          )}

          {presentationStream != null && (
            <div className='video-container secondary'>
              <Video srcObject={!presentationInMain ? presentationStream : remoteStream} />
              <Tooltip text='Swap videos' position='bottomCenter' className='SwapVideosTooltipContainer'>
                <div className='exchange-panel' onClick={swapVideos}>
                  <Icon source={IconTypes.IconArrowRight} />
                  <Icon source={IconTypes.IconArrowLeft} />
                </div>
              </Tooltip>
            </div>
          )}

          {(localStream != null || presentationStream != null) && (
            <Tooltip text={pipHidden ? 'Show videos' : 'Hide videos'} position='bottomLeft' className='TogglePipTooltipContainer'>
              <button className='toggle-pip-button' onClick={handleTogglePip}>
                <Icon source={IconTypes.IconArrowRight}/>
              </button>
            </Tooltip>
          )}

        </div>

        <Toolbar/>
      </div>
      <ParticipantList />
    </div>
  )
}
