import React from 'react'
// import { render, screen } from '@testing-library/react'
// import { App } from './App'

// jest.mock('./services/conference-manager', () => ({
//   ConferenceManager: {
//     connectionState$: {
//       subscribe: () => ({
//         unsubscribe: jest.fn()
//       })
//     }
//   },
//   ConnectionState: jest.fn()
// }))

jest.mock('./components/Conference/Conference', () => {
  const mock = (): JSX.Element => <div></div>
  mock.displayName = 'Mock'
  return mock
})

jest.mock('./components/JoinPanel/JoinPanel', () => {
  const mock = (): JSX.Element => <div></div>
  mock.displayName = 'Mock'
  return mock
})

jest.mock('./components/Loading/Loading', () => {
  const mock = (): JSX.Element => <div></div>
  mock.displayName = 'Mock'
  return mock
})

jest.mock('./components/ErrorPanel/ErrorPanel', () => {
  const mock = (): JSX.Element => <div></div>
  mock.displayName = 'Mock'
  return mock
})

describe('App component', () => {
  it('should render', () => {
    // render(<App />)
    // const app = screen.getByTestId('App')
    // expect(app).toBeInTheDocument()
  })
})
