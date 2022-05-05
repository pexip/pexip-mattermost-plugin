import React from 'react';
import VmrManager from './lib/VmrManager';

class PexipVmrPlugin {
    initialize(registry, store) {
        registry.registerChannelHeaderButtonAction(
            <i className='icon fa fa-video-camera'/>,
            (channel, participant, other) => VmrManager.startVmr(channel, participant, other, store),
            "Pexip VMR",
        );
    }
}

window.registerPlugin('com.pexip.pexip-vmr', new PexipVmrPlugin());