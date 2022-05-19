import * as React from 'react';
import { Component } from 'react';

import { CallManager } from '../services/callManager';

import './Call.scss';
import { Toolbar } from './components/Toolbar/Toolbar';

export class Call extends Component {

  private mainVideoRef = React.createRef<HTMLVideoElement>();
  private localVideoRef = React.createRef<HTMLVideoElement>();
  private secondaryVideoRef = React.createRef<HTMLVideoElement>();

  render() {
    let content;
    if (CallManager.getState() === 'ACTIVE') {
      content = (
        <>
          <video className='main' autoPlay playsInline ref={this.mainVideoRef}/>
          <div className='pip'>
            <video className='local' autoPlay playsInline ref={this.localVideoRef}/>
            <video className='secondary' autoPlay playsInline ref={this.secondaryVideoRef}
              onClick={() => this.onToggleMainVideo()}/>
          </div>
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
      if (video) video.srcObject = stream;
    });
    CallManager.mainStream$.subscribe((stream) => {
      const video = this.mainVideoRef.current;
      if (video) video.srcObject = stream;
    });
    CallManager.secondaryStream$.subscribe((stream) => {
      const video = this.secondaryVideoRef.current;
      if (video) video.srcObject = stream;
    });
  }

  private onToggleMainVideo() {
    CallManager.toggleMainVideo();
  }

  private onConnect() {
    CallManager.connect();
    this.setState({});
  }

  private onDisconnect() {
    this.setState({});
  }

}
