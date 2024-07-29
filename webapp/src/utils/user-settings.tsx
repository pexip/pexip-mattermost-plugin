import React from 'react'
import { getPluginServerRoute } from './http-requests'
import { EventEmitter } from 'events'
import { type Effect } from 'src/types/Effect'
import manifest from '../../../plugin.json'

export interface UserSettings {
  inputVideoDeviceId: string
  inputAudioDeviceId: string
  outputAudioDeviceId: string
  effect: Effect
}

interface InteractiveDialog {
  title: JSX.Element
  icon_url: string
  elements: any[]
  submit_label: string
  notify_on_cancel: boolean
}

export const settingsEventEmitter = new EventEmitter()

export const openUserSettingsDialog = async (currentSettings: UserSettings): Promise<void> => {
  const title = <span style={{ marginLeft: '0.5em' }}>Pexip Settings</span>
  const mediaDevices = await navigator.mediaDevices.enumerateDevices()

  const dialog = createUserSettingsDialog(title, currentSettings, mediaDevices)
  // https://mattermost.atlassian.net/browse/MM-15340
  ;(window as any).openInteractiveDialog({
    dialog,
    url: '/plugins/' + manifest.id + '/api/change_user_settings'
  })
}

const createUserSettingsDialog = (
  title: JSX.Element,
  currentSettings: UserSettings,
  mediaDevices: MediaDeviceInfo[]
): InteractiveDialog => {
  const elements = [
    {
      display_name: 'Camera',
      name: 'inputVideoDeviceId',
      type: 'select',
      default: currentSettings.inputVideoDeviceId,
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
      default: currentSettings.inputAudioDeviceId,
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
      default: currentSettings.outputAudioDeviceId,
      options: mediaDevices
        .filter((device) => device.kind === 'audiooutput')
        .map((device) => ({
          text: device.label,
          value: device.deviceId
        }))
    })
  }

  elements.push({
    display_name: 'Effect',
    name: 'effect',
    type: 'select',
    default: currentSettings.effect,
    options: [
      {
        text: 'No Effect',
        value: 'none'
      },
      {
        text: 'Blur Effect',
        value: 'blur'
      },
      {
        text: 'Background Replacement Effect',
        value: 'overlay'
      }
    ]
  })

  const dialog: InteractiveDialog = {
    title,
    icon_url: getPluginServerRoute() + '/public/icon.svg',
    elements,
    submit_label: 'Change',
    notify_on_cancel: false
  }

  return dialog
}
