import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import type { ConferenceState } from './ConferenceState'
import { ConferenceReducer } from './ConferenceReducer'
import { connect } from './methods/connect'
import { disconnect } from './methods/disconnect'
import { ConnectionState } from '../../types/ConnectionState'
import type { ConferenceConfig } from '../../types/ConferenceConfig'
import { ConferenceActionType } from './ConferenceAction'
import type { Channel } from 'mattermost-redux/types/channels'
import { toggleMuteAudio } from './methods/toggleMuteAudio'
import { toggleMuteVideo } from './methods/toggleMuteVideo'
import { toggleMutePresenting } from './methods/togglePresenting'
import { type DisconnectReason } from '@pexip/infinity'
import { type DevicesIds, changeDevices } from './methods/changeDevices'
import { type UserSettings } from 'src/utils/user-settings'
import { LocalStorageKey } from 'src/utils/local-storage-key'
import { filterMediaDevices } from './methods/filterMediaDevices'

interface ContextType {
  setConfig: (config: ConferenceConfig) => void
  connect: (channel: Channel) => Promise<void>
  disconnect: () => Promise<void>
  toggleMuteAudio: () => Promise<void>
  toggleMuteVideo: () => Promise<void>
  togglePresenting: () => Promise<void>
  changeDevices: (userSettings: UserSettings) => Promise<void>
  swapVideos: () => void
  state: ConferenceState
}

const Context = createContext<ContextType | null>(null)

const initialState: ConferenceState = {
  config: null,
  channel: null,
  client: null,
  localVideoStream: undefined,
  localAudioStream: undefined,
  remoteStream: undefined,
  inputVideoDeviceId: localStorage.getItem(LocalStorageKey.inputVideoDeviceIdKey) ?? '',
  inputAudioDeviceId: localStorage.getItem(LocalStorageKey.inputAudioDeviceIdKey) ?? '',
  outputAudioDeviceId: localStorage.getItem(LocalStorageKey.outputAudioDeviceKey) ?? '',
  presentationStream: undefined,
  connectionState: ConnectionState.Disconnected,
  audioMuted: false,
  videoMuted: false,
  presenting: false,
  presentationInMain: false,
  participants: [],
  errorMessage: ''
}

const ConferenceContextProvider = (props: any): JSX.Element => {
  const [state, dispatch] = useReducer(ConferenceReducer, initialState)

  const beforeUnloadHandler = (): void => {
    const disconnectReason: DisconnectReason = 'Browser closed'
    disconnect(state, dispatch, disconnectReason).catch(console.error)
  }

  const handleDeviceChange = (): void => {
    console.log('Device change detected')
    filterMediaDevices({
      inputVideoDeviceId: state.inputVideoDeviceId,
      inputAudioDeviceId: state.inputAudioDeviceId,
      outputAudioDeviceId: state.outputAudioDeviceId
    })
      .then((devicesIds) => {
        const { inputAudioDeviceId, inputVideoDeviceId, outputAudioDeviceId } = devicesIds
        changeDevices({ inputAudioDeviceId, inputVideoDeviceId, outputAudioDeviceId }, state, dispatch).catch(
          console.error
        )
      })
      .catch(console.error)
  }

  useEffect(() => {
    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange)
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange)
    }
  }, [state])

  const value = useMemo(
    () => ({
      setConfig: (config: ConferenceConfig): void => {
        dispatch({ type: ConferenceActionType.SetConfig, body: config })
      },
      connect: async (channel: Channel) => {
        dispatch({
          type: ConferenceActionType.Connecting,
          body: { channel }
        })
        try {
          const filteredDevicesIds = await filterMediaDevices({
            inputVideoDeviceId: state.inputVideoDeviceId,
            inputAudioDeviceId: state.inputAudioDeviceId,
            outputAudioDeviceId: state.outputAudioDeviceId
          })
          await connect(
            {
              host: 'https://' + state.config?.node,
              conferenceAlias: state.config?.vmrPrefix + channel.name,
              hostPin: state.config?.hostPin ?? '',
              displayName: state.config?.displayName ?? 'User',
              inputVideoDeviceId: filteredDevicesIds.inputVideoDeviceId,
              inputAudioDeviceId: filteredDevicesIds.inputAudioDeviceId,
              outputAudioDeviceId: filteredDevicesIds.outputAudioDeviceId
            },
            dispatch
          )
        } catch (e) {
          console.error(e)
        }
        addEventListener('beforeunload', beforeUnloadHandler)
      },
      disconnect: async () => {
        const disconnectReason: DisconnectReason = 'User initiated disconnect'
        disconnect(state, dispatch, disconnectReason).catch(console.error)
        removeEventListener('beforeunload', beforeUnloadHandler)
      },
      toggleMuteAudio: async () => {
        toggleMuteAudio(state, dispatch).catch(console.error)
      },
      toggleMuteVideo: async () => {
        toggleMuteVideo(state, dispatch).catch(console.error)
      },
      togglePresenting: async () => {
        toggleMutePresenting(state, dispatch).catch(console.error)
      },
      swapVideos: async () => {
        dispatch({ type: ConferenceActionType.SwapVideos })
      },
      changeDevices: async (devicesIds: DevicesIds) => {
        const { inputAudioDeviceId, inputVideoDeviceId, outputAudioDeviceId } = devicesIds

        localStorage.setItem(LocalStorageKey.inputVideoDeviceIdKey, inputVideoDeviceId)
        localStorage.setItem(LocalStorageKey.inputAudioDeviceIdKey, inputAudioDeviceId)
        localStorage.setItem(LocalStorageKey.outputAudioDeviceKey, outputAudioDeviceId)

        changeDevices(devicesIds, state, dispatch).catch(console.error)
      },
      state
    }),
    [state]
  )

  return <Context.Provider value={value}>{props.children}</Context.Provider>
}

const useConferenceContext = (): ContextType => {
  const context = useContext(Context)
  if (context == null) {
    throw new Error('useConferenceContext has to be used within <ConferenceContextProvider>')
  }
  return context
}

export { ConferenceContextProvider, useConferenceContext }
