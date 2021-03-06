import { BehaviorSubject } from 'rxjs';

export interface ConferenceConfig {
  node: URL;
  displayName: string;
  mattermostChannel: string;
  vmr: string;
  hostPin: string;
}

export class ConferenceManager {

  private static config: ConferenceConfig = null;

  private static pexrtc: any = null;

  private static localStream: MediaStream = null;
  private static remoteStream: MediaStream = null;
  private static presentationStream: MediaStream = null;

  private static presentationInMain: boolean = false;

  static localStream$ = new BehaviorSubject<MediaStream>(null);
  static mainStream$ = new BehaviorSubject<MediaStream>(null);
  static secondaryStream$ = new BehaviorSubject<MediaStream>(null);

  static async connect() {

    console.log('Initialization conference with the following values:');
    console.log('Node: ' + ConferenceManager.config.node);
    console.log('Display Name: ' + ConferenceManager.config.displayName);
    console.log('Mattermost Channel: ' + ConferenceManager.config.mattermostChannel);
    console.log('Host PIN: ' + ConferenceManager.config.hostPin);

    ConferenceManager.pexrtc = new PexRTC();
    ConferenceManager.pexrtc.onSetup = ConferenceManager.onSetup;
    ConferenceManager.pexrtc.onConnect = ConferenceManager.onConnect;
    ConferenceManager.pexrtc.onScreenshareConnected = ConferenceManager.onScreenshareConnected;
    ConferenceManager.pexrtc.onScreenshareStopped= ConferenceManager.onScreenshareStopped;
    ConferenceManager.pexrtc.onPresentation = ConferenceManager.onPresentation;
    ConferenceManager.pexrtc.onPresentationConnected = ConferenceManager.onPresentationConnected;
    ConferenceManager.pexrtc.onPresentationDisconnected = ConferenceManager.onPresentationDisconnected;
    ConferenceManager.pexrtc.onError = ConferenceManager.onError;
    ConferenceManager.pexrtc.makeCall(ConferenceManager.config.node, ConferenceManager.config.vmr);

    // Change the color of the channel button
    const button = document.getElementById('pexip-vmr-plugin-button');
    button.style.color = 'var(--button-bg)';

    // Disconnect when closing Mattermost app
    addEventListener('beforeunload', () => ConferenceManager.disconnect());

    // TODO: Show error when cannot connect

  }

  static disconnect() {
    ConferenceManager.pexrtc.disconnect();
    ConferenceManager.pexrtc = null;
    // Change the color of the channel button
    const button = document.getElementById('pexip-vmr-plugin-button');
    button.style.color = 'inherit';
  }

  static toggleAudioMute() {
    ConferenceManager.pexrtc.muteAudio(!ConferenceManager.pexrtc.mutedAudio);
  }

  static toggleVideoMute() {
    ConferenceManager.pexrtc.muteVideo(!ConferenceManager.pexrtc.mutedVideo);
    if (ConferenceManager.pexrtc.mutedVideo) {
      ConferenceManager.localStream$.next(null);
    } else {
      ConferenceManager.localStream$.next(ConferenceManager.localStream);
    }
  }

  static shareScreen() {
    //ConferenceManager.pexrtc.present('screen');
    console.log(ConferenceManager.isSharingScreen());
    if (ConferenceManager.isSharingScreen()) {
      ConferenceManager.pexrtc.present(null);
    } else {
      const stream = ConferenceManager.pexrtc.present('screen');
      console.log(stream);
      ConferenceManager.presentationStream = stream;
      ConferenceManager.secondaryStream$.next(stream);
    }
  }

  static getState() {
    return ConferenceManager.pexrtc?.state;
  }

  static isPresentationInMain() {
    return this.presentationInMain;
  }

  static isAudioMute() {
    return ConferenceManager.pexrtc?.mutedAudio;
  }

  static isVideoMute() {
    return ConferenceManager.pexrtc?.mutedVideo;
  }

  static isSharingScreen() {
    return !!ConferenceManager.pexrtc?.screenshare;
  }

  static setConfig(config: ConferenceConfig) {
    ConferenceManager.config = config;
  }

  static getConfig() {
    return ConferenceManager.config;
  }

  static toggleMainVideo() {
    ConferenceManager.presentationInMain = !ConferenceManager.presentationInMain;
    if (ConferenceManager.isPresentationInMain()) {
      ConferenceManager.mainStream$.next(ConferenceManager.presentationStream);
      ConferenceManager.secondaryStream$.next(ConferenceManager.remoteStream);
    } else {
      ConferenceManager.mainStream$.next(ConferenceManager.remoteStream);
      ConferenceManager.secondaryStream$.next(ConferenceManager.presentationStream);
    }
  }

  private static onSetup(stream: MediaStream, pin_status: string, conference_extension: string) {
    ConferenceManager.localStream = stream;
    ConferenceManager.localStream$.next(stream);
    ConferenceManager.pexrtc.connect(ConferenceManager.config.hostPin);
  }

  private static onConnect(stream: MediaStream) {
    ConferenceManager.remoteStream = stream;
    ConferenceManager.mainStream$.next(stream);
  }

  private static onScreenshareConnected(stream: MediaStream) {
    console.log('On Screenshare Connected');
    if (ConferenceManager.isPresentationInMain()) {
      ConferenceManager.toggleMainVideo();
    }
    ConferenceManager.presentationStream = stream;
    ConferenceManager.secondaryStream$.next(stream);
  }

  private static onScreenshareStopped(reason: string) {
    console.log('On Screenshare Stopped');
    if (ConferenceManager.isPresentationInMain()) {
      ConferenceManager.toggleMainVideo();
    }
    ConferenceManager.presentationStream = null;
    ConferenceManager.secondaryStream$.next(null);
  }

  private static onPresentation(setting: boolean, presenter: string, uuid: string) {
    console.log('On Presentation');
    if (setting) {
      ConferenceManager.pexrtc.getPresentation();
    }
  }

  private static onPresentationConnected(stream: MediaStream) {
    console.log('On Presentation Connected');
    ConferenceManager.presentationStream = stream;
    if (!ConferenceManager.isPresentationInMain()) {
      ConferenceManager.toggleMainVideo();
    }
    ConferenceManager.mainStream$.next(stream);
  }

  private static onPresentationDisconnected(reason: string) {
    console.log('On Presentation Disconnected');
    if (!ConferenceManager.isSharingScreen()) {
      ConferenceManager.presentationStream = null;
      if (ConferenceManager.isPresentationInMain()) {
        ConferenceManager.toggleMainVideo();
      }
      ConferenceManager.secondaryStream$.next(null);
    }
  }

  private static onError(error: string) {
    console.error(error);
  }

}