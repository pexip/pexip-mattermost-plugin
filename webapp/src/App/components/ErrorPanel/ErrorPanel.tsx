import React from 'react'
import { useConferenceContext } from '../../contexts/ConferenceContext/ConferenceContext'

import './ErrorPanel.scss'

const ErrorPanel = (): JSX.Element => {
  const { state, disconnect } = useConferenceContext()
  return (
    <div className='ErrorPanel'>
      <p>{state.errorMessage}</p>
      <button
        onClick={() => {
          disconnect().catch((e) => {
            console.error(e)
          })
        }}
      >
        Go back
      </button>
    </div>
  )
}

export { ErrorPanel }
