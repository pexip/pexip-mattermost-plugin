import React from 'react'
import { ConferenceContextProvider, useConferenceContext } from './ConferenceContext'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { type ConferenceConfig } from 'src/types/ConferenceConfig'
import { ConnectionState } from '../../types/ConnectionState'
import { type Channel } from 'mattermost-redux/types/channels'

class MediaStream {
  id: string = '1234'
  active: boolean = true
  addTrack: any = jest.fn()
  getTracks: any = jest.fn(() => [])
  onaddtrack: any = jest.fn()
  onremovetrack: any = jest.fn()
  clone: any = jest.fn()
  getAudioTracks: any = jest.fn()
  getTrackById: any = jest.fn()
  getVideoTracks: any = jest.fn()
  removeTrack: any = jest.fn()
  addEventListener: any = jest.fn()
  removeEventListener: any = jest.fn()
  dispatchEvent: any = jest.fn()
}
window.MediaStream = MediaStream

const mockGetUserMedia = jest.fn()
const mockGetDisplayMedia = jest.fn()

Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
    getUserMedia: mockGetUserMedia,
    getDisplayMedia: mockGetDisplayMedia
  }
})

const mockCall = jest.fn()
const mockDisconnect = jest.fn()
const mockMuteAudio = jest.fn()
const mockMuteVideo = jest.fn()
jest.mock('@pexip/infinity', () => ({
  createInfinityClientSignals: () => ({
    onParticipants: { add: jest.fn() }
  }),
  createCallSignals: () => ({
    onRemoteStream: { add: jest.fn() },
    onRemotePresentationStream: { add: jest.fn() }
  }),
  createInfinityClient: () => ({
    call: mockCall,
    disconnect: mockDisconnect,
    mute: mockMuteAudio,
    muteVideo: mockMuteVideo
  }),
  ClientCallType: {
    AudioVideo: 0
  }
}), { virtual: true })

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
    swapVideos
  } = useConferenceContext()

  const handleSetConfig = (): void => {
    setConfig(mockConfig)
  }

  const handleConnect = (): void => {
    connect(mockChannel).catch((e) => { console.error(e) })
  }

  const handleDisconnect = (): void => {
    disconnect().catch((e) => { console.error(e) })
  }

  const handleMuteAudio = (): void => {
    toggleMuteAudio().catch((e) => { console.error(e) })
  }

  const handleMuteVideo = (): void => {
    toggleMuteVideo().catch((e) => { console.error(e) })
  }

  const handlePresenting = (): void => {
    togglePresenting().catch((e) => { console.error(e) })
  }

  const handleSwapVideos = (): void => {
    swapVideos()
  }

  return (
    <div data-testid='ConferenceContextTester'>
      <span data-testid='config'>{JSON.stringify(state.config)}</span>
      <span data-testid='connectionState'>{state.connectionState}</span>
      <span data-testid='channel'>{JSON.stringify(state.channel)}</span>
      <span data-testid='errorMessage'>{state.errorMessage}</span>
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
    </div>
  )
}

beforeEach(() => {
  mockGetUserMedia.mockReturnValue(new MediaStream())
  mockGetDisplayMedia.mockClear()
  mockCall.mockReturnValue({ status: 200 })
  mockMuteAudio.mockClear()
  mockMuteVideo.mockClear()
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
      render(
        <ConferenceContextTester />
      )
    } catch (e) {
      expect(e.message).toBe('useConferenceContext has to be used within <ConferenceContextProvider>')
    }
  })

  describe('setConfig', () => {
    it('should save the configuration', () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      const button = screen.getByTestId('buttonSetConfig')
      fireEvent.click(button)
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

    it('should change the connectionState to "Connecting" while establishing the call', () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      act(() => {
        const button = screen.getByTestId('buttonConnect')
        fireEvent.click(button)
      })
      const connectionState = screen.getByTestId('connectionState')
      expect(parseInt(connectionState.innerHTML)).toBe(ConnectionState.Connecting)
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
  })

  describe('togglePresenting', () => {
    it('should have the value "presenting" to "false" at the beginning', () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
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
        const button = screen.getByTestId('buttonTogglePresenting')
        fireEvent.click(button)
      })
      expect(mockGetDisplayMedia).toHaveBeenCalledTimes(1)
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
})
