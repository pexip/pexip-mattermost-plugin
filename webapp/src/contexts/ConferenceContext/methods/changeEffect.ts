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
  effect: 'none' | 'blur' | 'overlay',
  state: ConferenceState,
  dispatch: React.Dispatch<ConferenceAction>
): Promise<void> => {
  const { localVideoStream } = state

  if (localVideoStream == null) {
    console.error('Local stream is not available')
    return
  }

  processor?.close()
  await processor?.destroy()

  processor = await getVideoProcessor(effect)
  await processor.open()

  const processedStream = await processor.process(localVideoStream)

  dispatch({
    type: ConferenceActionType.Connected,
    body: {
      localStream: processedStream
    }
  })
}

const getVideoProcessor = async (effect: 'none' | 'blur' | 'overlay'): Promise<VideoProcessor> => {
  const delegate = isChromium() ? 'GPU' : 'CPU'
  // Setting the path to that `@mediapipe/tasks-vision` assets
  // It will be passed direct to
  // [FilesetResolver.forVisionTasks()](https://ai.google.dev/edge/api/mediapipe/js/tasks-vision.filesetresolver#filesetresolverforvisiontasks)
  const tasksVisionBasePath = '/wasm'

  const segmenter = createSegmenter(tasksVisionBasePath, {
    modelAsset: {
      path: '/models/selfie_segmenter.tflite',
      modelName: 'selfie'
    },
    delegate
  })

  const transformer = createCanvasTransform(segmenter, {
    effects: effect,
    backgroundImageUrl: '/backgrounds/background.webp'
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
