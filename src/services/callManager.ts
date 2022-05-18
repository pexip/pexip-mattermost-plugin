export class CallManager {

  private static node = '';
  private static displayName = '';
  private static channel = '';
  private static pin = '1234';

  private static rtc: any = null;
  private static videoRef: React.RefObject<HTMLVideoElement>;

  static async connect(videoRef: React.RefObject<HTMLVideoElement>) {

    console.log('Initialization conference with the following values:');
    console.log('Node: ' + this.node);
    console.log('Display Name: ' + this.displayName);
    console.log('Channel: ' + this.channel);
    console.log('PIN: ' + this.pin);
    console.log(videoRef);

    CallManager.videoRef = videoRef;

    CallManager.rtc = new PexRTC();
    CallManager.rtc.onSetup = CallManager.onSetup;
    CallManager.rtc.onConnect = CallManager.onConnect;
    CallManager.rtc.onError = CallManager.onError;
    CallManager.rtc.makeCall(this.node, 'room');

// //    const response = await fetch(new URL('/static/webrtc/js/pexrtc.js', CallManager.url ).href);
//     const response = await fetch(new URL('/static/webrtc/js/pexrtc.js', CallManager.url ).href, {
//       mode: "no-cors"
//     });
//     const text = await response.text();
//     const pexRTC = Function(text)();
//     console.log(pexRTC)
//     console.log(response);
  }

  static disconnect() {

  }

  static isOnCall() {
    return !!CallManager.rtc;
  }

  static isAudioMute() {
    return true;
  }

  static isVideoMute() {
    return true;
  }

  static isSharingScreen() {
    return true;
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

  private static onSetup(stream: MediaStream, pin_status: string, conference_extension: string) {
    console.log(stream);
    console.log(pin_status);
    console.log(conference_extension);
    console.log('On setup');
    CallManager.rtc.connect(this.pin);
  }

  private static onConnect(stream: MediaStream) {
    console.log('On connect');
    CallManager.videoRef.current.srcObject = stream;
  }

  private static onError(error: string) {
    console.error(error);
  }

}