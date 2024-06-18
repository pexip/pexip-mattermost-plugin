import React from 'react'
import { render, screen } from '@testing-library/react'
import { App } from './App'
import { type ConferenceConfig } from './types/ConferenceConfig'
import { ConferenceContextProvider } from './contexts/ConferenceContext/ConferenceContext'

const mockConfig: ConferenceConfig = {
  node: 'my-server.com',
  displayName: 'User',
  vmrPrefix: 'matt-',
  hostPin: '0000'
}

Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  }
})

jest.mock('@pexip/infinity', () => {}, { virtual: true })
jest.mock('@pexip/media-processor', () => ({}), { virtual: true })

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
        <App config={mockConfig} />
      </ConferenceContextProvider>
    )
    const app = screen.getByTestId('App')
    expect(app).toBeInTheDocument()
  })
})
