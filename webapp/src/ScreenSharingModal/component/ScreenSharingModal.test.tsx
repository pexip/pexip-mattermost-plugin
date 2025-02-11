import React from 'react'
import { render, screen } from '@testing-library/react'
import { ScreenSharingModal } from './ScreenSharingModal'

jest.mock('@pexip/components', () => ({
  Icon: () => <div></div>,
  IconTypes: {
    close: 'close'
  }
}))
;(window as any).desktopAPI = {
  getDesktopSources: jest.fn().mockResolvedValue([])
}

describe('ScreenSharingModal', () => {
  it('should render', () => {
    render(<ScreenSharingModal show={true} onHide={() => undefined} onShare={() => undefined} />)
    const modal = screen.getByTestId('ScreenSharingModal')
    expect(modal).toBeInTheDocument()
  })

  it('should not render if show is false', () => {
    render(<ScreenSharingModal show={false} onHide={() => undefined} onShare={() => undefined} />)
    const modal = screen.queryByTestId('ScreenSharingModal')
    expect(modal).toBeNull()
  })

  it('should call onHide when close button is clicked', () => {
    const onHide = jest.fn()
    render(<ScreenSharingModal show={true} onHide={onHide} onShare={() => undefined} />)
    const button = screen.getByTestId('ScreenSharingModalClose')
    button.click()
    expect(onHide).toHaveBeenCalledTimes(1)
  })

  it('should call onHide when cancel button is clicked', () => {
    const onHide = jest.fn()
    render(<ScreenSharingModal show={true} onHide={onHide} onShare={() => undefined} />)
    const button = screen.getByTestId('ScreenSharingModalCancel')
    button.click()
    expect(onHide).toHaveBeenCalledTimes(1)
  })

  it('should call onHide when the modal parent is clicked', () => {
    const onHide = jest.fn()
    render(<ScreenSharingModal show={true} onHide={onHide} onShare={() => undefined} />)
    const parent = screen.getByTestId('ScreenSharingModal')
    parent.click()
    expect(onHide).toHaveBeenCalledTimes(1)
  })

  it('should not call onHide when the modal is clicked', () => {
    const onHide = jest.fn()
    render(<ScreenSharingModal show={true} onHide={onHide} onShare={() => undefined} />)
    const modal = screen.getByTestId('ScreenSharingModalInner')
    modal.click()
    expect(onHide).not.toHaveBeenCalled()
  })

  it('should call onShare with selected source when share button is clicked', () => {
    const onShare = jest.fn()
    render(<ScreenSharingModal show={true} onHide={() => undefined} onShare={onShare} />)
    const button = screen.getByTestId('ScreenSharingModalShare')
    button.click()
    expect(onShare).toHaveBeenCalled()
  })
})
