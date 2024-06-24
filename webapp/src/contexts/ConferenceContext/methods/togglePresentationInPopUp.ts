import { ConferenceActionType, type ConferenceAction } from '../ConferenceAction'
import { type ConferenceState } from '../ConferenceState'

let popUp: Window | null = null

export const togglePresentationInPopUp = async (
  state: ConferenceState,
  dispatch: React.Dispatch<ConferenceAction>
): Promise<void> => {
  if (state.presentationInPopUp) {
    popUp?.close()
  } else {
    popUp = window.open('', '_blank', 'width=800,height=450')

    const video = document.createElement('video')
    video.autoplay = true
    video.playsInline = true
    video.muted = true
    video.style.width = '100%'

    if (popUp != null) {
      popUp.document.body.style.margin = '0'
      popUp.document.body.style.display = 'flex'
      popUp.document.body.style.backgroundColor = 'black'
      popUp.document.body.style.maxHeight = '100%'
      const remoteVideo = popUp.document.body.appendChild(video)
      if (remoteVideo != null) {
        remoteVideo.srcObject = state.presentationStream as unknown as MediaStream
      }

      popUp.onbeforeunload = (): void => {
        dispatch({
          type: ConferenceActionType.TogglePresentationInPopUp
        })
      }
    }

    if (state.presentationInMain) {
      dispatch({
        type: ConferenceActionType.SwapVideos
      })
    }

    dispatch({
      type: ConferenceActionType.TogglePresentationInPopUp
    })
  }
}

export const closePopUp = (): void => {
  if (popUp != null) {
    popUp.onbeforeunload = null
    popUp.close()
    popUp = null
  }
}
