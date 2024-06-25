import {
  type VideoProcessor,
  createCanvasTransform,
  createSegmenter,
  createVideoProcessor,
  createVideoTrackProcessor,
  createVideoTrackProcessorWithFallback,
  type ProcessVideoTrack
} from '@pexip/media-processor'
import { ConferenceActionType, type ConferenceAction } from '../ConferenceAction'
import { type Effect } from 'src/types/Effect'
import { type ConferenceState } from '../ConferenceState'

interface NavigatorUABrandVersion {
  brand: string
  version: string
}

interface NavigatorUAData {
  brands: NavigatorUABrandVersion[]
  mobile: boolean
  platform: string
}

let processor: VideoProcessor | null = null

export const changeEffect = async (
  localVideoStream: MediaStream,
  effect: Effect,
  state: ConferenceState,
  dispatch: React.Dispatch<ConferenceAction>
): Promise<MediaStream> => {
  processor?.close()

  await processor?.destroy()

  processor = await getVideoProcessor(effect)

  await processor.open()

  const processedVideoStream = await processor.process(localVideoStream)

  let newStream: MediaStream
  if (state.localAudioStream != null) {
    newStream = new MediaStream([...processedVideoStream.getTracks(), ...state.localAudioStream.getTracks()])
  } else {
    newStream = processedVideoStream
  }

  state.client?.setStream(newStream)

  dispatch({
    type: ConferenceActionType.UpdateLocalStream,
    body: {
      processedVideoStream
    }
  })

  dispatch({
    type: ConferenceActionType.ChangeEffect,
    body: {
      effect
    }
  })

  return processedVideoStream
}

let baseUrl = document.currentScript?.getAttribute('src')

if (baseUrl != null) {
  baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/')) + '/public/'
  baseUrl = baseUrl.replace('/static/', '/')
} else {
  baseUrl = window.location.origin + '/plugins/com.pexip.pexip-video-connect/public/'
}

const getVideoProcessor = async (effect: 'none' | 'blur' | 'overlay'): Promise<VideoProcessor> => {
  const delegate = isChromium() ? 'GPU' : 'CPU'
  // Setting the path to that `@mediapipe/tasks-vision` assets
  // It will be passed direct to
  // [FilesetResolver.forVisionTasks()](https://ai.google.dev/edge/api/mediapipe/js/tasks-vision.filesetresolver#filesetresolverforvisiontasks)
  const tasksVisionBasePath = baseUrl + 'wasm'

  const segmenter = createSegmenter(tasksVisionBasePath, {
    modelAsset: {
      path: `${baseUrl}models/selfie_segmenter.tflite`,
      modelName: 'selfie'
    },
    delegate,
    workerScriptUrl: new URL(`${baseUrl}workers/mediaWorker.js`)
  })

  const transformer = createCanvasTransform(segmenter, {
    effects: effect,
    backgroundImageUrl: `${baseUrl}backgrounds/background.webp`
  })

  const processor = createVideoProcessor([transformer], getTrackProcessor())

  return processor
}

const isChromium = (): boolean => {
  if ('userAgentData' in navigator) {
    const { brands } = navigator.userAgentData as NavigatorUAData
    return Boolean(brands.find(({ brand }) => brand === 'Chromium'))
  }
  return false
}

const getTrackProcessor = (): ProcessVideoTrack => {
  // Feature detection if the browser has the `MediaStreamProcessor` API
  if ('MediaStreamTrackProcessor' in window) {
    return createVideoTrackProcessor() // Using the latest Streams API
  }
  return createVideoTrackProcessorWithFallback() // Using the fallback implementation
}
