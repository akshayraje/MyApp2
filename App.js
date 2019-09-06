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

const OST_PLATFROM_ENDPOINT = 'https://api.stagingost.com/testnet/v2';

// OstWalletSdk Imports
import {OstWalletSdkEvents, OstWalletSdk} from '@ostdotcom/ost-wallet-sdk-react-native';
import ost_wallet_sdk_config from "./src/configs/ost_wallet_sdk_config";


class App extends Component {
  constructor() {
    super();
    this.state = { hasUserId: false };
    console.log("ost_wallet_sdk_config", ost_wallet_sdk_config);
    OstWalletSdk.initialize(OST_PLATFROM_ENDPOINT, ost_wallet_sdk_config, (err , success ) => {
      if ( err ) {
        console.log("OstWalletSdk.initialize err", err);
        // Most likely config is invalid.
        // Crash the app for dev purposes.
        throw err;
      }
      console.log("OstWalletSdk has been initialized.");
    });
  }

  componentDidMount() {
    OstWalletSdkEvents.subscribeEvent();

    console.log("OstWalletSdkEvents has been subscribed.");
    AsyncStorage.getItem('user').then((user) => {
      this.setState({ hasUserId: user !== null, isLoaded: true });
    });
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
