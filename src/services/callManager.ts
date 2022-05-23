import { BehaviorSubject } from 'rxjs';

export class CallManager {

  private static node = '';
  private static displayName = '';
  private static channel = '';
  private static hostPin = '1234';

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
    console.log('Node: ' + CallManager.node);
    console.log('Display Name: ' + CallManager.displayName);
    console.log('Channel: ' + CallManager.channel);
    console.log('Host PIN: ' + CallManager.hostPin);

    CallManager.pexrtc = new PexRTC();
    CallManager.pexrtc.onSetup = CallManager.onSetup;
    CallManager.pexrtc.onConnect = CallManager.onConnect;
    CallManager.pexrtc.onScreenshareConnected = CallManager.onScreenshareConnected;
    CallManager.pexrtc.onScreenshareStopped= CallManager.onScreenshareStopped;
    CallManager.pexrtc.onPresentation = CallManager.onPresentation;
    CallManager.pexrtc.onPresentationConnected = CallManager.onPresentationConnected;
    CallManager.pexrtc.onPresentationDisconnected = CallManager.onPresentationDisconnected;
    CallManager.pexrtc.onError = CallManager.onError;
    CallManager.pexrtc.makeCall(CallManager.node, 'room');

    // Change the color of the channel button
    const button = document.getElementById('pexip-vmr-plugin-button');
    button.style.color = 'var(--button-bg)';

    // Disconnect when closing Mattermost app
    addEventListener('beforeunload', () => CallManager.disconnect());

    // TODO: Show error when cannot connect

  }

  static disconnect() {
    CallManager.pexrtc.disconnect();
    CallManager.pexrtc = null;
    // Change the color of the channel button
    const button = document.getElementById('pexip-vmr-plugin-button');
    button.style.color = 'inherit';
  }

  static toggleAudioMute() {
    CallManager.pexrtc.muteAudio(!CallManager.pexrtc.mutedAudio);
  }

  static toggleVideoMute() {
    CallManager.pexrtc.muteVideo(!CallManager.pexrtc.mutedVideo);
    if (CallManager.pexrtc.mutedVideo) {
      CallManager.localStream$.next(null);
    } else {
      CallManager.localStream$.next(CallManager.localStream);
    }
  }

  static shareScreen() {
    //CallManager.pexrtc.present('screen');
    console.log(CallManager.isSharingScreen());
    if (CallManager.isSharingScreen()) {
      CallManager.pexrtc.present(null);
    } else {
      const stream = CallManager.pexrtc.present('screen');
      console.log(stream);
      CallManager.presentationStream = stream;
      CallManager.secondaryStream$.next(stream);
    }
  }

  static getState() {
    return CallManager.pexrtc?.state;
  }

  static isPresentationInMain() {
    return this.presentationInMain;
  }

  static isAudioMute() {
    return CallManager.pexrtc?.mutedAudio;
  }

  static isVideoMute() {
    return CallManager.pexrtc?.mutedVideo;
  }

  static isSharingScreen() {
    return !!CallManager.pexrtc?.screenshare;
  }

  static setNode(value: string) {
    CallManager.node = value;
  }

  static setDisplayName(value: string) {
    CallManager.displayName = value;
  }

  static setChannel(value: string) {
    CallManager.channel = value;
  }

  static setHostPin(value: string) {
    CallManager.hostPin = value;
  }

  static getNode() {
    return CallManager.node;
  }

  static getDisplayName() {
    return CallManager.displayName;
  }

  static getChannel() {
    return CallManager.channel;
  }

  static getHostPin() {
    return CallManager.hostPin;
  }

  static toggleMainVideo() {
    CallManager.presentationInMain = !CallManager.presentationInMain;
    if (CallManager.isPresentationInMain()) {
      CallManager.mainStream$.next(CallManager.presentationStream);
      CallManager.secondaryStream$.next(CallManager.remoteStream);
    } else {
      CallManager.mainStream$.next(CallManager.remoteStream);
      CallManager.secondaryStream$.next(CallManager.presentationStream);
    }
  }

  private static onSetup(stream: MediaStream, pin_status: string, conference_extension: string) {
    CallManager.localStream = stream;
    CallManager.localStream$.next(stream);
    CallManager.pexrtc.connect(CallManager.hostPin);
  }

  private static onConnect(stream: MediaStream) {
    CallManager.remoteStream = stream;
    CallManager.mainStream$.next(stream);
  }

  private static onScreenshareConnected(stream: MediaStream) {
    console.log('On Screenshare Connected');
    if (CallManager.isPresentationInMain()) {
      CallManager.toggleMainVideo();
    }
    CallManager.presentationStream = stream;
    CallManager.secondaryStream$.next(stream);
  }

  private static onScreenshareStopped(reason: string) {
    console.log('On Screenshare Stopped');
    if (CallManager.isPresentationInMain()) {
      CallManager.toggleMainVideo();
    }
    CallManager.presentationStream = null;
    CallManager.secondaryStream$.next(null);
  }

  private static onPresentation(setting: boolean, presenter: string, uuid: string) {
    console.log('On Presentation');
    if (setting) {
      CallManager.pexrtc.getPresentation();
    }
  }

  private static onPresentationConnected(stream: MediaStream) {
    console.log('On Presentation Connected');
    CallManager.presentationStream = stream;
    if (!CallManager.isPresentationInMain()) {
      CallManager.toggleMainVideo();
    }
    CallManager.mainStream$.next(stream);
  }

  private static onPresentationDisconnected(reason: string) {
    console.log('On Presentation Disconnected');
    if (!CallManager.isSharingScreen()) {
      CallManager.presentationStream = null;
      if (CallManager.isPresentationInMain()) {
        CallManager.toggleMainVideo();
      }
      CallManager.secondaryStream$.next(null);
    }
  }

  private static onError(error: string) {
    console.error(error);
  }

}