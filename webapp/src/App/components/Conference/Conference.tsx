import React, { useEffect, useState } from 'react'
import { Icon, IconTypes, Video } from '@pexip/components'
import { useConferenceContext } from 'src/App/contexts/ConferenceContext/ConferenceContext'
import { Toolbar } from './Toolbar/Toolbar'
import { ParticipantList } from './ParticipantList/ParticipantList'
import { Tooltip } from '../Tooltip/Tooltip'
import { Selfview } from '@pexip/media-components'
import { type UserSettings, settingsEventEmitter } from '@utils/user-settings'

import './Conference.scss'

export const Conference = (): JSX.Element => {
  const { state, swapVideos, changeDevices, changeEffect, disconnect } = useConferenceContext()
  const {
    channel,
    localVideoStream,
    processedVideoStream,
    remoteStream,
    outputAudioDeviceId,
    videoMuted,
    presentationStream,
    presentationInMain,
    presentationInPopUp
  } = state

  const pipRef = React.createRef<HTMLDivElement>()
  const [pipHidden, setPipHidden] = useState(false)

  const handleTogglePip = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    pipRef.current?.classList.toggle('closed')
    setPipHidden(!pipHidden)
  }

  const handleUserSettings = (userSettings: UserSettings): void => {
    const { inputVideoDeviceId, inputAudioDeviceId, outputAudioDeviceId, effect } = state
    if (
      inputVideoDeviceId !== userSettings.inputVideoDeviceId ||
      inputAudioDeviceId !== userSettings.inputAudioDeviceId ||
      outputAudioDeviceId !== userSettings.outputAudioDeviceId
    ) {
      changeDevices({
        inputVideoDeviceId: userSettings.inputVideoDeviceId,
        inputAudioDeviceId: userSettings.inputAudioDeviceId,
        outputAudioDeviceId: userSettings.outputAudioDeviceId
      }).catch(console.error)
    }
    if (effect !== userSettings.effect) {
      changeEffect(userSettings.effect).catch(console.error)
    }
  }

  useEffect(() => {
    settingsEventEmitter.addListener('settingschange', handleUserSettings)
    return (): void => {
      settingsEventEmitter.removeListener('settingschange', handleUserSettings)
    }
  }, [state])

  useEffect(() => {
    return () => {
      disconnect().catch(console.error)
    }
  }, [])

  return (
    <div className='Conference' data-testid='Conference'>
      <div className='header'>{channel?.display_name} Room</div>
      <div className='conference-container'>
        <div className='video-container main'>
          <Video
            srcObject={presentationInMain ? presentationStream : remoteStream}
            data-testid='MainVideo'
            sinkId={outputAudioDeviceId}
          />
        </div>

        <div className='pip' ref={pipRef}>
          {localVideoStream != null && !videoMuted && (
            <div className='video-container local'>
              <Selfview
                localMediaStream={processedVideoStream ?? localVideoStream}
                isVideoInputMuted={false}
                shouldShowUserAvatar={false}
                username={''}
                data-testid='SelfView'
              />
            </div>
          )}

          {presentationStream != null && !presentationInPopUp && (
            <div className='video-container secondary' data-testid='SecondaryVideo'>
              <Video srcObject={!presentationInMain ? presentationStream : remoteStream} sinkId={outputAudioDeviceId} />
              <Tooltip text='Swap videos' position='bottomCenter' className='SwapVideosTooltipContainer'>
                <div className='exchange-panel' onClick={swapVideos}>
                  <Icon source={IconTypes.IconArrowRight} />
                  <Icon source={IconTypes.IconArrowLeft} />
                </div>
              </Tooltip>
            </div>
          )}

          {((localVideoStream != null && !videoMuted) || presentationStream != null) && (
            <Tooltip
              text={pipHidden ? 'Show videos' : 'Hide videos'}
              position='bottomLeft'
              className='TogglePipTooltipContainer'
            >
              <button className='toggle-pip-button' data-testid='TogglePipButton' onClick={handleTogglePip}>
                <Icon source={IconTypes.IconArrowRight} />
              </button>
            </Tooltip>
          )}
        </div>

        <Toolbar />
      </div>
      <ParticipantList />
    </div>
  )
}
