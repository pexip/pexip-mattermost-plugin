import React from 'react'
import { ConferenceContextProvider, useConferenceContext } from './ConferenceContext'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import { type ConferenceConfig } from 'src/types/ConferenceConfig'
import { ConnectionState } from '../../types/ConnectionState'
import { type Channel } from 'mattermost-redux/types/channels'
import { type DevicesIds } from './methods/changeDevices'

const mockDevicesIds: DevicesIds = {
  inputAudioDeviceId: 'input-audio-device-id-mock',
  inputVideoDeviceId: 'input-video-device-id-mock',
  outputAudioDeviceId: 'output-audio-device-id-mock'
}

const mockAudioTrackStop = jest.fn()
const mockVideoTrackStop = jest.fn()
class MediaStream {
  id: string = '1234'
  active: boolean = true
  addTrack: any = jest.fn()
  onaddtrack: any = jest.fn()
  onremovetrack: any = jest.fn()
  clone: any = jest.fn()
  getTrackById: any = jest.fn()

  getTracks: any = jest.fn(() => [
    {
      stop: mockVideoTrackStop,
      getSettings: () => ({
        deviceId: ''
      }),
      addEventListener: jest.fn()
    }
  ])

  getVideoTracks: any = jest.fn(() => [
    {
      stop: mockVideoTrackStop,
      getSettings: () => ({
        deviceId: ''
      }),
      addEventListener: jest.fn()
    }
  ])

  getAudioTracks: any = jest.fn(() => [
    {
      stop: mockAudioTrackStop,
      getSettings: () => ({
        deviceId: ''
      }),
      addEventListener: jest.fn()
    }
  ])

  removeTrack: any = jest.fn()
  addEventListener: any = jest.fn()
  removeEventListener: any = jest.fn()
  dispatchEvent: any = jest.fn()
}
window.MediaStream = MediaStream

const mockGetUserMedia = jest.fn()
const mockGetDisplayMedia = jest.fn()
const mockEnumerateDevices = jest.fn()
const mockMediaDevicesAddEventListener = jest.fn()

Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
    getUserMedia: mockGetUserMedia,
    getDisplayMedia: mockGetDisplayMedia,
    enumerateDevices: mockEnumerateDevices,
    addEventListener: mockMediaDevicesAddEventListener,
    removeEventListener: jest.fn()
  }
})

const mockCall = jest.fn()
const mockDisconnect = jest.fn().mockResolvedValue(undefined)
const mockMuteAudio = jest.fn()
const mockMuteVideo = jest.fn()
const mockSetStream = jest.fn()
const mockPresent = jest.fn()
const mockStopPresenting = jest.fn()
jest.mock(
  '@pexip/infinity',
  () => ({
    createInfinityClientSignals: () => ({
      onParticipants: { add: jest.fn() },
      onDisconnected: { add: jest.fn() }
    }),
    createCallSignals: () => ({
      onRemoteStream: { add: jest.fn() },
      onRemotePresentationStream: { add: jest.fn() }
    }),
    createInfinityClient: () => ({
      call: mockCall,
      disconnect: mockDisconnect,
      mute: mockMuteAudio,
      muteVideo: mockMuteVideo,
      setStream: mockSetStream,
      present: mockPresent,
      stopPresenting: mockStopPresenting
    }),
    ClientCallType: {
      AudioVideo: 0
    }
  }),
  { virtual: true }
)

jest.mock('@pexip/media-processor', () => ({}), { virtual: true })

const mockConfig: ConferenceConfig = {
  node: 'node-mock',
  displayName: 'display-name-mock',
  vmrPrefix: 'vmr-prefix-mock',
  hostPin: 'host-pin-mock'
}

const mockChannel: Channel = {
  id: 'id-mock',
  create_at: 0,
  update_at: 0,
  delete_at: 0,
  team_id: 'team-id-mock',
  type: 'O',
  display_name: 'display-name-mock',
  name: 'name-mock',
  header: 'header-mock',
  purpose: 'purpose-mock',
  last_post_at: 0,
  total_msg_count: 0,
  extra_update_at: 0,
  creator_id: 'creator-id-mock',
  scheme_id: 'scheme-id-mock',
  group_constrained: false
}

const ConferenceContextTester = (): JSX.Element => {
  const {
    state,
    setConfig,
    connect,
    disconnect,
    toggleMuteAudio,
    toggleMuteVideo,
    togglePresenting,
    swapVideos,
    changeDevices
  } = useConferenceContext()

  const handleSetConfig = (): void => {
    setConfig(mockConfig)
  }

  const handleConnect = (): void => {
    connect(mockChannel).catch((e) => {
      console.error(e)
    })
  }

  const handleDisconnect = (): void => {
    disconnect().catch((e) => {
      console.error(e)
    })
  }

  const handleMuteAudio = (): void => {
    toggleMuteAudio().catch((e) => {
      console.error(e)
    })
  }

  const handleMuteVideo = (): void => {
    toggleMuteVideo().catch((e) => {
      console.error(e)
    })
  }

  const handlePresenting = (): void => {
    togglePresenting().catch((e) => {
      console.error(e)
    })
  }

  const handleSwapVideos = (): void => {
    swapVideos()
  }

  const handleChangeDevices = (): void => {
    changeDevices(mockDevicesIds).catch((e) => {
      console.error(e)
    })
  }

  return (
    <div data-testid='ConferenceContextTester'>
      <span data-testid='config'>{JSON.stringify(state.config)}</span>
      <span data-testid='connectionState'>{state.connectionState}</span>
      <span data-testid='channel'>{JSON.stringify(state.channel)}</span>
      <span data-testid='errorMessage'>{state.errorMessage}</span>
      <span data-testid='outputAudioDeviceId'>{state.outputAudioDeviceId}</span>
      <span data-testid='audioMuted'>{state.audioMuted ? 'true' : 'false'}</span>
      <span data-testid='videoMuted'>{state.videoMuted ? 'true' : 'false'}</span>
      <span data-testid='presenting'>{state.presenting ? 'true' : 'false'}</span>
      <span data-testid='presentationInMain'>{state.presentationInMain ? 'true' : 'false'}</span>
      <button data-testid='buttonSetConfig' onClick={handleSetConfig} />
      <button data-testid='buttonConnect' onClick={handleConnect} />
      <button data-testid='buttonDisconnect' onClick={handleDisconnect} />
      <button data-testid='buttonToggleMuteAudio' onClick={handleMuteAudio} />
      <button data-testid='buttonToggleMuteVideo' onClick={handleMuteVideo} />
      <button data-testid='buttonTogglePresenting' onClick={handlePresenting} />
      <button data-testid='buttonSwapVideos' onClick={handleSwapVideos} />
      <button data-testid='buttonChangeDevices' onClick={handleChangeDevices} />
    </div>
  )
}

beforeEach(() => {
  jest.clearAllMocks()
  mockCall.mockReturnValue({ status: 200 })
  mockEnumerateDevices.mockResolvedValue([])
  mockGetUserMedia.mockReturnValue(new MediaStream())
  mockGetDisplayMedia.mockReturnValue(new MediaStream())
})

describe('ConferenceContext', () => {
  it('should render', () => {
    render(
      <ConferenceContextProvider>
        <ConferenceContextTester />
      </ConferenceContextProvider>
    )
    const tester = screen.getByTestId('ConferenceContextTester')
    expect(tester).toBeInTheDocument()
  })

  it('should trigger an exception if not inside the ConferenceContextProvider', () => {
    expect.assertions(1)
    try {
      render(<ConferenceContextTester />)
    } catch (e) {
      expect(e.message).toBe('useConferenceContext has to be used within <ConferenceContextProvider>')
    }
  })

  describe('setConfig', () => {
    it('should save the configuration', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonSetConfig')
        fireEvent.click(button)
      })
      const config = screen.getByTestId('config')
      expect(JSON.parse(config.innerHTML)).toStrictEqual(mockConfig)
    })
  })

  describe('connect', () => {
    it('should have the connectionState to "Disconnected" before calling', () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      const connectionState = screen.getByTestId('connectionState')
      expect(parseInt(connectionState.innerHTML)).toBe(ConnectionState.Disconnected)
    })

    it('should change the connectionState to "Connecting" while establishing the call', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      act(() => {
        const button = screen.getByTestId('buttonConnect')
        fireEvent.click(button)
      })
      await waitFor(() => {
        const connectionState = screen.getByTestId('connectionState')
        expect(parseInt(connectionState.innerHTML)).toBe(ConnectionState.Connecting)
      })
    })

    it('should set the "channel" in the state while establishing the call', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonConnect')
        fireEvent.click(button)
      })
      const channel = screen.getByTestId('channel')
      expect(JSON.parse(channel.innerHTML)).toStrictEqual(mockChannel)
    })

    it('should change the connectionState to "Connected" once the connection is established', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonConnect')
        fireEvent.click(button)
      })
      const connectionState = screen.getByTestId('connectionState')
      const errorMessage = screen.getByTestId('errorMessage')
      expect(parseInt(connectionState.innerHTML)).toBe(ConnectionState.Connected)
      expect(errorMessage.innerHTML).toBe('')
    })

    it('should change the connectionState to "Error" if something fails', async () => {
      const error = { message: 'Cannot use the camera' }
      mockGetUserMedia.mockRejectedValue(error)
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonConnect')
        fireEvent.click(button)
      })
      const connectionState = screen.getByTestId('connectionState')
      const errorMessage = screen.getByTestId('errorMessage')
      expect(parseInt(connectionState.innerHTML)).toBe(ConnectionState.Error)
      expect(errorMessage.innerHTML).toBe(error.message)
    })

    it('should return "Cannot connect" message if response.status != 200', async () => {
      mockCall.mockResolvedValue({ status: 401 })
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonConnect')
        fireEvent.click(button)
      })
      const connectionState = screen.getByTestId('connectionState')
      const errorMessage = screen.getByTestId('errorMessage')
      expect(parseInt(connectionState.innerHTML)).toBe(ConnectionState.Error)
      expect(errorMessage.innerHTML).toBe('Cannot connect')
    })

    it('should set to "false" the state for muteAudio, muteVideo and presenting when reconnected', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )

      await act(async () => {
        let button = screen.getByTestId('buttonConnect')
        fireEvent.click(button)
        button = screen.getByTestId('buttonToggleMuteAudio')
        fireEvent.click(button)
        button = screen.getByTestId('buttonToggleMuteVideo')
        fireEvent.click(button)
        button = screen.getByTestId('buttonTogglePresenting')
        fireEvent.click(button)
      })

      await act(async () => {
        let button = screen.getByTestId('buttonDisconnect')
        fireEvent.click(button)
        button = screen.getByTestId('buttonConnect')
        fireEvent.click(button)
      })

      const audioMuted = screen.getByTestId('audioMuted')
      const videoMuted = screen.getByTestId('videoMuted')
      const presenting = screen.getByTestId('presenting')

      expect(audioMuted.innerHTML).toBe('false')
      expect(videoMuted.innerHTML).toBe('false')
      expect(presenting.innerHTML).toBe('false')
    })
  })

  describe('disconnect', () => {
    it('should change the connectionState to "Disconnected"', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonConnect')
        fireEvent.click(button)
      })
      await act(async () => {
        const button = screen.getByTestId('buttonDisconnect')
        fireEvent.click(button)
      })
      const connectionState = screen.getByTestId('connectionState')
      const errorMessage = screen.getByTestId('errorMessage')
      expect(parseInt(connectionState.innerHTML)).toBe(ConnectionState.Disconnected)
      expect(errorMessage.innerHTML).toBe('')
    })
  })

  describe('toggleMuteAudio', () => {
    it('should have the initial value to "false"', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      const muted = screen.getByTestId('audioMuted')
      expect(muted.innerHTML).toBe('false')
    })

    it('should change to "true" when triggered', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonToggleMuteAudio')
        fireEvent.click(button)
      })
      const muted = screen.getByTestId('audioMuted')
      expect(muted.innerHTML).toBe('true')
    })

    it('should change to "false" when triggered twice', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonToggleMuteAudio')
        fireEvent.click(button)
      })
      await act(async () => {
        const button = screen.getByTestId('buttonToggleMuteAudio')
        fireEvent.click(button)
      })
      const muted = screen.getByTestId('audioMuted')
      expect(muted.innerHTML).toBe('false')
    })

    it('should call "client.mute" with the new value', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonConnect')
        fireEvent.click(button)
      })
      await act(async () => {
        const button = screen.getByTestId('buttonToggleMuteAudio')
        fireEvent.click(button)
      })
      expect(mockMuteAudio).toHaveBeenCalledTimes(1)
      expect(mockMuteAudio).toHaveBeenCalledWith({ mute: true })
    })

    it('should call "client.mute" with the new value when called twice', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonConnect')
        fireEvent.click(button)
      })
      await act(async () => {
        const button = screen.getByTestId('buttonToggleMuteAudio')
        fireEvent.click(button)
      })
      await act(async () => {
        const button = screen.getByTestId('buttonToggleMuteAudio')
        fireEvent.click(button)
      })
      expect(mockMuteAudio).toHaveBeenCalledTimes(2)
      expect(mockMuteAudio).toHaveBeenCalledWith({ mute: false })
    })

    it('should stop the audio track when trying to mute', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonConnect')
        fireEvent.click(button)
      })
      await act(async () => {
        const button = screen.getByTestId('buttonToggleMuteAudio')
        fireEvent.click(button)
      })
      expect(mockGetUserMedia).toHaveBeenCalledTimes(2)
      expect(mockAudioTrackStop).toHaveBeenCalledTimes(1)
    })

    it('should call getUserMedia when trying to unmute', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonConnect')
        fireEvent.click(button)
      })
      await act(async () => {
        const button = screen.getByTestId('buttonToggleMuteAudio')
        fireEvent.click(button)
      })
      await act(async () => {
        const button = screen.getByTestId('buttonToggleMuteAudio')
        fireEvent.click(button)
      })
      expect(mockGetUserMedia).toHaveBeenCalledTimes(3)
      expect(mockAudioTrackStop).toHaveBeenCalledTimes(1)
    })
  })

  describe('toggleMuteVideo', () => {
    it('should have the initial value to "false"', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      const muted = screen.getByTestId('videoMuted')
      expect(muted.innerHTML).toBe('false')
    })

    it('should change to "true" when triggered', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonToggleMuteVideo')
        fireEvent.click(button)
      })
      const muted = screen.getByTestId('videoMuted')
      expect(muted.innerHTML).toBe('true')
    })

    it('should change to "false" when triggered twice', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonToggleMuteVideo')
        fireEvent.click(button)
      })
      await act(async () => {
        const button = screen.getByTestId('buttonToggleMuteVideo')
        fireEvent.click(button)
      })
      const muted = screen.getByTestId('videoMuted')
      expect(muted.innerHTML).toBe('false')
    })

    it('should call "client.muteVideo" with the new value', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonConnect')
        fireEvent.click(button)
      })
      await act(async () => {
        const button = screen.getByTestId('buttonToggleMuteVideo')
        fireEvent.click(button)
      })
      expect(mockMuteVideo).toHaveBeenCalledTimes(1)
      expect(mockMuteVideo).toHaveBeenCalledWith({ muteVideo: true })
    })

    it('should call "client.muteVideo" with the new value when called twice', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonConnect')
        fireEvent.click(button)
      })
      await act(async () => {
        const button = screen.getByTestId('buttonToggleMuteVideo')
        fireEvent.click(button)
      })
      await act(async () => {
        const button = screen.getByTestId('buttonToggleMuteVideo')
        fireEvent.click(button)
      })
      expect(mockMuteVideo).toHaveBeenCalledTimes(2)
      expect(mockMuteVideo).toHaveBeenCalledWith({ muteVideo: false })
    })

    it('should stop the video track when trying to mute', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonConnect')
        fireEvent.click(button)
      })
      await act(async () => {
        const button = screen.getByTestId('buttonToggleMuteVideo')
        fireEvent.click(button)
      })
      expect(mockGetUserMedia).toHaveBeenCalledTimes(2)
      expect(mockVideoTrackStop).toHaveBeenCalledTimes(1)
    })

    it('should call getUserMedia when trying to unmute', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonConnect')
        fireEvent.click(button)
      })
      await act(async () => {
        const button = screen.getByTestId('buttonToggleMuteVideo')
        fireEvent.click(button)
      })
      await act(async () => {
        const button = screen.getByTestId('buttonToggleMuteVideo')
        fireEvent.click(button)
      })
      expect(mockGetUserMedia).toHaveBeenCalledTimes(3)
      expect(mockVideoTrackStop).toHaveBeenCalledTimes(1)
    })
  })

  describe('togglePresenting', () => {
    it('should have the value "presenting" to "false" at the beginning', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonConnect')
        fireEvent.click(button)
      })
      const presenting = screen.getByTestId('presenting')
      expect(presenting.innerHTML).toBe('false')
    })

    it('should change the value "presenting" to "true" when triggered', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonConnect')
        fireEvent.click(button)
      })
      await act(async () => {
        const button = screen.getByTestId('buttonTogglePresenting')
        fireEvent.click(button)
      })
      const presenting = screen.getByTestId('presenting')
      expect(presenting.innerHTML).toBe('true')
    })

    it('should change the value "presenting" to "false" when triggered twice', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonConnect')
        fireEvent.click(button)
      })
      await act(async () => {
        const button = screen.getByTestId('buttonTogglePresenting')
        fireEvent.click(button)
      })
      await act(async () => {
        const button = screen.getByTestId('buttonTogglePresenting')
        fireEvent.click(button)
      })
      const presenting = screen.getByTestId('presenting')
      expect(presenting.innerHTML).toBe('false')
    })

    it('should trigger "getDisplayMedia" when called', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonConnect')
        fireEvent.click(button)
      })
      await act(async () => {
        const button = screen.getByTestId('buttonTogglePresenting')
        fireEvent.click(button)
      })
      expect(mockGetDisplayMedia).toHaveBeenCalledTimes(1)
    })

    it('should call "client.present" when called', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonConnect')
        fireEvent.click(button)
      })
      await act(async () => {
        const button = screen.getByTestId('buttonTogglePresenting')
        fireEvent.click(button)
      })
      expect(mockPresent).toHaveBeenCalledTimes(1)
      expect(mockStopPresenting).not.toHaveBeenCalled()
    })

    it('should call "client.stopPresenting" when called twice', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonConnect')
        fireEvent.click(button)
      })
      await act(async () => {
        const button = screen.getByTestId('buttonTogglePresenting')
        fireEvent.click(button)
      })
      await act(async () => {
        const button = screen.getByTestId('buttonTogglePresenting')
        fireEvent.click(button)
      })
      expect(mockPresent).toHaveBeenCalledTimes(1)
      expect(mockStopPresenting).toHaveBeenCalledTimes(1)
    })
  })

  describe('swapVideos', () => {
    it('should have "presentationInMain" to "false" by default', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      const presentationInMain = screen.getByTestId('presentationInMain')
      expect(presentationInMain.innerHTML).toBe('false')
    })

    it('should have "presentationInMain" to "false" when enable presentation by button and true before', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonSwapVideos')
        fireEvent.click(button)
      })
      const presentationInMain = screen.getByTestId('presentationInMain')
      expect(presentationInMain.innerHTML).toBe('true')
      await act(async () => {
        const button = screen.getByTestId('buttonTogglePresenting')
        fireEvent.click(button)
      })
      expect(presentationInMain.innerHTML).toBe('false')
    })

    it('should have "presentationInMain" to "true" when clicked once', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonSwapVideos')
        fireEvent.click(button)
      })
      const presentationInMain = screen.getByTestId('presentationInMain')
      expect(presentationInMain.innerHTML).toBe('true')
    })

    it('should have "presentationInMain" to "true" when clicked twice', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonSwapVideos')
        fireEvent.click(button)
      })
      await act(async () => {
        const button = screen.getByTestId('buttonSwapVideos')
        fireEvent.click(button)
      })
      const presentationInMain = screen.getByTestId('presentationInMain')
      expect(presentationInMain.innerHTML).toBe('false')
    })

    it('should have "presentationInMain" to "false" when enable presentation by button and true before', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonSwapVideos')
        fireEvent.click(button)
      })
      const presentationInMain = screen.getByTestId('presentationInMain')
      expect(presentationInMain.innerHTML).toBe('true')
      await act(async () => {
        const button = screen.getByTestId('buttonTogglePresenting')
        fireEvent.click(button)
      })
      expect(presentationInMain.innerHTML).toBe('false')
    })
  })

  describe('changeDevices', () => {
    it('should change the outputAudioDeviceId in the state', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonChangeDevices')
        fireEvent.click(button)
      })
      const outputAudioDeviceId = screen.getByTestId('outputAudioDeviceId')
      expect(outputAudioDeviceId.innerHTML).toBe(mockDevicesIds.outputAudioDeviceId)
    })

    it('should call getUserMedia with the proper deviceId for audio and video', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonConnect')
        fireEvent.click(button)
      })
      await act(async () => {
        const button = screen.getByTestId('buttonChangeDevices')
        fireEvent.click(button)
      })
      expect(mockGetUserMedia).toHaveBeenCalledTimes(4)
      expect(mockGetUserMedia.mock.calls).toEqual([
        [
          {
            video: { deviceId: '' }
          }
        ],
        [
          {
            audio: { deviceId: '' }
          }
        ],
        [
          {
            video: { deviceId: mockDevicesIds.inputVideoDeviceId }
          }
        ],
        [
          {
            audio: { deviceId: mockDevicesIds.inputAudioDeviceId }
          }
        ]
      ])
    })

    it('should call getUserMedia with only deviceId for audio when videoMuted', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonConnect')
        fireEvent.click(button)
      })
      await act(async () => {
        const button = screen.getByTestId('buttonToggleMuteVideo')
        fireEvent.click(button)
      })
      await act(async () => {
        const button = screen.getByTestId('buttonChangeDevices')
        fireEvent.click(button)
      })
      expect(mockGetUserMedia).toHaveBeenCalledTimes(3)
      expect(mockGetUserMedia.mock.calls).toEqual([
        [
          {
            video: { deviceId: '' }
          }
        ],
        [
          {
            audio: { deviceId: '' }
          }
        ],
        [
          {
            audio: { deviceId: mockDevicesIds.inputAudioDeviceId }
          }
        ]
      ])
    })

    it('should call getUserMedia with only deviceId for video when audioMuted', async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonConnect')
        fireEvent.click(button)
      })
      await act(async () => {
        const button = screen.getByTestId('buttonToggleMuteAudio')
        fireEvent.click(button)
      })
      await act(async () => {
        const button = screen.getByTestId('buttonChangeDevices')
        fireEvent.click(button)
      })
      expect(mockGetUserMedia).toHaveBeenCalledTimes(3)
      expect(mockGetUserMedia.mock.calls).toEqual([
        [
          {
            video: { deviceId: '' }
          }
        ],
        [
          {
            audio: { deviceId: '' }
          }
        ],
        [
          {
            video: { deviceId: mockDevicesIds.inputVideoDeviceId }
          }
        ]
      ])
    })

    it("shouldn't call getUserMedia if audioMuted and videoMuted are true", async () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonConnect')
        fireEvent.click(button)
      })
      await act(async () => {
        let button = screen.getByTestId('buttonToggleMuteAudio')
        fireEvent.click(button)
        button = screen.getByTestId('buttonToggleMuteVideo')
        fireEvent.click(button)
      })
      await act(async () => {
        const button = screen.getByTestId('buttonChangeDevices')
        fireEvent.click(button)
      })
      expect(mockGetUserMedia).toHaveBeenCalledTimes(2)
    })

    it('should be triggered when "devicechange" event received', async () => {
      const newAudioDeviceId = '1234'
      const newVideoDeviceId = '5678'
      let callback = jest.fn()
      mockMediaDevicesAddEventListener.mockImplementation((event, cb) => {
        callback = cb
      })
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('buttonConnect')
        fireEvent.click(button)
      })
      navigator.mediaDevices.enumerateDevices = jest.fn().mockResolvedValue([
        {
          deviceId: newAudioDeviceId,
          kind: 'audioinput'
        },
        {
          deviceId: newVideoDeviceId,
          kind: 'videoinput'
        }
      ])
      await act(async () => {
        callback()
      })
      expect(mockGetUserMedia).toHaveBeenCalledTimes(4)
      expect(mockGetUserMedia.mock.calls).toEqual([
        [
          {
            video: { deviceId: '' }
          }
        ],
        [
          {
            audio: { deviceId: '' }
          }
        ],
        [
          {
            video: { deviceId: newVideoDeviceId }
          }
        ],
        [
          {
            audio: { deviceId: newAudioDeviceId }
          }
        ]
      ])
    })
  })
})
