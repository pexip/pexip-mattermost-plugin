import React, { useEffect, useMemo, useState } from 'react'

import { Icon, IconTypes, Video } from '@pexip/components'
import { useConferenceContext } from '@contexts/ConferenceContext/ConferenceContext'
import { Toolbar } from './Toolbar/Toolbar'
import { ParticipantList } from './ParticipantList/ParticipantList'
import { Tooltip } from '../Tooltip/Tooltip'
import { Selfview } from '@pexip/media-components'
import { type UserSettings, setUserSettingsEventListener } from 'src/utils/user-settings'

import './Conference.scss'

export const Conference = (): JSX.Element => {
  const { state, swapVideos, changeDevices } = useConferenceContext()
  const {
    channel,
    localStream,
    remoteStream,
    audioSinkId,
    videoMuted,
    presentationStream,
    presentationInMain
  } = state

  const pipRef = React.createRef<HTMLDivElement>()
  const [pipHidden, setPipHidden] = useState(false)

  const handleTogglePip = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    pipRef.current?.classList.toggle('closed')
    setPipHidden(!pipHidden)
  }

  const videoTracks = localStream?.getVideoTracks()
  const videoTrackId = videoTracks != null && videoTracks.length !== 0 ? videoTracks[0].id : ''

  // Only re-render the selfie if the videoTrack id changes
  const selfie = useMemo((): JSX.Element => {
    return <Selfview localMediaStream={localStream} isVideoInputMuted={false} shouldShowUserAvatar={false} username={''} data-testid='SelfView'/>
  }, [videoTrackId])

  const handleUserSettings = (userSettings: UserSettings): void => {
    changeDevices(userSettings).catch((e) => { console.error(e) })
  }

  useEffect(() => {
    // Subscribe to changes after each rendering
    setUserSettingsEventListener(handleUserSettings)
  })

  return (
    <div className='Conference' data-testid='Conference'>
      <div className='header'>{channel?.display_name} Room</div>
      <div className='conference-container'>

        <div className='video-container main'>
          <Video srcObject={presentationInMain ? presentationStream : remoteStream} data-testid='MainVideo' sinkId={audioSinkId} />
        </div>

        <div className='pip' ref={pipRef}>

          {(localStream != null && !videoMuted) && (
            <div className='video-container local'>
              {selfie}
            </div>
          )}

          {presentationStream != null && (
            <div className='video-container secondary'>
              <Video srcObject={!presentationInMain ? presentationStream : remoteStream} sinkId={audioSinkId} />
              <Tooltip text='Swap videos' position='bottomCenter' className='SwapVideosTooltipContainer'>
                <div className='exchange-panel' onClick={swapVideos}>
                  <Icon source={IconTypes.IconArrowRight} />
                  <Icon source={IconTypes.IconArrowLeft} />
                </div>
              </Tooltip>
            </div>
          )}

          {((localStream != null && !videoMuted) || presentationStream != null) && (
            <Tooltip text={pipHidden ? 'Show videos' : 'Hide videos'} position='bottomLeft' className='TogglePipTooltipContainer'>
              <button className='toggle-pip-button' data-testid='TogglePipButton' onClick={handleTogglePip}>
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
