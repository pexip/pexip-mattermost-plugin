export enum ActionType {
  ShowScreenSharingModal = 'SHOW_SCREEN_SHARING_MODAL',
  HideScreenSharingModal = 'HIDE_SCREEN_SHARING_MODAL',
  StartScreenSharing = 'START_SCREEN_SHARING',
  StopScreenSharing = 'STOP_SCREEN_SHARING'
}

export interface Action {
  type: ActionType
  payload: any
}
