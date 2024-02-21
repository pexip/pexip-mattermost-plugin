import React from 'react'

import { Icon, IconTypes, Video } from '@pexip/components'
import ReactTooltip from 'react-tooltip'
import { useConferenceContext } from '@contexts/ConferenceContext/ConferenceContext'
import { Toolbar } from './Toolbar/Toolbar'
import ParticipantList from './ParticipantList/ParticipantList'

import './Conference.scss'

export const Conference = (): JSX.Element => {
  const { state } = useConferenceContext()

  const pipRef = React.createRef<HTMLDivElement>()

  const handleTogglePip = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    pipRef.current?.classList.toggle('closed')
    const element = event.currentTarget as HTMLButtonElement
    const closed = pipRef.current?.classList.contains('closed') ?? false
    if (closed) {
      element.setAttribute('data-tip', 'Show pip')
    } else {
      element.setAttribute('data-tip', 'Hide pip')
    }
  }

  const handleToggleMainVideo = (): void => {

  }

  return (
    <div className='Conference'>
      <div className='header'>{state.channel?.display_name} Room</div>
      <div className='conference-container'>
        {state.remoteStream != null && (
          <div className='video-container main'>
            <Video srcObject={state.remoteStream} />
          </div>
        )}
        <div className='pip' ref={pipRef}>
          {state.localStream != null && (
            <div className='video-container local'>
              <Video srcObject={state.localStream} />
            </div>
          )}
          {state.remoteStream != null && (
            <div className='video-container secondary'>
              <Video srcObject={state.remoteStream} />
              <div className='exchange-panel' onClick={handleToggleMainVideo} data-tip='Exchange videos' data-for='tooltip-exchange'>
                <Icon source={IconTypes.IconArrowRight} />
                <Icon source={IconTypes.IconArrowLeft} />
              </div>
              <ReactTooltip
                id='tooltip-exchange'
                place='bottom'
                effect='solid'
                multiline={false}
              />
            </div>
          )}
          {(state.localStream != null || state.remoteStream != null) && (
            <>
              <button className='toggle-pip-button' onClick={handleTogglePip} data-tip='Hide pip' data-for='tooltip-toggle-pip'>
                <Icon source={IconTypes.IconArrowRight}/>
              </button>
              <ReactTooltip
                id='tooltip-toggle-pip'
                place='bottom'
                effect='solid'
                multiline={false}
              />
            </>
          )}
        </div>

        <Toolbar/>
      </div>
      <ParticipantList />
    </div>
  )
}

// componentDidMount (): void {
//   ConferenceManager.localStream$.subscribe((localStream) => {
//     this.setState({ localStream })
//   })
//   ConferenceManager.mainStream$.subscribe((mainStream) => {
//     this.setState({ mainStream })
//   })
//   ConferenceManager.secondaryStream$.subscribe((secondaryStream) => {
//     this.setState({ secondaryStream })
//   })
//   this.channelDisplayName = ConferenceManager.getChannel().display_name
// }

// private onToggleMainVideo (): void {
//   ConferenceManager.toggleMainVideo()
// }

//   private onDisconnect (): void {
//     this.setState({})
//   }
// }
