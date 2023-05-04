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

import { ConferenceManager } from '../../../services/conference-manager';

import './Toolbar.scss';

interface IProps {
  onDisconnect: Function;
}

export class Toolbar extends Component<IProps> {

  private subscriptionMainStream: Subscription;

  render() {
    return (
      <div className='Toolbar'>
        <button data-tip={ ConferenceManager.isAudioMute() ? 'Unmute audio' : 'Mute audio'} data-for='tooltip-toolbar'
          onClick={ () => this.onToggleMuteAudio() }>
            <FontAwesomeIcon icon={ ConferenceManager.isAudioMute() ? faMicrophoneSlash : faMicrophone }/>
        </button>
        <button data-tip={ ConferenceManager.isVideoMute() ? 'Unmute video' : 'Mute video'} data-for='tooltip-toolbar'
          onClick={ () => this.onToggleMuteVideo() }>
            <FontAwesomeIcon icon={ ConferenceManager.isVideoMute() ? faVideoSlash : faVideo }/>
        </button>
        <button data-tip={(ConferenceManager.isSharingScreen() ? 'Stop' : 'Start') + ' sharing screen'} data-for='tooltip-toolbar'
          onClick={ () => this.onShareScreen()} className={ConferenceManager.isSharingScreen() ? 'selected': ''}>
            <FontAwesomeIcon icon={ faDesktop }/>
        </button>
        <button className='disconnect' data-tip='Disconnect' data-for='tooltip-toolbar'
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
    ConferenceManager.toggleAudioMute();
    this.setState({});
  }

  private onToggleMuteVideo() {
    ConferenceManager.toggleVideoMute();
    this.setState({});
  }

  private onShareScreen() {
    ConferenceManager.shareScreen();
    // If the other end start present, hide the update the sharing button state
    this.subscriptionMainStream?.unsubscribe();
    if (ConferenceManager.isSharingScreen()) {
      this.subscriptionMainStream = ConferenceManager.mainStream$.subscribe(() => {
        if (!ConferenceManager.isSharingScreen()) {
          this.subscriptionMainStream.unsubscribe();
          this.setState({});
        }
      });
    }
    this.setState({});
  }
  
  private onDisconnect() {
    ConferenceManager.disconnect();
    this.props.onDisconnect();
  }
  
}