import React from 'react';
import { ConferenceManager } from '../services/conference-manager';

import './JoinPanel.scss';

const JoinButton = () => {
  const onConnect = () => {
    ConferenceManager.connect();
  };

  return (
    <div className='JoinPanel'>
      <p>Connect to "{ConferenceManager.getConfig().mattermostChannel}" room? </p>
      <button className='join-button' onClick={onConnect}>
        Join conference
      </button>
    </div>
  );
}

export default JoinButton;
