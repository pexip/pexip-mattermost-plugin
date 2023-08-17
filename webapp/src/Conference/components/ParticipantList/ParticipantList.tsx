import React, { Component } from 'react'
import { ConferenceManager } from '../../../services/conference-manager'

import type { Subscription } from 'rxjs'
import type { Participant } from '../../../types/participant'

import './ParticipantList.scss'

interface ParticipantListState {
  participants: Participant[]
}

export class ParticipantList extends Component<any, ParticipantListState> {
  private participantsSubscription: Subscription

  state = {
    participants: []
  }

  componentDidMount (): void {
    this.participantsSubscription = ConferenceManager.participants$.subscribe((participants) => {
      this.setState({ participants })
    })
  }

  componentWillUnmount (): void {
    this.participantsSubscription.unsubscribe()
  }

  render (): JSX.Element {
    return <div className='ParticipantList'>
      <h3>Participants</h3>
      <ul>
        {this.state.participants.map((participant: Participant, index: number) => <li key={index}>{ participant.display_name }</li>)}
      </ul>
    </div>
  }
}

export default ParticipantList
