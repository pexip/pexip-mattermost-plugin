import React from 'react'
import { Button, Icon, IconTypes } from '@pexip/components'
import type { Participant } from '@pexip/infinity'
import { useConferenceContext } from 'src/App/contexts/ConferenceContext/ConferenceContext'
import { Tooltip } from 'src/App/components/Tooltip/Tooltip'

import './ParticipantList.scss'

export const ParticipantList = (): JSX.Element => {
  const { state } = useConferenceContext()

  const handleAdmitParticipant = async (participant: Participant): Promise<void> => {
    await state.client?.admit({ participantUuid: participant.uuid })
  }

  return (
    <div className='ParticipantList' data-testid='ParticipantList'>
      <h3>Participants</h3>
      <ul>
        {state.participants.map((participant: Participant, index: number) => (
          <li key={index}>
            <span className='ParticipantName'>{participant.displayName}</span>
            <div className='ParticipantStatus'>
              {participant.isWaiting && (
                <Tooltip text='Admit guest participant' position='bottomLeft'>
                  <Button
                    variant='secondary'
                    colorScheme='light'
                    className='AdmitButton'
                    data-testid='AdmitButton'
                    onClick={() => {
                      handleAdmitParticipant(participant).catch(console.error)
                    }}
                  >
                    Admit
                  </Button>
                </Tooltip>
              )}
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
