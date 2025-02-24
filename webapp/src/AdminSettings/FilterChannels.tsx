import React from 'react'
import { Box, Button, Checkbox, Divider, List, ListLink, TextHeading } from '@pexip/components'

import './FilterChannels.scss'

// https://mui.com/material-ui/react-transfer-list/
export const FilterChannels = (): JSX.Element => {
  const [enabled, setEnabled] = React.useState(false)

  const channelSelector = (
    <div className='ChannelSelector'>
      <Box className='ChannelSelectorList'>
        <div className='ChannelSelectorHeader'>
          <Checkbox label='' name='' />
          <div>
            <TextHeading htmlTag='h3'>Allowed Channels</TextHeading>
            <span>0/3 selected</span>
          </div>
        </div>
        <Divider />
        <List>
          <ListLink>
            <Checkbox label={'Channel 1'} name={''} />
          </ListLink>
          <ListLink>
            <Checkbox label={'Channel 1'} name={''} />
          </ListLink>
          <ListLink>
            <Checkbox label={'Channel 1'} name={''} />
          </ListLink>
        </List>
      </Box>
      <div className='ChannelSelectorButtons'>
        <Button aria-label='move selected right' variant='secondary'>
          &gt;
        </Button>
        <Button aria-label='move select left' variant='secondary'>
          &lt;
        </Button>
      </div>
      <Box className='ChannelSelectorList'>
        <div className='ChannelSelectorHeader'>
          <Checkbox label='' name='' />
          <div>
            <TextHeading htmlTag='h3'>Disallowed Channels</TextHeading>
            <span>0/3 selected</span>
          </div>
        </div>
        <Divider />
        <List>
          <ListLink>
            <Checkbox label={'Channel 1'} name={''} />
          </ListLink>
          <ListLink>
            <Checkbox label={'Channel 1'} name={''} />
          </ListLink>
          <ListLink>
            <Checkbox label={'Channel 1'} name={''} />
          </ListLink>
        </List>
      </Box>
    </div>
  )

  return (
    <div className='FilterChannels'>
      <div className='EnableFilter'>
        <label>
          <input
            type='radio'
            name='PluginSettings.Plugins.com+pexip+pexip-app.FilterChannels'
            value='true'
            checked={enabled}
            onChange={() => {
              setEnabled(true)
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
              setEnabled(false)
            }}
          />
          <span>False</span>
        </label>
      </div>

      {enabled && channelSelector}
    </div>
  )
}

// import React from 'react'
// import PropTypes from 'prop-types'

// export default class SecretMessageSetting extends React.PureComponent {
//   static propTypes = {
//     id: PropTypes.string.isRequired,
//     label: PropTypes.string.isRequired,
//     helpText: PropTypes.node,
//     value: PropTypes.any,
//     disabled: PropTypes.bool.isRequired,
//     config: PropTypes.object.isRequired,
//     license: PropTypes.object.isRequired,
//     setByEnv: PropTypes.bool.isRequired,
//     onChange: PropTypes.func.isRequired,
//     registerSaveAction: PropTypes.func.isRequired,
//     setSaveNeeded: PropTypes.func.isRequired,
//     unRegisterSaveAction: PropTypes.func.isRequired
//   }

//   constructor(props: any) {
//     // eslint-disable-next-line @typescript-eslint/ban-types
//     super(props as {})

//     this.state = {
//       showSecretMessage: false
//     }
//   }

//   // componentDidMount(): void {
//   //   this.props.registerSaveAction(this.handleSave)
//   // }

//   // componentWillUnmount(): void {
//   //   this.props.unRegisterSaveAction(this.handleSave)
//   // }

//   // handleSave = async () => {
//   //   this.setState({
//   //     error: ''
//   //   })

//   //   let error
//   //   return { error }
//   // }

//   // showSecretMessage = () => {
//   //   this.setState({
//   //     showSecretMessage: true
//   //   })
//   // }

//   toggleSecretMessage = (e: any): void => {
//     e.preventDefault()

//     // this.setState({
//     //   showSecretMessage: !this.state.showSecretMessage
//     // })
//   }

//   // handleChange = (e): void => {
//   //   this.props.onChange(this.props.id, e.target.value)
//   // }

//   render(): JSX.Element {
//     return (
//       <React.Fragment>
//         {/* {this.state.showSecretMessage &&
//                     <textarea
//                         style={style.input}
//                         className='form-control input'
//                         rows={5}
//                         value={this.props.value}
//                         disabled={this.props.disabled || this.props.setByEnv}
//                         onInput={this.handleChange}
//                     />
//                 } */}
//         <div>
//           {/* <button className='btn btn-default' onClick={this.toggleSecretMessage} disabled={this.props.disabled}> */}
//           <button className='btn btn-default' onClick={this.toggleSecretMessage}>
//             Hide Secret Message
//             {/* {this.state.showSecretMessage && 'Hide Secret Message'}
//             {!this.state.showSecretMessage && 'Show Secret Message'} */}
//           </button>
//         </div>
//       </React.Fragment>
//     )
//   }
// }

// const style = {
//   input: {
//     marginBottom: '5px'
//   }
// }
