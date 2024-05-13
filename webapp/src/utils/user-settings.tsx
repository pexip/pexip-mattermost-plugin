import React from 'react'
import { getPluginServerRoute } from './http-requests'

const inputVideoDeviceIdKey = 'pexip:inputVideoDeviceId'
const inputAudioDeviceIdKey = 'pexip:inputAudioDeviceId'
const outputAudioDeviceKey = 'pexip:outputAudioDeviceId'

export interface UserSettings {
  inputVideoDeviceId: string
  inputAudioDeviceId: string
  outputAudioDeviceId: string
}

interface InteractiveDialog {
  title: JSX.Element
  icon_url: string
  elements: any[]
  submit_label: string
  notify_on_cancel: boolean
}

let userSettingsCallback: (userSettings: UserSettings) => void

export const openUserSettingsDialog = async (): Promise<void> => {
  const title = <span style={{ marginLeft: '0.5em' }}>Pexip Settings</span>
  const mediaDevices = await navigator.mediaDevices.enumerateDevices()
  const {
    inputVideoDeviceId: selectedInputVideoDeviceId,
    inputAudioDeviceId: selectedInputAudioDeviceId,
    outputAudioDeviceId: selectedOutputDeviceId
  } = await getUserSettings()

  const dialog = createUserSettingsDialog(
    title,
    mediaDevices,
    selectedInputVideoDeviceId,
    selectedInputAudioDeviceId,
    selectedOutputDeviceId
  )
  // https://mattermost.atlassian.net/browse/MM-15340
  ;(window as any).openInteractiveDialog({
    dialog,
    url: getPluginServerRoute() + '/api/change_user_settings'
  })
}

export const getUserSettings = async (): Promise<UserSettings> => {
  let inputVideoDeviceId = localStorage.getItem(inputVideoDeviceIdKey) ?? ''
  let inputAudioDeviceId = localStorage.getItem(inputAudioDeviceIdKey) ?? ''
  let outputAudioDeviceId = localStorage.getItem(outputAudioDeviceKey) ?? ''

  const mediaDevices = await navigator.mediaDevices.enumerateDevices()

  if (inputVideoDeviceId === '') {
    const videoDevices = mediaDevices.filter((device) => device.kind === 'videoinput')
    if (videoDevices.length > 0) {
      inputVideoDeviceId = videoDevices[0].deviceId
    }
  }

  if (inputAudioDeviceId === '') {
    const audioDevices = mediaDevices.filter((device) => device.kind === 'audioinput')
    if (audioDevices.length > 0) {
      inputAudioDeviceId = audioDevices[0].deviceId
    }
  }

  if (outputAudioDeviceId === '') {
    const audioDevices = mediaDevices.filter((device) => device.kind === 'audiooutput')
    if (audioDevices.length > 0) {
      outputAudioDeviceId = audioDevices[0].deviceId
    }
  }

  return {
    inputVideoDeviceId,
    inputAudioDeviceId,
    outputAudioDeviceId
  }
}

export const setUserSettings = (userSettings: UserSettings): void => {
  localStorage.setItem(inputVideoDeviceIdKey, userSettings.inputVideoDeviceId)
  localStorage.setItem(inputAudioDeviceIdKey, userSettings.inputAudioDeviceId)
  localStorage.setItem(outputAudioDeviceKey, userSettings.outputAudioDeviceId)
  userSettingsCallback(userSettings)
}

export const setUserSettingsEventListener = (callback: (userSettings: UserSettings) => void): void => {
  userSettingsCallback = callback
}

const createUserSettingsDialog = (
  title: JSX.Element,
  mediaDevices: MediaDeviceInfo[],
  selectedInputVideoDeviceId: string,
  selectedInputAudioDeviceId: string,
  selectedOutputAudioDeviceId: string
): InteractiveDialog => {
  const elements = [
    {
      display_name: 'Camera',
      name: 'inputVideoDeviceId',
      type: 'select',
      default: selectedInputVideoDeviceId,
      options: mediaDevices
        .filter((device) => device.kind === 'videoinput')
        .map((device) => ({
          text: device.label,
          value: device.deviceId
        }))
    },
    {
      display_name: 'Microphone',
      name: 'inputAudioDeviceId',
      type: 'select',
      default: selectedInputAudioDeviceId,
      options: mediaDevices
        .filter((device) => device.kind === 'audioinput')
        .map((device) => ({
          text: device.label,
          value: device.deviceId
        }))
    }
  ]

  // Check if the browser supports changing the output audio device.
  if ('setSinkId' in AudioContext.prototype) {
    elements.push({
      display_name: 'Speaker',
      name: 'outputAudioDeviceId',
      type: 'select',
      default: selectedOutputAudioDeviceId,
      options: mediaDevices
        .filter((device) => device.kind === 'audiooutput')
        .map((device) => ({
          text: device.label,
          value: device.deviceId
        }))
    })
  }

  const dialog: InteractiveDialog = {
    title,
    icon_url: getPluginServerRoute() + '/public/icon.svg',
    elements,
    submit_label: 'Change',
    notify_on_cancel: false
  }

  return dialog
}
