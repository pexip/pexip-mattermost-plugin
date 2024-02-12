import React, { useEffect } from 'react'

import type { ConferenceConfig } from './types/ConferenceConfig'
import { useConferenceContext } from './contexts/ConferenceContext/ConferenceContext'
import { ConnectionState } from './types/ConnectionState'
import { JoinPanel } from './components/JoinPanel/JoinPanel'
import { Conference } from './components/Conference/Conference'
import { Loading } from './components/Loading/Loading'
import { ErrorPanel } from './components/ErrorPanel/ErrorPanel'

import './App.scss'

interface AppProps {
  config: ConferenceConfig
}

export const App = (props: AppProps): JSX.Element => {
  const { state } = useConferenceContext()

  useEffect(() => {
    console.log('App launched')
  }, [])

  let component
  switch (state.connectionState) {
    case ConnectionState.Disconnected:
      component = <JoinPanel />
      break
    case ConnectionState.Connected:
      component = <Conference />
      break
    case ConnectionState.Connecting:
      component = <Loading />
      break
    case ConnectionState.Error:
      component = (
        <ErrorPanel
          message={'Error'}
          onGoBack={() => { console.error('Changing to disconnected') }} />
      )
      break
  }

  return (
    <div className='App' data-testid='App'>
      {component}
    </div>
  )
}

// export class App extends Component<any, AppState> {
//   private connectionSubscription: Subscription

//   constructor (props: any) {
//     super(props)
//     this.state = {
//       connectionState: ConnectionState.Disconnected
//     }
//   }

//   componentDidMount (): void {
//     this.connectionSubscription = ConferenceManager.connectionState$.subscribe((connectionState) => {
//       if (connectionState === ConnectionState.Connected) {
//         const mattermostState = MattermostManager.getStore().getState()
//         const channel = ConferenceManager.getChannel()
//         notifyJoinConference(mattermostState, channel.id).catch((error) => {
//           console.error(error)
//         })
//       }
//       this.setState({ connectionState })
//     })
//   }

//   componentWillUnmount (): void {
//     this.connectionSubscription.unsubscribe()
//   }

//   render (): JSX.Element {
//     let component
//     switch (this.state.connectionState) {
//       case ConnectionState.Disconnected:
//         component = <JoinPanel />
//         break
//       case ConnectionState.Connected:
//         component = <Conference />
//         break
//       case ConnectionState.Connecting:
//         component = <Loading />
//         break
//       case ConnectionState.Error:
//         component = <ErrorPanel
//           message={ConferenceManager.getError()}
//           onGoBack={() => { this.setState({ connectionState: ConnectionState.Disconnected }) }} />
//         break
//     }
//     return (
//       <div className='App' data-testid='App'>
//         {component}
//       </div>
//     )
//   }
// }
