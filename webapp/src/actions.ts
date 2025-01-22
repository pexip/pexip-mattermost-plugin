export enum ActionType {
  ShowScreenSharingModal = 'SHOW_SCREEN_SHARING_MODAL',
  HideScreenSharingModal = 'HIDE_SCREEN_SHARING_MODAL'
}

export interface Action {
  type: ActionType
  payload: any
}
