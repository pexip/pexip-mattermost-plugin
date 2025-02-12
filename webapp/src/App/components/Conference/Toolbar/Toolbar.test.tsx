import React from 'react'
import { screen, render, fireEvent } from '@testing-library/react'
import { Toolbar } from './Toolbar'

jest.mock('@pexip/components', () => ({
  Icon: (props: any) => <div {...props} />,
  IconTypes: {
    IconMicrophoneOn: 'microphone-on',
    IconMicrophoneOff: 'microphone-off',
    IconVideoOn: 'video-on',
    IconVideoOff: 'video-off',
    IconPresentationOn: 'presentation-on',
    IconOpenInNew: 'open-in-new'
  }
}))

jest.mock('../../Tooltip/Tooltip', () => ({
  Tooltip: (props: any) => {
    const { children, ...otherProps } = props
    return <div {...otherProps}>{children}</div>
  }
}))

let mockPresentationStream: any
let mockPresentationInPopUp: boolean
let mockAudioMuted: boolean
let mockVideoMuted: boolean
let mockPresenting: boolean
const mockToggleMuteAudio = jest.fn().mockResolvedValue(undefined)
const mockToggleMuteVideo = jest.fn().mockResolvedValue(undefined)
const mockTogglePresenting = jest.fn().mockResolvedValue(undefined)
const mockTogglePresentationInPopUp = jest.fn().mockResolvedValue(undefined)
const mockDisconnect = jest.fn().mockResolvedValue(undefined)
jest.mock('../../../contexts/ConferenceContext/ConferenceContext', () => ({
  useConferenceContext: () => ({
    state: {
      audioMuted: mockAudioMuted,
      videoMuted: mockVideoMuted,
      presenting: mockPresenting,
      presentationStream: mockPresentationStream,
      presentationInPopUp: mockPresentationInPopUp,
      inputVideoDeviceId: 'input-video-device-id',
      inputAudioDeviceId: 'input-audio-device-id',
      outputAudioDeviceId: 'output-audio-device-id'
    },
    toggleMuteAudio: mockToggleMuteAudio,
    toggleMuteVideo: mockToggleMuteVideo,
    togglePresenting: mockTogglePresenting,
    togglePresentationInPopUp: mockTogglePresentationInPopUp,
    disconnect: mockDisconnect
  })
}))

const mockOpenUserSettingsDialog = jest.fn().mockResolvedValue(undefined)
jest.mock('../../../utils/user-settings', () => ({
  openUserSettingsDialog: (props: any) => mockOpenUserSettingsDialog(props)
}))

jest.mock('@pexip/infinity', () => ({}), { virtual: true })

beforeEach(() => {
  mockPresentationStream = null
  mockPresentationInPopUp = false
  mockAudioMuted = false
  mockVideoMuted = false
  mockPresenting = false
  jest.clearAllMocks()
})

describe('Toolbar', () => {
  describe('AudioMuteButton', () => {
    it('should render', () => {
      render(<Toolbar />)
      const button = screen.getByTestId('AudioMuteButton')
      expect(button).toBeInTheDocument()
    })

    it('should call toggleMuteAudio when the button is clicked', () => {
      render(<Toolbar />)
      const button = screen.getByTestId('AudioMuteButton')
      fireEvent.click(button)
      expect(mockToggleMuteAudio).toHaveBeenCalledTimes(1)
    })

    it('should display the mute audio icon if audioMuted is false', () => {
      render(<Toolbar />)
      const button = screen.getByTestId('AudioMuteButton')
      expect(button.childNodes[0]).toHaveAttribute('source', 'microphone-on')
    })

    it('should display the unmute audio icon if audioMuted is true', () => {
      mockAudioMuted = true
      render(<Toolbar />)
      const button = screen.getByTestId('AudioMuteButton')
      expect(button.childNodes[0]).toHaveAttribute('source', 'microphone-off')
    })

    it('should display the mute audio tooltip if audioMuted is false', () => {
      render(<Toolbar />)
      const tooltip = screen.getByTestId('AudioMuteTooltip')
      expect(tooltip).toHaveAttribute('text', 'Mute audio')
    })

    it('should display the unmute audio tooltip if audioMuted is true', () => {
      mockAudioMuted = true
      render(<Toolbar />)
      const tooltip = screen.getByTestId('AudioMuteTooltip')
      expect(tooltip).toHaveAttribute('text', 'Unmute audio')
    })
  })

  describe('VideoMuteButton', () => {
    it('should render', () => {
      render(<Toolbar />)
      const button = screen.getByTestId('VideoMuteButton')
      expect(button).toBeInTheDocument()
    })

    it('should call toggleMuteVideo when the button is clicked', () => {
      render(<Toolbar />)
      const button = screen.getByTestId('VideoMuteButton')
      fireEvent.click(button)
      expect(mockToggleMuteVideo).toHaveBeenCalledTimes(1)
    })

    it('should display the mute video icon if videoMuted is false', () => {
      render(<Toolbar />)
      const button = screen.getByTestId('VideoMuteButton')
      expect(button.childNodes[0]).toHaveAttribute('source', 'video-on')
    })

    it('should display the unmute video icon if videoMuted is true', () => {
      mockVideoMuted = true
      render(<Toolbar />)
      const button = screen.getByTestId('VideoMuteButton')
      expect(button.childNodes[0]).toHaveAttribute('source', 'video-off')
    })

    it('should display the mute video tooltip if videoMuted is false', () => {
      render(<Toolbar />)
      const tooltip = screen.getByTestId('VideoMuteTooltip')
      expect(tooltip).toHaveAttribute('text', 'Mute video')
    })

    it('should display the unmute video tooltip if videoMuted is true', () => {
      mockVideoMuted = true
      render(<Toolbar />)
      const tooltip = screen.getByTestId('VideoMuteTooltip')
      expect(tooltip).toHaveAttribute('text', 'Unmute video')
    })
  })

  describe('PresentationButton', () => {
    it('should render', () => {
      render(<Toolbar />)
      const button = screen.getByTestId('PresentingButton')
      expect(button).toBeInTheDocument()
    })

    it('should call togglePresenting when the button is clicked', () => {
      render(<Toolbar />)
      const button = screen.getByTestId('PresentingButton')
      fireEvent.click(button)
      expect(mockTogglePresenting).toHaveBeenCalledTimes(1)
    })

    it('should display the presenting tooltip if presenting is false', () => {
      render(<Toolbar />)
      const tooltip = screen.getByTestId('PresentingTooltip')
      expect(tooltip).toHaveAttribute('text', 'Start sharing screen')
    })

    it('should display the presenting tooltip if presenting is true', () => {
      mockPresenting = true
      render(<Toolbar />)
      const tooltip = screen.getByTestId('PresentingTooltip')
      expect(tooltip).toHaveAttribute('text', 'Stop sharing screen')
    })

    it('should remove the selected class from the button if presenting is false', () => {
      render(<Toolbar />)
      const button = screen.getByTestId('PresentingButton')
      expect(button).not.toHaveClass('selected')
    })

    it('should add the selected class to the button if presenting is true', () => {
      mockPresenting = true
      render(<Toolbar />)
      const button = screen.getByTestId('PresentingButton')
      expect(button).toHaveClass('selected')
    })
  })

  describe('PopOutPresentationButton', () => {
    it("shouldn't display the pop-out presentation button if presentationStream == null", () => {
      render(<Toolbar />)
      const popOutPresentationButton = screen.queryByTestId('PresentationPopOutButton')
      expect(popOutPresentationButton).not.toBeInTheDocument()
    })

    it('should display the pop-out presentation button if presentationStream != null', () => {
      mockPresentationStream = 'mediaStream'
      render(<Toolbar />)
      const popOutPresentationButton = screen.queryByTestId('PresentationPopOutButton')
      expect(popOutPresentationButton).toBeInTheDocument()
    })

    it('should call togglePresentationInPopUp when the button is clicked', () => {
      mockPresentationStream = 'mediaStream'
      render(<Toolbar />)
      const button = screen.getByTestId('PresentationPopOutButton')
      fireEvent.click(button)
      expect(mockTogglePresentationInPopUp).toHaveBeenCalledTimes(1)
    })

    it('should remove the selected class from the button if presentationInPopUp is false', () => {
      mockPresentationStream = 'mediaStream'
      render(<Toolbar />)
      const popOutPresentationButton = screen.queryByTestId('PresentationPopOutButton')
      expect(popOutPresentationButton).not.toHaveClass('selected')
    })

    it('should add the selected class to the button if presentationInPopUp is true', () => {
      mockPresentationStream = 'mediaStream'
      mockPresentationInPopUp = true
      render(<Toolbar />)
      const popOutPresentationButton = screen.queryByTestId('PresentationPopOutButton')
      expect(popOutPresentationButton).toHaveClass('selected')
    })
  })

  describe('SettingsButton', () => {
    it('should call openUserSettingsDialog when the button is clicked', () => {
      render(<Toolbar />)
      const button = screen.getByTestId('SettingsButton')
      fireEvent.click(button)
      expect(mockOpenUserSettingsDialog).toHaveBeenCalledTimes(1)
    })

    it('should pass the correct props to openUserSettingsDialog', () => {
      render(<Toolbar />)
      const button = screen.getByTestId('SettingsButton')
      fireEvent.click(button)
      expect(mockOpenUserSettingsDialog).toHaveBeenCalledWith({
        inputVideoDeviceId: 'input-video-device-id',
        inputAudioDeviceId: 'input-audio-device-id',
        outputAudioDeviceId: 'output-audio-device-id'
      })
    })
  })

  describe('DisconnectButton', () => {
    it('should call disconnect when the button is clicked', () => {
      render(<Toolbar />)
      const button = screen.getByTestId('DisconnectButton')
      fireEvent.click(button)
      expect(mockDisconnect).toHaveBeenCalledTimes(1)
    })
  })
})
