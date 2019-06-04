import React, { Component } from 'react';
import { Text, TouchableOpacity, View, ScrollView, ActivityIndicator, Image, Switch} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';
import {OstWalletSdk} from 'ost-wallet-sdk-react-native';

import styles from '../../Styles';
import AppData from '../../../app.json';
import OstWalletWorkflowCallback from '../../services/OstWalletSdkCallbackImplementation';
import DeviceMnemonicsCallbackImplementation from '../../services/DeviceMnemonicsCallbackImplementation';
import ActivateUserCallback from "../../services/ActivateUserCallbackImplementation";

let isInit = false;

class HomePage extends Component {
    constructor(props) {
        super(props);
        ['onActivateUser', 'onAddSession', 'onResetPin', 'onInitiateDeviceRecovery',
          'onExecuteTransaction', 'onAuthorizeCurrentDeviceWithMnemonics', 'onAbortDeviceRecovery',
          'onPerformQRAction', 'onGetAddDeviceQRCode', 'onGetAddDeviceQRCodeSuccess','revokeDevice'].forEach(
            (key) => (this[key] = this[key].bind(this))
        );
  
        
        if( !isInit ){
          isInit =  true ;
          this.initializeSetupDevice();
        }
        
        this.state = {
          qrCode : null,
          showQR : false,
          enableBiometric : false
        }
    }
  
   initializeSetupDevice() {
        this.props.dispatchLoadingState(true);
        OstWalletSdk.initialize('https://api.stagingost.com/testnet/v2', (err , success ) => {
            if( success ){
              console.warn("init success !");
              this.setupDevice();
            }
        });
        this.props.dispatchLoadingState(false);
    }

    setupDevice() {
        this.props.dispatchLoadingState(true);
        AsyncStorage.getItem('user').then((user) => {
            user = JSON.parse(user);
            OstWalletSdk.setupDevice(user.user_details.user_id, AppData.TOKEN_ID, new OstWalletWorkflowCallback(), console.warn);
        });
    }

    revokeDevice( deviceAddress ) {
      this.props.dispatchLoadingState(true);
      AsyncStorage.getItem('user').then((user) => {
        user = JSON.parse(user);
        OstWalletSdk.revokeDevice(user.user_details.user_id, deviceAddress, new OstWalletWorkflowCallback(), console.warn);
      });
    }

    updateBiometricPreference( value ) {
      this.setState({
        enableBiometric: value
      });
      AsyncStorage.getItem('user').then((user) => {
        user = JSON.parse(user);
        OstWalletSdk.updateBiometricPreference(user.user_details.user_id, value, new OstWalletWorkflowCallback(), console.warn);
      });
    }

    onActivateUser(pin) {
        this.props.dispatchLoadingState(true);
        AsyncStorage.getItem('user').then((user) => {
            user = JSON.parse(user);
            OstWalletSdk.activateUser(
                user.user_details.user_id,
                pin,
                user.user_pin_salt,
                86400,
                '1000000000000000000',
                new ActivateUserCallback(),
                console.warn
            );
        });
    }

    onGetDeviceMnemonics() {
        AsyncStorage.getItem('user').then((user) => {
            user = JSON.parse(user);
            OstWalletSdk.getDeviceMnemonics(user.user_details.user_id, new DeviceMnemonicsCallbackImplementation(), console.warn);
        });
    }

    onGetAddDeviceQRCode() {
        AsyncStorage.getItem('user').then((user) => {
            user = JSON.parse(user);
            OstWalletSdk.getAddDeviceQRCode(user.user_details.user_id, this.onGetAddDeviceQRCodeSuccess , console.warn);
        });
    }

    onGetAddDeviceQRCodeSuccess(res) {
      this.setState({
        qrCode : res,
        showQR : true
      });
    }

  resetShowQR() {
    this.setState({showQR : false})
  }

    onPerformQRAction( data ) {
      this.props.dispatchLoadingState(true);
        AsyncStorage.getItem('user').then((user) => {
            user = JSON.parse(user);
            OstWalletSdk.performQRAction(
                user.user_details.user_id,
                data,
                new OstWalletWorkflowCallback(),
                console.warn
            );
        });
    }

    onAbortDeviceRecovery( pin ) {
      this.props.dispatchLoadingState(true);
        AsyncStorage.getItem('user').then((user) => {
            user = JSON.parse(user);
            OstWalletSdk.abortDeviceRecovery(
                user.user_details.user_id,
                pin,
                user.user_pin_salt,
                new OstWalletWorkflowCallback(),
                console.warn
            );
        });
    }

    onLogoutAllSessions() {
        AsyncStorage.getItem('user').then((user) => {
            user = JSON.parse(user);
            OstWalletSdk.logoutAllSessions(user.user_details.user_id, new OstWalletWorkflowCallback(), console.warn);
        });
    }

    onInitiateDeviceRecovery(deviceAddr, pin) {
        this.props.dispatchLoadingState(true);
        AsyncStorage.getItem('user').then((user) => {
            user = JSON.parse(user);
            OstWalletSdk.initiateDeviceRecovery(
                user.user_details.user_id,
                pin,
                user.user_pin_salt,
                deviceAddr,
                new OstWalletWorkflowCallback(),
                console.warn
            );
        });
    }

    onResetPin(oldPin, newPin) {
        this.props.dispatchLoadingState(true);
        AsyncStorage.getItem('user').then((user) => {
            user = JSON.parse(user);
            OstWalletSdk.resetPin(
                user.user_details.user_id,
                user.user_pin_salt,
                oldPin,
                newPin,
                new OstWalletWorkflowCallback(),
                console.warn
            );
        });
    }

    onAuthorizeCurrentDeviceWithMnemonics( passphrase ) {
        AsyncStorage.getItem('user').then((user) => {
            user = JSON.parse(user);
            OstWalletSdk.authorizeCurrentDeviceWithMnemonics(
                user.user_details.user_id,
                passphrase,
                new OstWalletWorkflowCallback(),
                console.warn
            );
        });
    }

    onExecuteTransaction( addresses, amounts, ruleName) {
        if( ruleName ){
          ruleName =  ruleName.toLowerCase().trim();
        }
        this.props.dispatchLoadingState(true);
        let addressesList,
          amountsList;
        addressesList = addresses && addresses.split(",").map((item)=> item.trim());
        amountsList = amounts && amounts.split(",").map((item)=> item.trim());

          AsyncStorage.getItem('user').then((user) => {
            user = JSON.parse(user);
            OstWalletSdk.executeTransaction(
                user.user_details.user_id,
                addressesList,
                amountsList,
                ruleName,
                {"type":"user_to_user","name":"Sent to amulya1","details":"Received from preshita"},
                new OstWalletWorkflowCallback()
            );
          });
    }

    onAddSession(spendingLimit, expiryInDays) {
        this.props.dispatchLoadingState(true);
        AsyncStorage.getItem('user').then((user) => {
            user = JSON.parse(user);
            OstWalletSdk.addSession(
                user.user_details.user_id,
                Number(expiryInDays) * 86400,
              spendingLimit,
                new OstWalletWorkflowCallback(),
                console.warn
            );
        });
    }

    async userLogout() {
        try {
            await AsyncStorage.removeItem('user');
            Actions.Authentication();
        } catch (error) {
            console.log('AsyncStorage error: ' + error.message);
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({
            key: 'HomePage',
            onRight: this.userLogout,
            rightTitle: 'Log out'
        });
    }

    render() {
        if (this.props.isLoading)
            return (
                <View style={styles.scrollContainer}>
                    <Text style={{ marginBottom: 20 }}>Please wait while your device is being setup...</Text>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            );
        return (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.form}>
                    <TouchableOpacity
                        style={styles.buttonWrapper}
                        onPress={() => Actions.ActivateUser({ onActivateUser: this.onActivateUser })}
                    >
                        <Text style={styles.buttonText}>Activate User</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buttonWrapper}
                        onPress={() => Actions.CreateSession({ onAddSession: this.onAddSession })}
                    >
                        <Text style={styles.buttonText}>Add Session</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonWrapper}
                                      onPress={() => Actions.ExecuteTransaction({ onExecuteTransaction: this.onExecuteTransaction })}>
                        <Text style={styles.buttonText}>Execute Transaction</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonWrapper} onPress={() => this.onGetDeviceMnemonics()}>
                        <Text style={styles.buttonText}>Get Mnemonics</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buttonWrapper}
                        onPress={() => Actions.AuthorizeDevice({ onAuthorizeCurrentDeviceWithMnemonics: this.onAuthorizeCurrentDeviceWithMnemonics })}
                    >
                        <Text style={styles.buttonText}>Authorize Device With Mnemonics</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buttonWrapper}
                        onPress={() => Actions.ResetPin({ onResetPin: this.onResetPin })}
                    >
                        <Text style={styles.buttonText}>Reset Pin</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buttonWrapper}
                        onPress={() =>
                            Actions.DeviceRecovery({ onInitiateDeviceRecovery: this.onInitiateDeviceRecovery })
                        }
                    >
                        <Text style={styles.buttonText}>Device recovery</Text>
                    </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.buttonWrapper}
                    onPress={() =>
                      Actions.AbortDeviceRecovery({ onAbortDeviceRecovery: this.onAbortDeviceRecovery })
                    }
                  >
                    <Text style={styles.buttonText}>Abort Device recovery</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.buttonWrapper}
                    onPress={() =>
                      Actions.RevokeDevice({ revokeDevice: this.revokeDevice })
                    }
                  >
                    <Text style={styles.buttonText}>Revoke Device</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.buttonWrapper}
                    onPress={() =>
                      Actions.PerformQRAction({ onPerformQRAction: this.onPerformQRAction })
                    }
                  >
                    <Text style={styles.buttonText}>Perform QR Action</Text>
                  </TouchableOpacity>

                  {this.state.showQR && <View style={styles.container}>
                    <Image
                      style={styles.qrCode}
                      source={{uri: `data:image/png;base64,${this.state.qrCode}`}}
                    />
                    <TouchableOpacity
                      style={styles.buttonWrapper}
                      onPress={() => this.resetShowQR()}
                    >
                      <Text style={styles.buttonText}>Hide QR</Text>
                    </TouchableOpacity>
                  </View>
                  }
                  <TouchableOpacity
                    style={styles.buttonWrapper}
                    onPress={() =>this.onGetAddDeviceQRCode()}
                  >
                    <Text style={styles.buttonText}>Get Add Device QR Code</Text>
                  </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonWrapper} onPress={() => this.onLogoutAllSessions()}>
                        <Text style={styles.buttonText}>Logout All</Text>
                    </TouchableOpacity>

                  <View style = {styles.container}>
                    <Text>Update Biometric Preference</Text>
                    <Switch
                      value={this.state.enableBiometric}
                      onValueChange={(value) => this.updateBiometricPreference(value)}
                    />
                  </View>
                </View>
            </ScrollView>
        );
    }
}

export default HomePage;
