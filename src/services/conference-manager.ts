import { BehaviorSubject } from 'rxjs';

export enum ConnectionState {
  Disconnected,
  Connected,
  Connecting,
  Error
}

export interface ConferenceConfig {
  node: URL;
  displayName: string;
  vmrPrefix: string;
  channel: string;
  hostPin: string;
}

export class ConferenceManager {

  private static config: ConferenceConfig = null;

  private static pexrtc: any = null;

  private static localStream: MediaStream = null;
  private static remoteStream: MediaStream = null;
  private static presentationStream: MediaStream = null;

  private static presentationInMain: boolean = false;

  private static error: string = '';

  static localStream$ = new BehaviorSubject<MediaStream>(null);
  static mainStream$ = new BehaviorSubject<MediaStream>(null);
  static secondaryStream$ = new BehaviorSubject<MediaStream>(null);
  static connectionState$ = new BehaviorSubject<ConnectionState>(ConnectionState.Disconnected);

  static async connect () {

    console.log('Initialization conference with the following values:');
    console.log('Node: ' + ConferenceManager.config.node);
    console.log('Display Name: ' + ConferenceManager.config.displayName);
    console.log('VMR Prefix: ' + ConferenceManager.config.vmrPrefix)
    console.log('Channel: ' + ConferenceManager.config.channel);
    console.log('Host PIN: ' + ConferenceManager.config.hostPin);

    ConferenceManager.connectionState$.next(ConnectionState.Connecting);

    ConferenceManager.pexrtc = new PexRTC();
    ConferenceManager.pexrtc.onSetup = ConferenceManager.onSetup;
    ConferenceManager.pexrtc.onConnect = ConferenceManager.onConnect;
    ConferenceManager.pexrtc.onScreenshareConnected = ConferenceManager.onScreenshareConnected;
    ConferenceManager.pexrtc.onScreenshareStopped= ConferenceManager.onScreenshareStopped;
    ConferenceManager.pexrtc.onPresentation = ConferenceManager.onPresentation;
    ConferenceManager.pexrtc.onPresentationConnected = ConferenceManager.onPresentationConnected;
    ConferenceManager.pexrtc.onPresentationDisconnected = ConferenceManager.onPresentationDisconnected;
    ConferenceManager.pexrtc.onError = ConferenceManager.onError;
    ConferenceManager.pexrtc.makeCall(ConferenceManager.config.node, ConferenceManager.config.vmrPrefix + ConferenceManager.config.channel);

    // Change the color of the channel button
    const button = document.getElementById('pexip-vmr-plugin-button');
    button.style.color = 'var(--button-bg)';

    // Disconnect when closing Mattermost app
    addEventListener('beforeunload', () => ConferenceManager.disconnect());

    // TODO: Show error when cannot connect

  }

  static disconnect () {
    ConferenceManager.pexrtc.disconnect();
    ConferenceManager.pexrtc = null;
    // Change the color of the channel button
    const button = document.getElementById('pexip-vmr-plugin-button');
    button.style.color = 'inherit';
    ConferenceManager.connectionState$.next(ConnectionState.Disconnected);
  }

  static toggleAudioMute () {
    ConferenceManager.pexrtc.muteAudio(!ConferenceManager.pexrtc.mutedAudio);
  }

  static toggleVideoMute () {
    ConferenceManager.pexrtc.muteVideo(!ConferenceManager.pexrtc.mutedVideo);
    if (ConferenceManager.pexrtc.mutedVideo) {
      ConferenceManager.localStream$.next(null);
    } else {
      ConferenceManager.localStream$.next(ConferenceManager.localStream);
    }
  }

  static shareScreen () {
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

  static getState () {
    return ConferenceManager.pexrtc?.state;
  }

  static isPresentationInMain () {
    return this.presentationInMain;
  }

  static isAudioMute () {
    return ConferenceManager.pexrtc?.mutedAudio;
  }

  static isVideoMute () {
    return ConferenceManager.pexrtc?.mutedVideo;
  }

  static isSharingScreen () {
    return !!ConferenceManager.pexrtc?.screenshare_requested;
  }

  static setConfig (config: ConferenceConfig) {
    ConferenceManager.config = config;
  }

  static getConfig () {
    return ConferenceManager.config;
  }

  static toggleMainVideo () {
    ConferenceManager.presentationInMain = !ConferenceManager.presentationInMain;
    if (ConferenceManager.isPresentationInMain()) {
      ConferenceManager.mainStream$.next(ConferenceManager.presentationStream);
      ConferenceManager.secondaryStream$.next(ConferenceManager.remoteStream);
    } else {
      ConferenceManager.mainStream$.next(ConferenceManager.remoteStream);
      ConferenceManager.secondaryStream$.next(ConferenceManager.presentationStream);
    }
  }

  static getError () {
    return ConferenceManager.error;
  }

  private static onSetup (stream: MediaStream, pin_status: string, conference_extension: string) {
    ConferenceManager.localStream = stream;
    ConferenceManager.localStream$.next(stream);
    ConferenceManager.pexrtc.connect(ConferenceManager.config.hostPin);
  }

  private static onConnect (stream: MediaStream) {
    ConferenceManager.remoteStream = stream;
    ConferenceManager.mainStream$.next(stream);
    ConferenceManager.connectionState$.next(ConnectionState.Connected);
  }

  private static onScreenshareConnected (stream: MediaStream) {
    console.log('On Screenshare Connected');
    if (ConferenceManager.isPresentationInMain()) {
      ConferenceManager.toggleMainVideo();
    }
    ConferenceManager.presentationStream = stream;
    ConferenceManager.secondaryStream$.next(stream);
  }

  private static onScreenshareStopped (reason: string) {
    console.log('On Screenshare Stopped');
    if (ConferenceManager.isPresentationInMain()) {
      ConferenceManager.toggleMainVideo();
    }
    ConferenceManager.presentationStream = null;
    ConferenceManager.secondaryStream$.next(null);
  }

  private static onPresentation (setting: boolean, presenter: string, uuid: string) {
    console.log('On Presentation');
    if (setting) {
      ConferenceManager.pexrtc.getPresentation();
    }
  }

  private static onPresentationConnected (stream: MediaStream) {
    console.log('On Presentation Connected');
    ConferenceManager.presentationStream = stream;
    if (!ConferenceManager.isPresentationInMain()) {
      ConferenceManager.toggleMainVideo();
    }
    ConferenceManager.mainStream$.next(stream);
  }

  private static onPresentationDisconnected (reason: string) {
    console.log('On Presentation Disconnected');
    if (!ConferenceManager.isSharingScreen()) {
      ConferenceManager.presentationStream = null;
      if (ConferenceManager.isPresentationInMain()) {
        ConferenceManager.toggleMainVideo();
      }
      ConferenceManager.secondaryStream$.next(null);
    }
  }

  private static onError (error: string) {
    ConferenceManager.error = error;
    ConferenceManager.connectionState$.next(ConnectionState.Error);
  }

}