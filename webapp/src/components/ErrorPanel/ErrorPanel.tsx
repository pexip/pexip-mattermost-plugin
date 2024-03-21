import React from 'react'

import './ErrorPanel.scss'
import { useConferenceContext } from 'src/contexts/ConferenceContext/ConferenceContext'

const ErrorPanel = (): JSX.Element => {
  const { state, disconnect } = useConferenceContext()
  return (
    <div className="ErrorPanel">
      <p>{state.errorMessage}</p>
      <button onClick={() => { disconnect().catch((e) => { console.error(e) }) }}>Go back</button>
    </div>
  )
}

export { ErrorPanel }
