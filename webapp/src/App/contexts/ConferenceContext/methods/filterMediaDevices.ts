interface DevicesIds {
  inputVideoDeviceId: string
  inputAudioDeviceId: string
  outputAudioDeviceId: string
}

const isDeviceAvailable = (mediaDevices: MediaDeviceInfo[], deviceId: string): boolean => {
  return mediaDevices.some((device) => device.deviceId === deviceId)
}

const getFirstDeviceId = (mediaDevices: MediaDeviceInfo[], kind: MediaDeviceKind): string => {
  const audioDevices = mediaDevices.filter((device) => device.kind === kind)
  if (audioDevices.length > 0) {
    return audioDevices[0].deviceId
  } else {
    return ''
  }
}

export const filterMediaDevices = async (currentDevicesIds: DevicesIds): Promise<DevicesIds> => {
  let { inputVideoDeviceId, inputAudioDeviceId, outputAudioDeviceId } = currentDevicesIds
  const mediaDevices = await navigator.mediaDevices.enumerateDevices()

  if (inputVideoDeviceId === '' || !isDeviceAvailable(mediaDevices, inputVideoDeviceId)) {
    inputVideoDeviceId = getFirstDeviceId(mediaDevices, 'videoinput')
  }

  if (inputAudioDeviceId === '' || !isDeviceAvailable(mediaDevices, inputAudioDeviceId)) {
    inputAudioDeviceId = getFirstDeviceId(mediaDevices, 'audioinput')
  }

  if (outputAudioDeviceId === '' || !isDeviceAvailable(mediaDevices, outputAudioDeviceId)) {
    outputAudioDeviceId = getFirstDeviceId(mediaDevices, 'audiooutput')
  }

  return {
    inputVideoDeviceId,
    inputAudioDeviceId,
    outputAudioDeviceId
  }
}
