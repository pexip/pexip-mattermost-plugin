import React from 'react'
import { ConferenceContextProvider, useConferenceContext } from './ConferenceContext'
import { render, screen } from '@testing-library/react'

// TODO: Create mockups
jest.mock('@pexip/infinity', () => {}, { virtual: true })

const ConferenceContextTester = (): JSX.Element => {
  const { state } = useConferenceContext()

  return (
    <div data-testid='ConferenceContextTester'>
      <span data-testid='ConnectionState'>{state.connectionState}</span>
    </div>
  )
}

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

    })
  })

  describe('connect', () => {

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
