import React from 'react'
import { Icon, IconTypes } from '@pexip/components'
import { useConferenceContext } from '../../../contexts/ConferenceContext/ConferenceContext'
import { Tooltip } from '../../Tooltip/Tooltip'
import { openUserSettingsDialog } from '../../../utils/user-settings'

import './Toolbar.scss'

export const Toolbar = (): JSX.Element => {
  const { toggleMuteAudio, toggleMuteVideo, togglePresenting, togglePresentationInPopUp, disconnect, state } =
    useConferenceContext()
  const {
    audioMuted,
    videoMuted,
    presenting,
    presentationStream,
    presentationInPopUp,
    inputVideoDeviceId,
    inputAudioDeviceId,
    outputAudioDeviceId,
    effect
  } = state

  return (
    <div className='Toolbar'>
      <Tooltip data-testid='AudioMuteTooltip' text={audioMuted ? 'Unmute audio' : 'Mute audio'}>
        <button
          data-testid='AudioMuteButton'
          onClick={() => {
            toggleMuteAudio().catch(console.error)
          }}
        >
          <Icon source={audioMuted ? IconTypes.IconMicrophoneOff : IconTypes.IconMicrophoneOn} />
        </button>
      </Tooltip>
      <Tooltip data-testid='VideoMuteTooltip' text={videoMuted ? 'Unmute video' : 'Mute video'}>
        <button
          data-testid='VideoMuteButton'
          onClick={() => {
            toggleMuteVideo().catch(console.error)
          }}
        >
          <Icon source={videoMuted ? IconTypes.IconVideoOff : IconTypes.IconVideoOn} />
        </button>
      </Tooltip>
      <Tooltip data-testid='PresentingTooltip' text={(presenting ? 'Stop' : 'Start') + ' sharing screen'}>
        <button
          data-testid='PresentingButton'
          onClick={() => {
            togglePresenting().catch(console.error)
          }}
          className={presenting ? 'selected' : ''}
        >
          <Icon source={IconTypes.IconPresentationOn} />
        </button>
      </Tooltip>
      {presentationStream != null && (
        <Tooltip text='Pop-out presentation'>
          <button
            data-testid='PresentationPopOutButton'
            onClick={() => {
              togglePresentationInPopUp().catch(console.error)
            }}
            className={presentationInPopUp ? 'selected' : ''}
          >
            <Icon source={IconTypes.IconOpenInNew} />
          </button>
        </Tooltip>
      )}
      <Tooltip text='Settings'>
        <button
          data-testid='SettingsButton'
          onClick={() => {
            openUserSettingsDialog({
              inputAudioDeviceId,
              inputVideoDeviceId,
              outputAudioDeviceId,
              effect
            }).catch(console.error)
          }}
        >
          <Icon source={IconTypes.IconSettings} />
        </button>
      </Tooltip>
      <Tooltip text='Disconnect'>
        <button
          data-testid='DisconnectButton'
          className='disconnect'
          onClick={() => {
            disconnect().catch(console.error)
          }}
        >
          <Icon source={IconTypes.IconLeave} />
        </button>
      </Tooltip>
    </div>
  )
}
