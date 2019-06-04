/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Router, Scene, ActionConst } from 'react-native-router-flux';
import {OstWalletSdkEvents, OstWalletSdk} from 'ost-wallet-sdk-react-native';

import Authentication from './src/components/authentication/Authentication';
import HomePage from './src/components/HomePage';
import ActivateUser from './src/components/ActivateUser';
import CreateSession from './src/components/CreateSession';
import ResetPin from './src/components/ResetPin';
import GetPin from './src/components/GetPin';
import DeviceRecovery from './src/components/DeviceRecovery';
import AbortDeviceRecovery from './src/components/AbortDeviceRecovery';
import ExecuteTransaction from './src/components/ExecuteTransaction';
import AuthorizeDevice from './src/components/AuthorizeDevice';
import PerformQRAction from "./src/components/PerformQRAction";
import RevokeDevice from "./src/components/RevokeDevice/RevokeDevice";

class App extends Component {
  constructor() {
    super();
    this.state = { hasUserId: false };
  }

  componentDidMount() {
    AsyncStorage.getItem('user').then((user) => {
      this.setState({ hasUserId: user !== null, isLoaded: true });
    });
    OstWalletSdkEvents.subscribeEvent();
  }

  componentWillUnmount() {
    OstWalletSdkEvents.unsubscribeEvent();
  }

  render() {
    return !this.state.isLoaded ? (
        <ActivityIndicator />
    ) : (
        <Router>
          <Scene key="root">
            <Scene
                component={Authentication}
                initial={!this.state.hasUserId}
                key="Authentication"
                title="Auth"
                type={ActionConst.RESET}
            />
            <Scene component={HomePage} initial={this.state.hasUserId} key="HomePage" type={ActionConst.RESET} title="Home Page" />
            <Scene component={ActivateUser} key="ActivateUser" title="Activate User" />
            <Scene component={CreateSession} key="CreateSession" title="Create Session" />
            <Scene component={ResetPin} key="ResetPin" title="Reset Pin" />
            <Scene component={DeviceRecovery} key="DeviceRecovery" title="Device Recovery" />
            <Scene component={AbortDeviceRecovery} key="AbortDeviceRecovery" title="Abort Device Recovery" />
            <Scene component={GetPin} key="GetPin" title="Enter Pin" backTitle="temp"/>
            <Scene component={ExecuteTransaction} key="ExecuteTransaction" title="Execute Transaction" />
            <Scene component={PerformQRAction} key="PerformQRAction" title="Perform QR Action" />
            <Scene component={AuthorizeDevice} key="AuthorizeDevice" title="Authorize Device with Mneumonics" />
            <Scene component={RevokeDevice} key="RevokeDevice" title="Revoke Device" />
          </Scene>
        </Router>
    );
  }
}

export default App;
