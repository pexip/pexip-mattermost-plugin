import React from 'react'
import { Icon, IconTypes } from '@pexip/components'
import { useConferenceContext } from '@contexts/ConferenceContext/ConferenceContext'
import { Tooltip } from '@components/Tooltip/Tooltip'
import { openUserSettingsDialog } from 'src/utils/user-settings'

import './Toolbar.scss'

export const Toolbar = (): JSX.Element => {
  const { toggleMuteAudio, toggleMuteVideo, togglePresenting, disconnect, state } = useConferenceContext()
  const { audioMuted, videoMuted, presenting } = state

  return (
    <div className='Toolbar'>
      <Tooltip text={audioMuted ? 'Unmute audio' : 'Mute audio'}>
        <button
          onClick={() => {
            toggleMuteAudio().catch((e) => {
              console.error(e)
            })
          }}
        >
          <Icon source={audioMuted ? IconTypes.IconMicrophoneOff : IconTypes.IconMicrophoneOn} />
        </button>
      </Tooltip>
      <Tooltip text={videoMuted ? 'Unmute video' : 'Mute video'}>
        <button
          onClick={() => {
            toggleMuteVideo().catch((e) => {
              console.error(e)
            })
          }}
        >
          <Icon source={videoMuted ? IconTypes.IconVideoOff : IconTypes.IconVideoOn} />
        </button>
      </Tooltip>
      <Tooltip text={(presenting ? 'Stop' : 'Start') + ' sharing screen'}>
        <button
          onClick={() => {
            togglePresenting().catch((e) => {
              console.error(e)
            })
          }}
          className={presenting ? 'selected' : ''}
        >
          <Icon source={IconTypes.IconPresentationOn} />
        </button>
      </Tooltip>
      <Tooltip text='Settings'>
        <button
          onClick={() => {
            openUserSettingsDialog({
              inputAudioDeviceId: state.inputAudioDeviceId,
              inputVideoDeviceId: state.inputVideoDeviceId,
              outputAudioDeviceId: state.outputAudioDeviceId
            }).catch((e) => {
              console.error(e)
            })
          }}
        >
          <Icon source={IconTypes.IconSettings} />
        </button>
      </Tooltip>
      <Tooltip text='Disconnect'>
        <button
          className='disconnect'
          onClick={() => {
            disconnect().catch((e) => {
              console.error(e)
            })
          }}
        >
          <Icon source={IconTypes.IconLeave} />
        </button>
      </Tooltip>
    </div>
  )
}
