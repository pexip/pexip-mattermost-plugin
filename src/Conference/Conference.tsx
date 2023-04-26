import { faArrowRight, faExchange } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { Component } from 'react';
import ReactTooltip from 'react-tooltip';

import { ConferenceManager } from '../services/conference-manager';
import { Toolbar } from './components/Toolbar/Toolbar';

import './Conference.scss';

interface VideoProps {
  mediaStream: MediaStream;
}

const Video = React.memo((props: VideoProps) => {
  return <video autoPlay playsInline ref={(element) => {
    if (element) element.srcObject = props.mediaStream;
  }}/>
})

interface ConferenceState {
  localStream: MediaStream;
  mainStream: MediaStream;
  secondaryStream: MediaStream;
}

export class Conference extends Component {

  state: ConferenceState = {
    localStream: null,
    mainStream: null,
    secondaryStream: null
  }

  private pipRef = React.createRef<HTMLDivElement>();

  render() {
    return (
      <div className='Conference'>
        <div className='header'>Channel Room</div>
        <div className='conference-container'>
          <div className='video-container main'>
            <Video mediaStream={this.state.mainStream} />
          </div>
          <div className='pip' ref={this.pipRef}>
            {this.state.localStream && (
              <div className='video-container local'>
                <Video mediaStream={this.state.localStream} />
              </div>
            )}
            {this.state.secondaryStream && (
              <div className='video-container secondary'>
                <Video mediaStream={this.state.secondaryStream} />
                <div className='exchange-panel' onClick={() => this.onToggleMainVideo()} data-tip='Exchange videos' data-for='tooltip-call'>
                  <FontAwesomeIcon icon={faExchange} />
                </div>
              </div>
            )}
            {(this.state.localStream || this.state.secondaryStream) && (
              <button className='toggle-pip-button' onClick={(event) => this.onTogglePip(event)} data-tip={'Hide pip'} data-for='tooltip-call'>
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
          <Toolbar onDisconnect={ () => this.onDisconnect() }/>
        </div>
      </div>
    )
  }

  componentDidMount() {
    ConferenceManager.localStream$.subscribe((stream) => {
      this.setState({localStream: stream});
    });
    ConferenceManager.mainStream$.subscribe((stream) => {
      this.setState({mainStream: stream});
    });
    ConferenceManager.secondaryStream$.subscribe((stream) => {
      this.setState({secondaryStream: stream});
    });
  }

  private onToggleMainVideo() {
    ConferenceManager.toggleMainVideo();
  }

  private onTogglePip(event: React.MouseEvent) {
    this.pipRef.current.classList.toggle('closed');
    const element = event.currentTarget as HTMLButtonElement;
    const closed = this.pipRef.current?.classList.contains('closed');
    if (closed) {
      element.setAttribute('data-tip', 'Show pip');
    } else {
      element.setAttribute('data-tip', 'Hide pip');
    }
  }

  private onDisconnect() {
    this.setState({});
  }

}
