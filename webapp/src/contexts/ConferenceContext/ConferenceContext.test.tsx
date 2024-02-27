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

Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
    getUserMedia: mockGetUserMedia
  }
})

const mockCall = jest.fn()
jest.mock('@pexip/infinity', () => ({
  createInfinityClientSignals: () => ({
    onParticipants: { add: jest.fn() }
  }),
  createCallSignals: () => ({
    onRemoteStream: { add: jest.fn() },
    onRemotePresentationStream: { add: jest.fn() }
  }),
  createInfinityClient: () => ({
    call: mockCall
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
  const { state, setConfig, connect } = useConferenceContext()

  const handleSetConfig = (): void => {
    setConfig(mockConfig)
  }

  const handleConnect = (): void => {
    connect(mockChannel).catch((e) => { console.error(e) })
  }

  return (
    <div data-testid='ConferenceContextTester'>
      <span data-testid='config'>{JSON.stringify(state.config)}</span>
      <span data-testid='connectionState'>{state.connectionState}</span>
      <span data-testid='channel'>{JSON.stringify(state.channel)}</span>
      <span data-testid='errorMessage'>{state.errorMessage}</span>
      <button data-testid='buttonSetConfig' onClick={handleSetConfig} />
      <button data-testid='buttonConnect' onClick={handleConnect} />
    </div>
  )
}

beforeEach(() => {
  mockGetUserMedia.mockReturnValue(new MediaStream())
  mockCall.mockReturnValue({ status: 200 })
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

    it('should set the "channel" in the state while establishing the call', () => {
      render(
        <ConferenceContextProvider>
          <ConferenceContextTester />
        </ConferenceContextProvider>
      )
      act(() => {
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

  })

  describe('toggleMuteAudio', () => {

  })

  describe('toggleMuteVideo', () => {

  })

  describe('togglePresenting', () => {

  })

  describe('swapVideos', () => {

  })
})
