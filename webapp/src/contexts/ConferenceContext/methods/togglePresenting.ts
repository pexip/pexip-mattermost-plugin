import { ConferenceActionType, type ConferenceAction } from '../ConferenceAction'
import { type ConferenceState } from '../ConferenceState'

export const toggleMutePresenting = async (state: ConferenceState, dispatch: React.Dispatch<ConferenceAction>): Promise<void> => {
  const { client, presenting } = state

  let presentationStream
  if (presenting) {
    console.log('Stopping presentation')
  } else {
    presentationStream = await navigator.mediaDevices.getDisplayMedia()
    client?.present(presentationStream)
  }

  dispatch({
    type: ConferenceActionType.TogglePresenting,
    body: {
      presenting: !presenting,
      presentationStream
    }
  })
}
