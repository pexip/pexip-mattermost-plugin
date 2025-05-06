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
  TogglePresentationInPopUp,
  SwapVideos,
  ChangeDevices,
  UpdateLocalStream,
  ChangeEffect,
  SetIsDesktopApp,
  DirectMediaChanged,
  Me,
  Transfer
}

export interface ConferenceAction {
  type: ConferenceActionType
  body?: any
}
