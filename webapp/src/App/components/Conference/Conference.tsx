import React, { useEffect, useState } from 'react'
import { Icon, IconTypes, Video } from '@pexip/components'
import { useConferenceContext } from '../../contexts/ConferenceContext/ConferenceContext'
import { Toolbar } from './Toolbar/Toolbar'
import { ParticipantList } from './ParticipantList/ParticipantList'
import { Tooltip } from '../Tooltip/Tooltip'
import { Selfview } from '@pexip/media-components'
import { type UserSettings, settingsEventEmitter } from '../../utils/user-settings'
import { getPluginServerRoute } from '../../utils/http-requests'
import { type Participant } from '@pexip/infinity'

import './Conference.scss'

const WaitingImageContainer = ({ participants }: { participants: Participant[] }): JSX.Element => (
  <div className='WaitingImageContainer'>
    <img src={`${getPluginServerRoute()}/public/waiting.jpg`} className='WaitingImage' />

    <span>{participants.length === 1 ? 'Waiting for other participants...' : 'Participants without video'}</span>
  </div>
)

export const Conference = (): JSX.Element => {
  const { state, swapVideos, changeDevices, changeEffect } = useConferenceContext()
  const {
    channel,
    localVideoStream,
    processedVideoStream,
    remoteStream,
    outputAudioDeviceId,
    videoMuted,
    presentationStream,
    presentationInMain,
    presentationInPopUp,
    participants,
    directMedia,
    me
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

  const isDirectMediaWaiting = (): boolean => {
    const allParticipantVideoMuted = participants
      .filter((participant) => participant.uuid !== me?.uuid)
      .every((participant) => participant.isCameraMuted)
    return directMedia && (participants.length === 1 || allParticipantVideoMuted)
  }

  useEffect(() => {
    settingsEventEmitter.addListener('settingschange', handleUserSettings)
    return (): void => {
      settingsEventEmitter.removeListener('settingschange', handleUserSettings)
    }
  }, [state])

  return (
    <div className='Conference' data-testid='Conference'>
      <div className='header'>{channel?.display_name} Room</div>
      <div className='conference-container'>
        <div className='video-container main'>
          {isDirectMediaWaiting() && !presentationInMain ? (
            <WaitingImageContainer participants={participants} />
          ) : (
            <Video
              srcObject={presentationInMain ? presentationStream : remoteStream}
              data-testid='MainVideo'
              sinkId={outputAudioDeviceId}
            />
          )}
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
              {isDirectMediaWaiting() && presentationInMain ? (
                <WaitingImageContainer participants={participants} />
              ) : (
                <Video
                  srcObject={!presentationInMain ? presentationStream : remoteStream}
                  sinkId={outputAudioDeviceId}
                />
              )}
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
