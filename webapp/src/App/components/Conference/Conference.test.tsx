import React from 'react'
import { render, screen } from '@testing-library/react'
import { Conference } from './Conference'

class MediaStream {
  id: string = '1234'
  active: boolean = true
  addTrack: any = jest.fn()
  getTracks: any = jest.fn(() => [])
  onaddtrack: any = jest.fn()
  onremovetrack: any = jest.fn()
  clone: any = jest.fn()
  getAudioTracks: any = jest.fn(() => [])
  getTrackById: any = jest.fn()
  getVideoTracks: any = jest.fn(() => [])
  removeTrack: any = jest.fn()
  addEventListener: any = jest.fn()
  removeEventListener: any = jest.fn()
  dispatchEvent: any = jest.fn()
}
window.MediaStream = MediaStream

jest.mock('@pexip/components', () => ({
  Icon: () => <div />,
  Video: (props: any) => <video data-srcobject={JSON.stringify(props.srcObject)} data-testid={props['data-testid']} />,
  IconTypes: {
    IconMicrophoneOn: '',
    IconMicrophoneOff: ''
  }
}))

let mockLocalVideoStream: any
let mockLocalAudioStream: any
let mockVideoMuted: boolean
let mockRemoteStream: any
let mockPresentationStream: any
let mockPresentationInMain: boolean
let mockPresentationInPopUp: boolean
jest.mock('@contexts/ConferenceContext/ConferenceContext', () => ({
  useConferenceContext: () => ({
    state: {
      participants: [],
      localVideoStream: mockLocalVideoStream,
      localAudioStream: mockLocalAudioStream,
      videoMuted: mockVideoMuted,
      remoteStream: mockRemoteStream,
      presentationStream: mockPresentationStream,
      presentationInMain: mockPresentationInMain,
      presentationInPopUp: mockPresentationInPopUp
    },
    disconnect: jest.fn().mockResolvedValue(undefined)
  })
}))

jest.mock('@components/Tooltip/Tooltip', () => ({
  Tooltip: (props: any) => <div>{props.children}</div>
}))

jest.mock('@pexip/media-components', () => ({
  Selfview: (props: any) => <video data-testid={props['data-testid']}></video>
}))

beforeEach(() => {
  mockLocalVideoStream = new MediaStream()
  mockLocalAudioStream = new MediaStream()
  mockVideoMuted = false
  mockRemoteStream = null
  mockPresentationStream = null
  mockPresentationInMain = false
  mockPresentationInPopUp = false
})

describe('Conference', () => {
  it('should render', () => {
    render(<Conference />)
    const conference = screen.getByTestId('Conference')
    expect(conference).toBeInTheDocument()
  })

  describe('SelfView', () => {
    it('should be rendered if localVideoStream != null and !videoMuted', () => {
      mockLocalVideoStream = new MediaStream()
      render(<Conference />)
      const selfView = screen.queryByTestId('SelfView')
      expect(selfView).toBeInTheDocument()
    })

    it("shouldn't be rendered if localVideoStream == null", () => {
      mockLocalVideoStream = null
      render(<Conference />)
      const selfView = screen.queryByTestId('SelfView')
      expect(selfView).not.toBeInTheDocument()
    })

    it("shouldn't be rendered if videoMuted", () => {
      mockVideoMuted = true
      render(<Conference />)
      const selfView = screen.queryByTestId('SelfView')
      expect(selfView).not.toBeInTheDocument()
    })
  })

  describe('Main video', () => {
    it('should display the remote video if not presentation available', () => {
      mockRemoteStream = new MediaStream()
      mockRemoteStream.id = 'remoteStream'
      render(<Conference />)
      const mainVideo = screen.getByTestId('MainVideo')
      expect(JSON.parse(mainVideo.getAttribute('data-srcobject') ?? '').id).toBe(mockRemoteStream.id)
    })

    it('should display presentation if presentation != null and presentationInMain == true', () => {
      mockRemoteStream = new MediaStream()
      mockRemoteStream.id = 'remoteStream'
      mockPresentationStream = new MediaStream()
      mockPresentationStream.id = 'presentationInMain'
      mockPresentationInMain = true
      render(<Conference />)
      const mainVideo = screen.getByTestId('MainVideo')
      expect(JSON.parse(mainVideo.getAttribute('data-srcobject') ?? '').id).toBe(mockPresentationStream.id)
    })

    it('should display remote video if presentation != null and presentationInMain == false', () => {
      mockRemoteStream = new MediaStream()
      mockRemoteStream.id = 'remoteStream'
      mockPresentationStream = new MediaStream()
      mockPresentationStream.id = 'presentationInMain'
      mockPresentationInMain = false
      render(<Conference />)
      const mainVideo = screen.getByTestId('MainVideo')
      expect(JSON.parse(mainVideo.getAttribute('data-srcobject') ?? '').id).toBe(mockRemoteStream.id)
    })
  })

  describe('PIP hide/show button', () => {
    it('should be displayed if localVideoStream != null and videoMuted == false', () => {
      render(<Conference />)
      const pipButton = screen.queryByTestId('TogglePipButton')
      expect(pipButton).toBeInTheDocument()
    })

    it('should be displayed if presentationStream != null', () => {
      mockLocalVideoStream = null
      mockPresentationStream = 'presentation'
      render(<Conference />)
      const pipButton = screen.queryByTestId('TogglePipButton')
      expect(pipButton).toBeInTheDocument()
    })

    it("shouldn't be displayed if localVideoStream == null and presentationStream == null", () => {
      mockLocalVideoStream = null
      render(<Conference />)
      const pipButton = screen.queryByTestId('TogglePipButton')
      expect(pipButton).not.toBeInTheDocument()
    })

    it("shouldn't be displayed if localVideoStream != null and videoMuted == true", () => {
      mockVideoMuted = true
      render(<Conference />)
      const pipButton = screen.queryByTestId('TogglePipButton')
      expect(pipButton).not.toBeInTheDocument()
    })
  })

  describe('Secondary video', () => {
    it('should display remote video if presentationStream != null and presentationInPopUp', () => {
      mockPresentationStream = 'presentation'
      mockPresentationInPopUp = false
      render(<Conference />)
      const secondaryVideo = screen.getByTestId('SecondaryVideo')
      expect(secondaryVideo).toBeInTheDocument()
    })

    it("shouldn't be displayed if presentationStream == null", () => {
      mockPresentationStream = null
      mockPresentationInPopUp = false
      render(<Conference />)
      const secondaryVideo = screen.queryByTestId('SecondaryVideo')
      expect(secondaryVideo).not.toBeInTheDocument()
    })

    it("shouldn't be displayed if presentationInPopUp", () => {
      mockPresentationStream = 'presentation'
      mockPresentationInPopUp = true
      render(<Conference />)
      const secondaryVideo = screen.queryByTestId('SecondaryVideo')
      expect(secondaryVideo).not.toBeInTheDocument()
    })
  })
})
