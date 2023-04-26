import React from "react";

interface ErrorPanelProps {
  message: string;
}

const ErrorPanel = (props: ErrorPanelProps) => {
  return (
    <div className="ErrorPanel">
      <div>{ props.message }</div>
      <button onClick={() => {}}>Retry</button>
    </div>
  )
}

export default ErrorPanel;
