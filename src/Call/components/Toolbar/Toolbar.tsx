import * as React from 'react';
import { Component } from 'react';

import ReactTooltip from 'react-tooltip';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDesktop,
  faMicrophone,
  faMicrophoneSlash,
  faPowerOff,
  faVideo,
  faVideoSlash
} from '@fortawesome/free-solid-svg-icons';

import { CallManager } from '../../../services/callManager';

import './Toolbar.scss';

interface IProps {
  onDisconnect: Function;
}

export class Toolbar extends Component<IProps> {

  render() {
    return (
      <div className='Toolbar'>
        <button data-tip={ CallManager.isAudioMute() ? 'Unmute audio' : 'Mute audio'} data-for='tooltip'
          onClick={ () => this.onToggleMuteAudio() }>
            <FontAwesomeIcon icon={ CallManager.isAudioMute() ? faMicrophoneSlash : faMicrophone }/>
        </button>
        <button data-tip={ CallManager.isVideoMute() ? 'Unmute video' : 'Mute video'} data-for='tooltip'
          onClick={ () => this.onToggleMuteVideo() }>
            <FontAwesomeIcon icon={ CallManager.isVideoMute() ? faVideoSlash : faVideo }/>
        </button>
        <button data-tip='Share screen' data-for='tooltip'
          onClick={ () => this.onShareScreen() }>
            <FontAwesomeIcon icon={ faDesktop } className={CallManager.isSharingScreen() ? 'selected': ''}/>
        </button>
        <button data-tip='Disconnect' data-for='tooltip'
          onClick={ () => this.onDisconnect() }>
            <FontAwesomeIcon icon={ faPowerOff }/>
        </button>
        <ReactTooltip
            id='tooltip'
            place='bottom'
            effect='solid'
            multiline={false}
          />
      </div>
    );
  }

  private onToggleMuteAudio() {
    CallManager.toggleAudioMute();
    this.setState({});
  }

  private onToggleMuteVideo() {
    CallManager.toggleVideoMute();
    this.setState({});
  }

  private onShareScreen() {
    CallManager.shareScreen();
  }
  
  private onDisconnect() {
    CallManager.disconnect();
    this.props.onDisconnect();
  }
  
}