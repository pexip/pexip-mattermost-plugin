import React, { Component } from 'react'
import { faArrowRight, faExchange } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReactTooltip from 'react-tooltip'

import { ConferenceManager } from '../services/conference-manager'
import { Toolbar } from './components/Toolbar/Toolbar'

import './Conference.scss'

interface VideoProps {
  mediaStream: MediaStream | null
}

const Video = React.memo((props: VideoProps) => {
  return <video autoPlay playsInline ref={(element) => {
    if (element != null) element.srcObject = props.mediaStream
  }}/>
})
Video.displayName = 'Video'

interface ConferenceState {
  localStream: MediaStream | null
  mainStream: MediaStream | null
  secondaryStream: MediaStream | null
}

export class Conference extends Component<any, ConferenceState> {
  private channelDisplayName: string

  private readonly pipRef = React.createRef<HTMLDivElement>()

  render (): JSX.Element {
    return (
      <div className='Conference'>
        <div className='header'>{this.channelDisplayName} Room</div>
        <div className='conference-container'>
          <div className='video-container main'>
            <Video mediaStream={this.state.mainStream} />
          </div>
          <div className='pip' ref={this.pipRef}>
            {this.state.localStream != null && (
              <div className='video-container local'>
                <Video mediaStream={this.state.localStream} />
              </div>
            )}
            {this.state.secondaryStream != null && (
              <div className='video-container secondary'>
                <Video mediaStream={this.state.secondaryStream} />
                <div className='exchange-panel' onClick={() => { this.onToggleMainVideo() }} data-tip='Exchange videos' data-for='tooltip-call'>
                  <FontAwesomeIcon icon={faExchange} />
                </div>
              </div>
            )}
            {(this.state.localStream != null || this.state.secondaryStream != null) && (
              <button className='toggle-pip-button' onClick={(event) => { this.onTogglePip(event) }} data-tip={'Hide pip'} data-for='tooltip-call'>
                <FontAwesomeIcon icon={faArrowRight}/>
              </button>
            )}
          </div>
          <ReactTooltip
            id='tooltip-call'
            place='bottom'
            effect='solid'
            multiline={false}
          />
          <Toolbar onDisconnect={ () => { this.onDisconnect() }}/>
        </div>
      </div>
    )
  }

  componentDidMount (): void {
    ConferenceManager.localStream$.subscribe((localStream) => {
      this.setState({ localStream })
    })
    ConferenceManager.mainStream$.subscribe((mainStream) => {
      this.setState({ mainStream })
    })
    ConferenceManager.secondaryStream$.subscribe((secondaryStream) => {
      this.setState({ secondaryStream })
    })
    this.channelDisplayName = ConferenceManager.getChannel().display_name
  }

  private onToggleMainVideo (): void {
    ConferenceManager.toggleMainVideo()
  }

  private onTogglePip (event: React.MouseEvent): void {
    this.pipRef.current?.classList.toggle('closed')
    const element = event.currentTarget as HTMLButtonElement
    const closed = this.pipRef.current?.classList.contains('closed') ?? false
    if (closed) {
      element.setAttribute('data-tip', 'Show pip')
    } else {
      element.setAttribute('data-tip', 'Hide pip')
    }
  }

  private onDisconnect (): void {
    this.setState({})
  }
}