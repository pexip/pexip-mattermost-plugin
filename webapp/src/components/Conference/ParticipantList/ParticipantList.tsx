import React from 'react'

import type { Participant } from '@pexip/infinity'
import { useConferenceContext } from '@contexts/ConferenceContext/ConferenceContext'

import './ParticipantList.scss'

export const ParticipantList = (): JSX.Element => {
  const { state } = useConferenceContext()

  return <div className='ParticipantList'>
    <h3>Participants</h3>
    <ul>
      {state.participants.map((participant: Participant, index: number) => <li key={index}>{ participant.displayName }</li>)}
    </ul>
  </div>
}
