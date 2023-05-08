import type { Channel } from 'mattermost-redux/types/channels'
import { BehaviorSubject } from 'rxjs'

export enum ConnectionState {
  Disconnected,
  Connected,
  Connecting,
  Error
}

export interface ConferenceConfig {
  node: string
  displayName: string
  vmrPrefix: string
  hostPin: string
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ConferenceManager {
  private static config: ConferenceConfig
  private static channel: Channel

  private static pexrtc: any

  private static localStream: MediaStream | null
  private static remoteStream: MediaStream | null
  private static presentationStream: MediaStream | null

  private static presentationInMain: boolean = false

  private static error: string = ''

  static localStream$ = new BehaviorSubject<MediaStream | null>(null)
  static mainStream$ = new BehaviorSubject<MediaStream | null>(null)
  static secondaryStream$ = new BehaviorSubject<MediaStream | null>(null)
  static connectionState$ = new BehaviorSubject<ConnectionState>(ConnectionState.Disconnected)

  static connect (): void {
    console.log('Initialization conference with the following values:')
    console.log('Node: ' + ConferenceManager.config.node)
    console.log('Display Name: ' + ConferenceManager.config.displayName)
    console.log('VMR Prefix: ' + ConferenceManager.config.vmrPrefix)
    console.log('Host PIN: ' + ConferenceManager.config.hostPin)
    console.log('Channel: ' + this.channel.name)

    ConferenceManager.connectionState$.next(ConnectionState.Connecting)

    ConferenceManager.pexrtc = new PexRTC()
    ConferenceManager.pexrtc.onSetup = ConferenceManager.onSetup
    ConferenceManager.pexrtc.onConnect = ConferenceManager.onConnect
    ConferenceManager.pexrtc.onScreenshareConnected = ConferenceManager.onScreenshareConnected
    ConferenceManager.pexrtc.onScreenshareStopped = ConferenceManager.onScreenshareStopped
    ConferenceManager.pexrtc.onPresentation = ConferenceManager.onPresentation
    ConferenceManager.pexrtc.onPresentationConnected = ConferenceManager.onPresentationConnected
    ConferenceManager.pexrtc.onPresentationDisconnected = ConferenceManager.onPresentationDisconnected
    ConferenceManager.pexrtc.onError = ConferenceManager.onError
    ConferenceManager.pexrtc.makeCall(ConferenceManager.config.node,
      ConferenceManager.config.vmrPrefix + this.channel.name, ConferenceManager.config.displayName)

    // Change the color of the channel button
    const button = document.getElementById('pexip-vmr-plugin-button')
    if (button != null) button.style.color = 'var(--button-bg)'

    // Disconnect when closing Mattermost app
    addEventListener('beforeunload', () => { ConferenceManager.disconnect() })

    // TODO: Show error when cannot connect
  }

  static disconnect (): void {
    ConferenceManager.pexrtc.disconnect()
    ConferenceManager.pexrtc = null
    // Change the color of the channel button
    const button = document.getElementById('pexip-vmr-plugin-button')
    if (button != null) button.style.color = 'inherit'
    ConferenceManager.connectionState$.next(ConnectionState.Disconnected)
  }

  static toggleAudioMute (): void {
    ConferenceManager.pexrtc.muteAudio(!(ConferenceManager.pexrtc.mutedAudio as boolean))
  }

  static toggleVideoMute (): void {
    ConferenceManager.pexrtc.muteVideo(!(ConferenceManager.pexrtc.mutedVideo as boolean))
    if (ConferenceManager.pexrtc.mutedVideo as boolean) {
      ConferenceManager.localStream$.next(null)
    } else {
      ConferenceManager.localStream$.next(ConferenceManager.localStream)
    }
  }

  static shareScreen (): void {
    if (ConferenceManager.isSharingScreen()) {
      ConferenceManager.pexrtc.present(null)
    } else {
      const stream = ConferenceManager.pexrtc.present('screen')
      ConferenceManager.presentationStream = stream
      ConferenceManager.secondaryStream$.next(stream)
    }
  }

  static isPresentationInMain (): boolean {
    return this.presentationInMain
  }

  static isAudioMute (): boolean {
    return ConferenceManager.pexrtc?.mutedAudio
  }

  static isVideoMute (): boolean {
    return ConferenceManager.pexrtc?.mutedVideo
  }

  static isSharingScreen (): boolean {
    return ConferenceManager.pexrtc?.screenshare_requested as boolean
  }

  static setConfig (config: ConferenceConfig): void {
    ConferenceManager.config = config
  }

  static getConfig (): ConferenceConfig {
    return ConferenceManager.config
  }

  static setChannel (channel: Channel): void {
    ConferenceManager.channel = channel
  }

  static getChannel (): Channel {
    return ConferenceManager.channel
  }

  static toggleMainVideo (): void {
    ConferenceManager.presentationInMain = !ConferenceManager.presentationInMain
    if (ConferenceManager.isPresentationInMain()) {
      ConferenceManager.mainStream$.next(ConferenceManager.presentationStream)
      ConferenceManager.secondaryStream$.next(ConferenceManager.remoteStream)
    } else {
      ConferenceManager.mainStream$.next(ConferenceManager.remoteStream)
      ConferenceManager.secondaryStream$.next(ConferenceManager.presentationStream)
    }
  }

  static getError (): string {
    return ConferenceManager.error
  }

  private static onSetup (stream: MediaStream, pinStatus: string, conferenceExtension: string): void {
    ConferenceManager.localStream = stream
    ConferenceManager.localStream$.next(stream)
    ConferenceManager.pexrtc.connect(ConferenceManager.config.hostPin)
  }

  private static onConnect (stream: MediaStream): void {
    ConferenceManager.remoteStream = stream
    ConferenceManager.mainStream$.next(stream)
    ConferenceManager.connectionState$.next(ConnectionState.Connected)
  }

  private static onScreenshareConnected (stream: MediaStream): void {
    console.log('On Screenshare Connected')
    if (ConferenceManager.isPresentationInMain()) {
      ConferenceManager.toggleMainVideo()
    }
    ConferenceManager.presentationStream = stream
    ConferenceManager.secondaryStream$.next(stream)
  }

  private static onScreenshareStopped (reason: string): void {
    console.log('On Screenshare Stopped')
    if (ConferenceManager.isPresentationInMain()) {
      ConferenceManager.toggleMainVideo()
    }
    ConferenceManager.presentationStream = null
    ConferenceManager.secondaryStream$.next(null)
  }

  private static onPresentation (setting: boolean, presenter: string, uuid: string): void {
    console.log('On Presentation')
    if (setting) {
      ConferenceManager.pexrtc.getPresentation()
    }
  }

  private static onPresentationConnected (stream: MediaStream): void {
    console.log('On Presentation Connected')
    ConferenceManager.presentationStream = stream
    if (!ConferenceManager.isPresentationInMain()) {
      ConferenceManager.toggleMainVideo()
    }
    ConferenceManager.mainStream$.next(stream)
  }

  private static onPresentationDisconnected (reason: string): void {
    console.log('On Presentation Disconnected')
    if (!ConferenceManager.isSharingScreen()) {
      ConferenceManager.presentationStream = null
      if (ConferenceManager.isPresentationInMain()) {
        ConferenceManager.toggleMainVideo()
      }
      ConferenceManager.secondaryStream$.next(null)
    }
  }

  private static onError (error: string): void {
    ConferenceManager.error = error
    ConferenceManager.connectionState$.next(ConnectionState.Error)
  }
}
