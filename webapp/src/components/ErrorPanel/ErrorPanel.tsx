import React from 'react'

import './ErrorPanel.scss'

interface ErrorPanelProps {
  message: string
  onGoBack: () => void
}

const ErrorPanel = (props: ErrorPanelProps): JSX.Element => {
  return (
    <div className="ErrorPanel">
      <p>{props.message}</p>
      <button onClick={props.onGoBack}>Go back</button>
    </div>
  )
}

export { ErrorPanel }
