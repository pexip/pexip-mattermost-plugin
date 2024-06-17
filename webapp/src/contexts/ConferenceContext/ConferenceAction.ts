export enum ConferenceActionType {
  SetConfig,
  Connecting,
  Connected,
  Disconnected,
  Error,
  RemoteStream,
  Participants,
  ToggleMuteAudio,
  ToggleMuteVideo,
  TogglePresenting,
  RemotePresentationStream,
  SwapVideos,
  ChangeDevices,
  UpdateLocalStream
}

export interface ConferenceAction {
  type: ConferenceActionType
  body?: any
}
