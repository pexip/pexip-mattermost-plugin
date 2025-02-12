import React from 'react'
import { render, screen } from '@testing-library/react'
import { ParticipantList } from './ParticipantList'

jest.mock('@pexip/components', () => ({
  Button: (props: any) => <button {...props}>{props.children}</button>,
  Icon: (props: any) => <div {...props} />,
  IconTypes: {
    IconMicrophoneOff: 'icon-microphone-off',
    IconVideoOff: 'icon-video-off',
    IconPresentationOn: 'icon-presentation-on'
  }
}))

jest.mock(
  '@pexip/infinity',
  () => ({
    Participant: {
      displayName: 'Test User',
      isMuted: true,
      isCameraMuted: true,
      isPresenting: true
    }
  }),
  { virtual: true }
)
const mockUseConferenceContext = jest.fn()
jest.mock('../../../contexts/ConferenceContext/ConferenceContext', () => ({
  useConferenceContext: () => mockUseConferenceContext()
}))

jest.mock('../../Tooltip/Tooltip', () => ({
  Tooltip: (props: any) => <div>{props.children}</div>
}))

beforeEach(() => {
  mockUseConferenceContext.mockReturnValue({
    state: {
      participants: [
        {
          displayName: 'Test User',
          isMuted: false,
          isCameraMuted: false,
          isPresenting: false,
          isWaiting: false
        }
      ]
    }
  })
})

describe('ParticipantList', () => {
  it('should render', () => {
    render(<ParticipantList />)
    const participantList = screen.getByTestId('ParticipantList')
    expect(participantList).toBeInTheDocument()
  })

  it("shouldn't display any state by default", () => {
    render(<ParticipantList />)
    const admitButton = screen.queryByTestId('AdmitButton')
    const microphoneMutedIcon = screen.queryByTestId('MicrophoneMutedIcon')
    const cameraMutedIcon = screen.queryByTestId('CameraMutedIcon')
    const presentingIcon = screen.queryByTestId('PresentingIcon')
    expect(admitButton).not.toBeInTheDocument()
    expect(microphoneMutedIcon).not.toBeInTheDocument()
    expect(cameraMutedIcon).not.toBeInTheDocument()
    expect(presentingIcon).not.toBeInTheDocument()
  })

  it('should display the admit button icon when a participant is waiting', () => {
    mockUseConferenceContext.mockReturnValue({
      state: {
        participants: [
          {
            displayName: 'Test User',
            isWaiting: true,
            isMuted: false,
            isCameraMuted: false,
            isPresenting: false
          }
        ]
      }
    })
    render(<ParticipantList />)
    const admitButton = screen.queryByTestId('AdmitButton')
    const microphoneMutedIcon = screen.queryByTestId('MicrophoneMutedIcon')
    const cameraMutedIcon = screen.queryByTestId('CameraMutedIcon')
    const presentingIcon = screen.queryByTestId('PresentingIcon')
    expect(admitButton).toBeInTheDocument()
    expect(microphoneMutedIcon).not.toBeInTheDocument()
    expect(cameraMutedIcon).not.toBeInTheDocument()
    expect(presentingIcon).not.toBeInTheDocument()
  })

  it('should display the muted microphone icon when a participant is muted', () => {
    mockUseConferenceContext.mockReturnValue({
      state: {
        participants: [
          {
            displayName: 'Test User',
            isWaiting: false,
            isMuted: true,
            isCameraMuted: false,
            isPresenting: false
          }
        ]
      }
    })
    render(<ParticipantList />)
    const admitButton = screen.queryByTestId('AdmitButton')
    const microphoneMutedIcon = screen.queryByTestId('MicrophoneMutedIcon')
    const cameraMutedIcon = screen.queryByTestId('CameraMutedIcon')
    const presentingIcon = screen.queryByTestId('PresentingIcon')
    expect(admitButton).not.toBeInTheDocument()
    expect(microphoneMutedIcon).toBeInTheDocument()
    expect(cameraMutedIcon).not.toBeInTheDocument()
    expect(presentingIcon).not.toBeInTheDocument()
  })

  it("should display the muted camera icon when a participant's camera is muted", () => {
    mockUseConferenceContext.mockReturnValue({
      state: {
        participants: [
          {
            displayName: 'Test User',
            isWaiting: false,
            isMuted: false,
            isCameraMuted: true,
            isPresenting: false
          }
        ]
      }
    })
    render(<ParticipantList />)
    const admitButton = screen.queryByTestId('AdmitButton')
    const microphoneMutedIcon = screen.queryByTestId('MicrophoneMutedIcon')
    const cameraMutedIcon = screen.queryByTestId('CameraMutedIcon')
    const presentingIcon = screen.queryByTestId('PresentingIcon')
    expect(admitButton).not.toBeInTheDocument()
    expect(microphoneMutedIcon).not.toBeInTheDocument()
    expect(cameraMutedIcon).toBeInTheDocument()
    expect(presentingIcon).not.toBeInTheDocument()
  })

  it('should display the screen sharing icon when a participant is presenting', () => {
    mockUseConferenceContext.mockReturnValue({
      state: {
        participants: [
          {
            displayName: 'Test User',
            isWaiting: false,
            isMuted: false,
            isCameraMuted: false,
            isPresenting: true
          }
        ]
      }
    })
    render(<ParticipantList />)
    const admitButton = screen.queryByTestId('AdmitButton')
    const microphoneMutedIcon = screen.queryByTestId('MicrophoneMutedIcon')
    const cameraMutedIcon = screen.queryByTestId('CameraMutedIcon')
    const presentingIcon = screen.queryByTestId('PresentingIcon')
    expect(admitButton).not.toBeInTheDocument()
    expect(microphoneMutedIcon).not.toBeInTheDocument()
    expect(cameraMutedIcon).not.toBeInTheDocument()
    expect(presentingIcon).toBeInTheDocument()
  })

  it('should display several muted icons if at least two participants are muted', () => {
    mockUseConferenceContext.mockReturnValue({
      state: {
        participants: [
          {
            displayName: 'Test User',
            isWaiting: false,
            isMuted: true,
            isCameraMuted: false,
            isPresenting: false
          },
          {
            displayName: 'Test User 2',
            isWaiting: false,
            isMuted: true,
            isCameraMuted: false,
            isPresenting: false
          }
        ]
      }
    })
    render(<ParticipantList />)
    const admitButton = screen.queryByTestId('AdmitButton')
    const microphoneMutedIcon = screen.queryAllByTestId('MicrophoneMutedIcon')
    const cameraMutedIcon = screen.queryByTestId('CameraMutedIcon')
    const presentingIcon = screen.queryByTestId('PresentingIcon')
    expect(admitButton).not.toBeInTheDocument()
    expect(microphoneMutedIcon.length).toBe(2)
    expect(cameraMutedIcon).not.toBeInTheDocument()
    expect(presentingIcon).not.toBeInTheDocument()
  })
})
