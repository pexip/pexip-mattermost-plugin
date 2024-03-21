import React from 'react'

import { CustomTooltip, type ExtendedTooltipPosition } from '@pexip/components'

import './Tooltip.scss'

interface TooltipProps {
  text: string
  position?: ExtendedTooltipPosition
  className?: string
  children: JSX.Element
}

export const Tooltip = (props: TooltipProps): JSX.Element => {
  const position = props.position ?? 'topCenter'
  return (
    <div className={props.className}>
      <CustomTooltip className='Tooltip' content={props.text} isArrowShown position={position}>{props.children}</CustomTooltip>
    </div>
  )
}
