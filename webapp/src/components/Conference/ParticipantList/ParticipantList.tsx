import React from 'react'
import { Icon, IconTypes } from '@pexip/components'
import type { Participant } from '@pexip/infinity'
import { useConferenceContext } from '@contexts/ConferenceContext/ConferenceContext'
import { Tooltip } from '@components/Tooltip/Tooltip'

import './ParticipantList.scss'

export const ParticipantList = (): JSX.Element => {
  const { state } = useConferenceContext()

  return (
    <div className='ParticipantList' data-testid='ParticipantList'>
      <h3>Participants</h3>
      <ul>
        {state.participants.map((participant: Participant, index: number) => (
          <li key={index}>
            <span className='ParticipantName'>{participant.displayName}</span>
            <div className='ParticipantStatus'>
              {participant.isMuted && (
                <Tooltip text='Microphone muted' position='bottomLeft'>
                  <Icon source={IconTypes.IconMicrophoneOff} data-testid='MicrophoneMutedIcon' />
                </Tooltip>
              )}
              {participant.isCameraMuted && (
                <Tooltip text='Camera muted' position='bottomLeft'>
                  <Icon source={IconTypes.IconVideoOff} data-testid='CameraMutedIcon' />
                </Tooltip>
              )}
              {participant.isPresenting && (
                <Tooltip text='Sharing screen' position='bottomLeft'>
                  <Icon source={IconTypes.IconPresentationOn} data-testid='PresentingIcon' />
                </Tooltip>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
