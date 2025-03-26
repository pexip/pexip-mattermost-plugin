import React from 'react'

import './ToggleEnable.scss'

interface FilterChannelsProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
}

export const ToggleEnable = (props: FilterChannelsProps): JSX.Element => {
  const { enabled, onChange } = props
  return (
    <div className='ToggleEnable'>
      <label>
        <input
          type='radio'
          name='PluginSettings.Plugins.com+pexip+pexip-app.FilterChannels'
          value='true'
          checked={enabled}
          onChange={() => {
            onChange(true)
          }}
        />
        <span>True</span>
      </label>

      <label>
        <input
          type='radio'
          id='disable'
          name='PluginSettings.Plugins.com+pexip+pexip-app.FilterChannels'
          value='false'
          checked={!enabled}
          onChange={() => {
            onChange(false)
          }}
        />
        <span>False</span>
      </label>
    </div>
  )
}
