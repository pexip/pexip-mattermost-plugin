import React from "react";

import './ErrorPanel.scss';
import { ConferenceManager } from "../services/conference-manager";

interface ErrorPanelProps {
  message: string;
  onGoBack: () => void;
}

const ErrorPanel = (props: ErrorPanelProps) => {
  return (
    <div className="ErrorPanel">
      <p>{props.message}</p>
      <button onClick={props.onGoBack}>Go back</button>
    </div>
  )
}

export default ErrorPanel;
