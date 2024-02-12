export enum ConferenceActionType {
  Connected,
  Disconnected,
  Error,
  RemoteStream,
}

export interface ConferenceAction {
  type: ConferenceActionType
  body?: any
}
