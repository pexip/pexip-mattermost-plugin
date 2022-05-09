
export class CallManager {

  private static url = '';
  private static displayName = '';
  private static channel = '';
  private static rtc: any = null;

  static async joinConference(videoContainer: HTMLVideoElement) {
    console.log('Initialization conference with the following values:')
    console.log('URL: ' + this.url);
    console.log('Display Name: ' + this.displayName);
    console.log('Channel: ' + this.channel);
    //const response = await fetch(new URL('/static/webrtc/js/pexrtc.js', CallManager.url ).href);
    const response = await fetch(new URL('/static/webrtc/js/pexrtc.js', CallManager.url ).href);
    const text = await response.text();
    const pexRTC = Function(text)();
    console.log(pexRTC)
    console.log(response);
  }

  static isOnCall() {
    return !!CallManager.rtc;
  }

  static setUrl(value: string) {
    CallManager.url = value;
  }

  static setDisplayName(value: string) {
    CallManager.displayName = value;
  }

  static setChannel(value: string) {
    CallManager.channel = value;
  }

  static getUrl() {
    return CallManager.url;
  }

  static getDisplayName() {
    return CallManager.displayName;
  }

  static getChannel() {
    return CallManager.channel;
  }

}