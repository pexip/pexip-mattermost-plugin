import { faArrowRight, faExchange } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { Component } from 'react';
import ReactTooltip from 'react-tooltip';

import { CallManager } from '../services/callManager';

import './Call.scss';
import { Toolbar } from './components/Toolbar/Toolbar';

export class Call extends Component {

  private pipRef = React.createRef<HTMLDivElement>();

  private mainVideoRef = React.createRef<HTMLVideoElement>();
  private localVideoRef = React.createRef<HTMLVideoElement>();
  private secondaryVideoRef = React.createRef<HTMLVideoElement>();

  render() {
    let content;
    if (CallManager.getState() === 'ACTIVE') {
      content = (
        <>
          <div className='video-container main'>
            <video autoPlay playsInline ref={this.mainVideoRef}/>
          </div>
          <div className='pip' ref={this.pipRef}>
            <div className='video-container local'>
              <video autoPlay playsInline ref={this.localVideoRef}/>
            </div>
            <div className='video-container secondary' style={{display: 'none'}}>
              <video autoPlay playsInline ref={this.secondaryVideoRef}/>
              <div className='exchange-panel' onClick={() => this.onToggleMainVideo()} data-tip='Exchange videos' data-for='tooltip-call'>
                <FontAwesomeIcon icon={faExchange} />
              </div>
            </div>
            <button className='toggle-pip-button' onClick={(event) => this.onTogglePip(event)} data-tip={'Hide pip'} data-for='tooltip-call'>
              <FontAwesomeIcon icon={faArrowRight}/>
            </button>
          </div>
          <ReactTooltip
            id='tooltip-call'
            place='bottom'
            effect='solid'
            multiline={false}
          />
          <Toolbar onDisconnect={ () => this.onDisconnect() }/>
        </>
      );
    } else {
      content = (
        <button className='join-vmr' onClick={() => this.onConnect()}>
          {'Join "' + CallManager.getChannel() +'" VMR'}
        </button>
      );
    }
    return <div className='Call'>{ content }</div>;
  }

  componentDidMount() {
    CallManager.localStream$.subscribe((stream) => {
      const video = this.localVideoRef.current;
      if (video) {
        video.srcObject = stream;
        if (stream) {
          video.style.display = 'block';
        } else {
          video.style.display = 'none';
        }
      }
    });
    CallManager.mainStream$.subscribe((stream) => {
      const video = this.mainVideoRef.current;
      if (video) video.srcObject = stream;
    });
    CallManager.secondaryStream$.subscribe((stream) => {
      const video = this.secondaryVideoRef.current;
      if (video) {
        video.srcObject = stream;
        if (stream) {
          video.parentElement.style.display = 'block';
        } else {
          video.parentElement.style.display = 'none';
        }
      }
    });
  }

  private onToggleMainVideo() {
    CallManager.toggleMainVideo();
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

  private onConnect() {
    CallManager.connect();
    this.setState({});
  }

  private onDisconnect() {
    this.setState({});
  }

}
