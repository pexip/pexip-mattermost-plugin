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
import { Subscription } from 'rxjs';

import { CallManager } from '../../../services/callManager';

import './Toolbar.scss';

interface IProps {
  onDisconnect: Function;
}

export class Toolbar extends Component<IProps> {

  private subscriptionMainStream: Subscription;

  render() {
    return (
      <div className='Toolbar'>
        <button data-tip={ CallManager.isAudioMute() ? 'Unmute audio' : 'Mute audio'} data-for='tooltip-toolbar'
          onClick={ () => this.onToggleMuteAudio() }>
            <FontAwesomeIcon icon={ CallManager.isAudioMute() ? faMicrophoneSlash : faMicrophone }/>
        </button>
        <button data-tip={ CallManager.isVideoMute() ? 'Unmute video' : 'Mute video'} data-for='tooltip-toolbar'
          onClick={ () => this.onToggleMuteVideo() }>
            <FontAwesomeIcon icon={ CallManager.isVideoMute() ? faVideoSlash : faVideo }/>
        </button>
        <button data-tip={(CallManager.isSharingScreen() ? 'Stop' : 'Start') + ' sharing screen'} data-for='tooltip-toolbar'
          onClick={ () => this.onShareScreen()} className={CallManager.isSharingScreen() ? 'selected': ''}>
            <FontAwesomeIcon icon={ faDesktop }/>
        </button>
        <button data-tip='Disconnect' data-for='tooltip-toolbar'
          onClick={ () => this.onDisconnect() }>
            <FontAwesomeIcon icon={ faPowerOff }/>
        </button>
        <ReactTooltip
            id='tooltip-toolbar'
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
    // If the other end start present, hide the update the sharing button state
    this.subscriptionMainStream?.unsubscribe();
    if (CallManager.isSharingScreen()) {
      this.subscriptionMainStream = CallManager.mainStream$.subscribe(() => {
        if (!CallManager.isSharingScreen()) {
          this.subscriptionMainStream.unsubscribe();
          this.setState({});
        }
      });
    }
    this.setState({});
  }
  
  private onDisconnect() {
    CallManager.disconnect();
    this.props.onDisconnect();
  }
  
}