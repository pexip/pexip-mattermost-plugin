import * as React from 'react';

import { CallManager } from '../services/callManager';

import './Call.scss';

export class Call extends React.PureComponent {

  private videoRef = React.createRef<HTMLVideoElement>();

  render() {
    const video = <video ref={this.videoRef}/>;
    const callButton = <button className='join-vmr'
      onClick={() => {
        CallManager.joinConference(this.videoRef.current)
      }}>{'Join "' + CallManager.getChannel() +'" VMR'}
    </button>;
    return (
      <div className='Call'>
        { CallManager.isOnCall() ? video : callButton }
      </div>
    );
  }
  
}
