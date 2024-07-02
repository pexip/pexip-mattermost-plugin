import { ConferenceActionType, type ConferenceAction } from '../ConferenceAction'
import { type ConferenceState } from '../ConferenceState'

export const togglePresenting = async (
  state: ConferenceState,
  dispatch: React.Dispatch<ConferenceAction>
): Promise<void> => {
  const { client, presenting } = state

  let presentationStream
  if (presenting) {
    state.presentationStream?.getTracks().forEach((track) => {
      track.stop()
    })
    client?.stopPresenting()
  } else {
    const desktop = await window.desktopAPI?.getAppInfo()

    if (desktop != null) {
      presentationStream = await navigator.mediaDevices.getUserMedia({
        video: { mandatory: { chromeMediaSource: 'desktop' } }
      } as unknown as MediaStreamConstraints)
    } else {
      presentationStream = await navigator.mediaDevices.getDisplayMedia()
    }

    presentationStream.getVideoTracks()[0].addEventListener('ended', () => {
      client?.stopPresenting()
      dispatch({
        type: ConferenceActionType.TogglePresenting,
        body: {
          presenting: false
        }
      })
    })
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
declare global {
  interface Window {
    desktopAPI?: { getAppInfo: () => Promise<{ name: string; version: string }> }
  }
}
