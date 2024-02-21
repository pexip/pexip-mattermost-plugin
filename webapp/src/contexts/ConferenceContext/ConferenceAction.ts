export enum ConferenceActionType {
  SetConfig,
  Connecting,
  Connected,
  Disconnected,
  Error,
  RemoteStream,
  Participants,
}

export interface ConferenceAction {
  type: ConferenceActionType
  body?: any
}
