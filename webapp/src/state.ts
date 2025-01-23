export interface State {
  showScreenSharingModal: boolean
  screenSharingSourceId: string | null
}

export const initialState: State = {
  showScreenSharingModal: false,
  screenSharingSourceId: null
}
