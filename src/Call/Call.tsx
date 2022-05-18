import * as React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { CallManager } from '../services/callManager';

import './Call.scss';
import { faDesktop, faMicrophone, faMicrophoneSlash, faPowerOff, faVideo, faVideoSlash } from '@fortawesome/free-solid-svg-icons';

export class Call extends React.PureComponent {

  private videoRef = React.createRef<HTMLVideoElement>();

  render() {
    const call = (
      <div className='call-container'>
        <video autoPlay playsInline ref={this.videoRef}/>
        <div className='toolbar'>
          <FontAwesomeIcon icon={ CallManager.isAudioMute() ? faMicrophoneSlash : faMicrophone }/>
          <FontAwesomeIcon icon={ CallManager.isVideoMute() ? faVideoSlash : faVideo }/>
          <FontAwesomeIcon icon={ faDesktop } className={CallManager.isSharingScreen() ? 'selected': ''}/>
          <FontAwesomeIcon icon={ faPowerOff }/>
        </div>
      </div>
    );
    const startCallButton = <button className='join-vmr'
      onClick={() => {
        CallManager.connect(this.videoRef);
        this.setState({});
      }}>{'Join "' + CallManager.getChannel() +'" VMR'}
    </button>;
    return (
      <div className='Call'>
        { CallManager.isOnCall() ? call : startCallButton }
      </div>
    );
  }
  
}
