import React from 'react'
import { render, screen } from '@testing-library/react'
import { Conference } from './Conference'

jest.mock('@pexip/components', () => ({
  Icon: () => <div />,
  Video: (props: any) => <video {...props} />,
  IconTypes: {
    IconMicrophoneOn: '',
    IconMicrophoneOff: ''
  }
}))

let mockLocalStream: any
let mockVideoMuted: boolean
let mockRemoteStream: any
let mockPresentationStream: any
let mockPresentationInMain: boolean
jest.mock('@contexts/ConferenceContext/ConferenceContext', () => ({
  useConferenceContext: () => ({
    state: {
      participants: [],
      localStream: mockLocalStream,
      videoMuted: mockVideoMuted,
      remoteStream: mockRemoteStream,
      presentationStream: mockPresentationStream,
      presentationInMain: mockPresentationInMain
    }
  })
}))

jest.mock('@components/Tooltip/Tooltip', () => ({
  Tooltip: (props: any) => <div>{props.children}</div>
}))

jest.mock('@pexip/media-components', () => ({
  Selfview: (props: any) => <video {...props}></video>
}))

beforeEach(() => {
  mockLocalStream = 'mediaStream'
  mockVideoMuted = false
  mockRemoteStream = null
  mockPresentationStream = null
  mockPresentationInMain = false
})

describe('Conference', () => {
  it('should render', () => {
    render(<Conference />)
    const conference = screen.getByTestId('Conference')
    expect(conference).toBeInTheDocument()
  })

  describe('SelfView', () => {
    it('should be rendered if localStream != null and !videoMuted', () => {
      mockLocalStream = 'mediaStream'
      render(<Conference />)
      const selfView = screen.queryByTestId('SelfView')
      expect(selfView).toBeInTheDocument()
    })

    it('shouldn\'t be rendered if localStream == null', () => {
      mockLocalStream = null
      render(<Conference />)
      const selfView = screen.queryByTestId('SelfView')
      expect(selfView).not.toBeInTheDocument()
    })

    it('shouldn\'t be rendered if videoMuted', () => {
      mockVideoMuted = true
      render(<Conference />)
      const selfView = screen.queryByTestId('SelfView')
      expect(selfView).not.toBeInTheDocument()
    })
  })

  describe('Main video', () => {
    it('should display the remote video if not presentation available', () => {
      mockRemoteStream = 'remoteStream'
      render(<Conference />)
      const mainVideo = screen.getByTestId('MainVideo')
      expect(mainVideo.getAttribute('srcObject')).toBe(mockRemoteStream)
    })

    it('should display presentation if presentation != null and presentationInMain == true', () => {
      mockRemoteStream = 'remoteStream'
      mockPresentationStream = 'presentationInMain'
      mockPresentationInMain = true
      render(<Conference />)
      const mainVideo = screen.getByTestId('MainVideo')
      expect(mainVideo.getAttribute('srcObject')).toBe(mockPresentationStream)
    })

    it('should display remote video if presentation != null and presentationInMain == false', () => {
      mockRemoteStream = 'remoteStream'
      mockPresentationStream = 'presentationInMain'
      mockPresentationInMain = false
      render(<Conference />)
      const mainVideo = screen.getByTestId('MainVideo')
      expect(mainVideo.getAttribute('srcObject')).toBe(mockRemoteStream)
    })
  })

  describe('PIP hide/show button', () => {
    it('should be displayed if localStream != null and videoMuted == false', () => {
      render(<Conference />)
      const pipButton = screen.queryByTestId('TogglePipButton')
      expect(pipButton).toBeInTheDocument()
    })

    it('should be displayed if presentationStream != null', () => {
      mockLocalStream = null
      mockPresentationStream = 'presentation'
      render(<Conference />)
      const pipButton = screen.queryByTestId('TogglePipButton')
      expect(pipButton).toBeInTheDocument()
    })

    it('shouldn\'t be displayed if localStream == null and presentationStream == null', () => {
      mockLocalStream = null
      render(<Conference />)
      const pipButton = screen.queryByTestId('TogglePipButton')
      expect(pipButton).not.toBeInTheDocument()
    })

    it('shouldn\'t be displayed if localStream != null and videoMuted == true', () => {
      mockVideoMuted = true
      render(<Conference />)
      const pipButton = screen.queryByTestId('TogglePipButton')
      expect(pipButton).not.toBeInTheDocument()
    })
  })
})
