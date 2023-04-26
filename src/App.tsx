import React, { Component } from 'react';
import { Conference } from './Conference/Conference';
import { ConferenceManager, ConnectionState } from './services/conference-manager';
import JoinPanel from './JoinButton/JoinPanel';
import Loading from './Loading/Loading';
import ErrorPanel from './ErrorPanel/ErrorPanel';
import { Subscription } from 'rxjs';

import './App.scss';

interface AppState {
  connectionState: ConnectionState
}

export class App extends Component<any, AppState> {

  private connectionSubscription: Subscription;
  private error = '';

  constructor(props: any) {
    super(props);
    console.log(props);
    this.state = {
      connectionState: ConnectionState.Disconnected
    }
  }

  componentDidMount(): void {
    this.connectionSubscription = ConferenceManager.connectionState$.subscribe((connectionState) => {
      this.setState({connectionState: connectionState});
    });
  }

  componentWillUnmount(): void {
    this.connectionSubscription.unsubscribe();
  }

  render () {
    let component;
    switch (this.state.connectionState) {
      case ConnectionState.Disconnected:
        component =  <JoinPanel />;
        break;
      case ConnectionState.Connected:
        component = <Conference />;
        break;
      case ConnectionState.Connecting:
        component = <Loading />
        break;
      case ConnectionState.Error:
        component =  <ErrorPanel message={this.error} />
        break;
    }
    return (
      <div className='App'>
        {component}
      </div>
    )
  }
}
