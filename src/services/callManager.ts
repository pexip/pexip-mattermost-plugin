import { BehaviorSubject } from 'rxjs';

export class CallManager {

  private static node = '';
  private static displayName = '';
  private static channel = '';
  private static pin = '1234';

  private static pexrtc: any = null; 
  
  private static localStream: MediaStream = null;
  private static remoteStream: MediaStream = null;
  private static presentationStream: MediaStream = null;

  private static isPresentationInMain: boolean = false;

  static localStream$ = new BehaviorSubject<MediaStream>(null);
  static mainStream$ = new BehaviorSubject<MediaStream>(null);
  static secondaryStream$ = new BehaviorSubject<MediaStream>(null);

  static async connect() {

    console.log('Initialization conference with the following values:');
    console.log('Node: ' + this.node);
    console.log('Display Name: ' + this.displayName);
    console.log('Channel: ' + this.channel);
    console.log('PIN: ' + this.pin);

    CallManager.pexrtc = new PexRTC();
    CallManager.pexrtc.onSetup = CallManager.onSetup;
    CallManager.pexrtc.onConnect = CallManager.onConnect;
    CallManager.pexrtc.onPresentation = CallManager.onPresentation;
    CallManager.pexrtc.onPresentationConnected = CallManager.onPresentationConnected;
    CallManager.pexrtc.onError = CallManager.onError;
    CallManager.pexrtc.makeCall(this.node, 'room');

    // Change the color of the channel button
    const button = document.getElementById('pexip-vmr-plugin-button');
    button.style.color = 'var(--button-bg)';

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
  }

  static shareScreen() {
    CallManager.pexrtc.present('screen');
  }

  static getState() {
    return CallManager.pexrtc?.state;
  }

  static isAudioMute() {
    return CallManager.pexrtc?.mutedAudio;
  }

  static isVideoMute() {
    return CallManager.pexrtc?.mutedVideo;
  }

  static isSharingScreen() {
    return CallManager.pexrtc?.screenshare;
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

  static getNode() {
    return CallManager.node;
  }

  static getDisplayName() {
    return CallManager.displayName;
  }

  static getChannel() {
    return CallManager.channel;
  }

  static toggleMainVideo() {
    CallManager.isPresentationInMain = !CallManager.isPresentationInMain;
    if (CallManager.isPresentationInMain) {
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
    CallManager.pexrtc.connect(CallManager.pin);
  }

  private static onConnect(stream: MediaStream) {
    CallManager.remoteStream = stream;
    CallManager.mainStream$.next(stream);
  }

  private static onPresentation(setting: boolean, presenter: string, uuid: string) {
    console.log('On Presentation '+ setting);
    
    if (setting) {
      // Enabling presentation
      const stream = CallManager.pexrtc.getPresentation();
      console.log(stream);
      // CallManager.presentationStream = stream;
      // CallManager.presentationStream$.next(stream);
    } else {
      // Disabling presentation
      // CallManager.presentationStream$.next(null);
    }
  }

  private static onPresentationConnected(stream: MediaStream) {
    console.log('Presentation Connected');
    console.log(stream);
    CallManager.presentationStream = stream;
    CallManager.secondaryStream$.next(stream);
  }

  private static onPresentationDisconnected(reason: string) {
    CallManager.secondaryStream$.next(null);
  }

  private static onError(error: string) {
    console.error(error);
  }

}