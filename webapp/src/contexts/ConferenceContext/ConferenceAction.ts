export enum ConferenceActionType {
  SetConfig,
  Connecting,
  Connected,
  Disconnected,
  Error,
  RemoteStream,
}

export interface ConferenceAction {
  type: ConferenceActionType
  body?: any
}
