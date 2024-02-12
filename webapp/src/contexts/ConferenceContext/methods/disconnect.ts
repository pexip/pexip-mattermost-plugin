import { ConferenceActionType, type ConferenceAction } from '../ConferenceAction'

export const disconnect = async (dispatch: React.Dispatch<ConferenceAction>): Promise<void> => {
  dispatch({
    type: ConferenceActionType.Disconnected
  })
}
