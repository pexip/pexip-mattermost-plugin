export enum ConferenceActionType {
  SetConfig,
  Connecting,
  Connected,
  ChangeDevices,
  Disconnected,
  Error,
  RemoteStream,
  Participants,
  ToggleMuteAudio,
  ToggleMuteVideo,
  TogglePresenting,
  RemotePresentationStream,
  SwapVideos
}

export interface ConferenceAction {
  type: ConferenceActionType
  body?: any
}
