import React from 'react'
import { render, screen } from '@testing-library/react'
import { App } from './App'
import { type ConferenceConfig } from './types/ConferenceConfig'
import { ConferenceContextProvider } from './contexts/ConferenceContext/ConferenceContext'

const mockConfig: ConferenceConfig = {
  node: '',
  displayName: '',
  vmrPrefix: '',
  hostPin: ''
}

jest.mock('@pexip/infinity', () => {
  // const mockInfinity = { ...require('./__mocks__/infinity') }
  // setMockParticipants = mockInfinity.setMockParticipants
  // mockDisconnect = mockInfinity.mockDisconnect
  // mockDisconnectAll = mockInfinity.mockDisconnectAll
  // triggerParticipantLeft = mockInfinity.triggerParticipantLeft
  // return mockInfinity
}, { virtual: true })

jest.mock('./components/Conference/Conference', () => {
  const mock = (): JSX.Element => <div></div>
  mock.displayName = 'Mock'
  return mock
})

jest.mock('./components/JoinPanel/JoinPanel', () => {
  const JoinPanel = (): JSX.Element => <div></div>
  return { JoinPanel }
})

jest.mock('./components/Loading/Loading', () => {
  const Loading = (): JSX.Element => <div></div>
  return { Loading }
})

jest.mock('./components/ErrorPanel/ErrorPanel', () => {
  const ErrorPanel = (): JSX.Element => <div></div>
  return { ErrorPanel }
})

describe('App component', () => {
  it('should render', () => {
    render(
      <ConferenceContextProvider>
        <App config={mockConfig}/>
      </ConferenceContextProvider>
    )
    const app = screen.getByTestId('App')
    expect(app).toBeInTheDocument()
  })
})
