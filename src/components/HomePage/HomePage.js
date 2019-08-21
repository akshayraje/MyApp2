import React, { Component } from 'react';
import { Text, TouchableOpacity, View, ScrollView, ActivityIndicator, Image, Switch} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';
import {OstWalletSdk, OstWalletSdkUI} from '@ostdotcom/ost-wallet-sdk-react-native';

import styles from '../../Styles';
import AppData from '../../../app.json';
import OstWalletWorkflowCallback from '../../services/OstWalletSdkCallbackImplementation';
import OstWalletSdkUICallbackImplementation from '../../services/OstWalletSdkUICallbackImplementation';
import DeviceMnemonicsCallbackImplementation from '../../services/DeviceMnemonicsCallbackImplementation';
import ActivateUserCallback from "../../services/ActivateUserCallbackImplementation";
import WorkflowStatusModel from "../WorkflowStatus";
import GetMethodsModel from "../GetMethodsModel";
import content_config from "./custom_content_config";
import theme_config from "./custom_theme_config";
const Logo = require("../../assets/ostLogoBlue.png");

const useCustomThemeConfig = true;
const useCustomContentConfig = true;

class HomePage extends Component {
    constructor(props) {
        super(props);
        ['onAddSession', 'onResetPin', 'onInitiateDeviceRecovery',
          'onExecuteTransaction', 'onAuthorizeCurrentDeviceWithMnemonics', 'onAbortDeviceRecovery',
          'onPerformQRAction', 'onGetAddDeviceQRCode', 'onGetAddDeviceQRCodeSuccess','revokeDevice'].forEach(
            (key) => (this[key] = this[key].bind(this))
        );

        this.state = {
          qrCode : null,
          showQR : false,
          enableBiometric : false
        };
        this.wsModel = null;
    }



   initializeSetupDevice() {    
        this.props.dispatchLoadingState(true);
        useCustomThemeConfig && OstWalletSdkUI.setThemeConfig(theme_config);
        useCustomContentConfig && OstWalletSdkUI.setContentConfig(content_config);
        OstWalletSdk.initialize('https://api.stagingost.com/testnet/v2', (err , success ) => {
            console.log(err , success);
            if( success ){
              this.setupDevice();

              AsyncStorage.getItem('user').then((user) => {
                user = JSON.parse(user);
                OstWalletSdk.isBiometricEnabled(user.user_details.user_id, (isEnabled) => {
                  this.setState({
                    enableBiometric: isEnabled
                  }, () => {
                    this.props.dispatchLoadingState(false);
                  });
                });
              });
            }
            
        });
    }

    setupDevice() {
      this.props.dispatchLoadingState(true);
      AsyncStorage.getItem('user').then((user) => {
        user = JSON.parse(user);
        OstWalletSdk.setupDevice(user.user_details.user_id, AppData.TOKEN_ID, new OstWalletWorkflowCallback(), console.warn);
      });
    }

    revokeDevice(  ) {
      // this.props.dispatchLoadingState(true);
      // AsyncStorage.getItem('user').then((user) => {
      //   user = JSON.parse(user);
      //   OstWalletSdk.revokeDevice(user.user_details.user_id, deviceAddress, new OstWalletWorkflowCallback(), console.warn);
      // });

      let delegate = new OstWalletSdkUICallbackImplementation( this.wsModel );
      AsyncStorage.getItem('user').then((user) => {
        user = JSON.parse(user);

        let workflowId = OstWalletSdkUI.revokeDevice(
          user.user_details.user_id,
          null,
          delegate
        );
        delegate.setWorkflowInfo(workflowId, "revokeDevice User");
        console.log("OstWalletSdkUI.revokeDevice workflowId:", workflowId);
      });
    }

    updateBiometricPreference( value ) {
      this.setState({
        enableBiometric: value
      });
      AsyncStorage.getItem('user').then((user) => {
        user = JSON.parse(user);
        let delegate = new OstWalletSdkUICallbackImplementation( this.wsModel );
        let workflowId =  OstWalletSdkUI.updateBiometricPreference(user.user_details.user_id, value, delegate);
        delegate.setWorkflowInfo(workflowId, "update Biometric Preference");
        console.log("OstWalletSdkUI.updateBiometricPreference workflowId:", workflowId);

        // OstWalletSdk.updateBiometricPreference(user.user_details.user_id, value, new OstWalletWorkflowCallback(), console.warn);
      });
    }

    OnActivateUserPress() {
      // this.props.dispatchLoadingState(true);
      let delegate = new OstWalletSdkUICallbackImplementation( this.wsModel );
      AsyncStorage.getItem('user').then((user) => {
        user = JSON.parse(user);

        let workflowId = OstWalletSdkUI.activateUser(
          user.user_details.user_id,
          86400,
          '1000000000000000000',
          delegate
        );
        delegate.setWorkflowInfo(workflowId, "Activate User");
        console.log("OstWalletSdkUI.activateUser workflowId:", workflowId);
      });



    }

    // onActivateUser(pin) {
    //     this.props.dispatchLoadingState(true);
    //     AsyncStorage.getItem('user').then((user) => {
    //         user = JSON.parse(user);
    //         OstWalletSdk.activateUser(
    //             user.user_details.user_id,
    //             pin,
    //             user.user_pin_salt,
    //             86400,
    //             '1000000000000000000',
    //             new ActivateUserCallback(),
    //             console.warn
    //         );
    //     });
    // }

    onGetDeviceMnemonics() {
      let delegate = new OstWalletSdkUICallbackImplementation( this.wsModel );
      AsyncStorage.getItem('user').then((user) => {
        user = JSON.parse(user);

        let workflowId = OstWalletSdkUI.getDeviceMnemonics(
          user.user_details.user_id,
          delegate
        );
        delegate.setWorkflowInfo(workflowId, "Activate User");
        console.log("OstWalletSdkUI.activateUser workflowId:", workflowId);
      });
    }

    onGetAddDeviceQRCode() {
      let delegate = new OstWalletSdkUICallbackImplementation( this.wsModel );
        AsyncStorage.getItem('user').then((user) => {
            user = JSON.parse(user);
          let workflowId = OstWalletSdkUI.getAddDeviceQRCode(
              user.user_details.user_id,
              delegate
            );
          delegate.setWorkflowInfo(workflowId, "onGetAddDeviceQRCode");
          console.log("OstWalletSdkUI.onGetAddDeviceQRCode workflowId:", workflowId);
            // OstWalletSdk.getAddDeviceQRCode(user.user_details.user_id, this.onGetAddDeviceQRCodeSuccess , console.warn);
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

  onAbortDeviceRecovery() {
    AsyncStorage.getItem('user').then((user) => {
      user = JSON.parse(user);

      let delegate = new OstWalletSdkUICallbackImplementation( this.wsModel );
      let workflowId = OstWalletSdkUI.abortDeviceRecovery(
        user.user_details.user_id,
        delegate
      );
      delegate.setWorkflowInfo(workflowId, "Abort Recovery");
      console.log("OstWalletSdkUI.abortDeviceRecovery workflowId:", workflowId);
    });
  }

    // onAbortDeviceRecovery( pin ) {
    //   this.props.dispatchLoadingState(true);
    //     AsyncStorage.getItem('user').then((user) => {
    //         user = JSON.parse(user);
    //         OstWalletSdk.abortDeviceRecovery(
    //             user.user_details.user_id,
    //             pin,
    //             user.user_pin_salt,
    //             new OstWalletWorkflowCallback(),
    //             console.warn
    //         );
    //     });
    // }

    onLogoutAllSessions() {
        AsyncStorage.getItem('user').then((user) => {
            user = JSON.parse(user);
            OstWalletSdk.logoutAllSessions(user.user_details.user_id, new OstWalletWorkflowCallback(), console.warn);
        });
    }

    onInitiateDeviceRecovery() {
      AsyncStorage.getItem('user').then((user) => {
        user = JSON.parse(user);

        let delegate = new OstWalletSdkUICallbackImplementation( this.wsModel );
        let workflowId = OstWalletSdkUI.initiateDeviceRecovery(
          user.user_details.user_id,
          null,
          delegate
        );
        delegate.setWorkflowInfo(workflowId, "Initiate Device Recovery");
        console.log("OstWalletSdkUI.initiateDeviceRecovery workflowId:", workflowId);
      });
    }

    // onInitiateDeviceRecovery(deviceAddr, pin) {
    //     this.props.dispatchLoadingState(true);
    //     AsyncStorage.getItem('user').then((user) => {
    //         user = JSON.parse(user);
    //         OstWalletSdk.initiateDeviceRecovery(
    //             user.user_details.user_id,
    //             pin,
    //             user.user_pin_salt,
    //             deviceAddr,
    //             new OstWalletWorkflowCallback(),
    //             console.warn
    //         );
    //     });
    // }


  onResetPin() {
    AsyncStorage.getItem('user').then((user) => {
      user = JSON.parse(user);

      let delegate = new OstWalletSdkUICallbackImplementation( this.wsModel );
      let workflowId = OstWalletSdkUI.resetPin(
        user.user_details.user_id,
        delegate
      );
      delegate.setWorkflowInfo(workflowId, "resetPin");
      console.log("OstWalletSdkUI.resetPin workflowId:", workflowId);
    });
  }
    // onResetPin(oldPin, newPin) {
    //     this.props.dispatchLoadingState(true);
    //     AsyncStorage.getItem('user').then((user) => {
    //         user = JSON.parse(user);
    //         OstWalletSdk.resetPin(
    //             user.user_details.user_id,
    //             user.user_pin_salt,
    //             oldPin,
    //             newPin,
    //             new OstWalletWorkflowCallback(),
    //             console.warn
    //         );
    //     });
    // }

    onAuthorizeCurrentDeviceWithMnemonics() {
      AsyncStorage.getItem('user').then((user) => {
        user = JSON.parse(user);

        let delegate = new OstWalletSdkUICallbackImplementation( this.wsModel );
        let workflowId = OstWalletSdkUI.authorizeCurrentDeviceWithMnemonics(
          user.user_details.user_id,
          delegate
        );
        delegate.setWorkflowInfo(workflowId, "onAuthorizeCurrentDeviceWithMnemonics");
        console.log("OstWalletSdkUI.onAuthorizeCurrentDeviceWithMnemonics workflowId:", workflowId);
      });
}

    // onAuthorizeCurrentDeviceWithMnemonics( passphrase ) {
    //     AsyncStorage.getItem('user').then((user) => {
    //         user = JSON.parse(user);
    //         OstWalletSdk.authorizeCurrentDeviceWithMnemonics(
    //             user.user_details.user_id,
    //             passphrase,
    //             new OstWalletWorkflowCallback(),
    //             console.warn
    //         );
    //     });
    // }

    onExecuteTransaction( addresses, amounts, ruleName, currencyCode) {
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
                new OstWalletWorkflowCallback(),
                {
                    wait_for_finalization: true,
                    currency_code: currencyCode
                }
            );
          });
    }

    onAddSession(spendingLimit, expiryInDays) {
        AsyncStorage.getItem('user').then((user) => {
            user = JSON.parse(user);

          let delegate = new OstWalletSdkUICallbackImplementation( this.wsModel );
          let workflowId = OstWalletSdkUI.addSession(
            user.user_details.user_id,
            Number(expiryInDays) * 86400,
            spendingLimit,
            delegate
          );
          delegate.setWorkflowInfo(workflowId, "Add session");
          console.log("OstWalletSdkUI.addSession workflowId:", workflowId);
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
        this.props.dispatchLoadingState(true);
        this.props.navigation.setParams({
            key: 'HomePage',
            onRight: this.userLogout,
            rightTitle: 'Log out'
        });
        AsyncStorage.getItem('user').then((user) => { 
          if ( this.isUnMounted || !user ) {
            return;
          }
          if ( typeof user === 'string' ) {
            user = JSON.parse(user);  
          }
          user && user.user_details && this.setState({
            userId: user.user_details.user_id
          }, () => {
            this.initializeSetupDevice();
          })
        });
    }

    componentWillUnmount() {
      this.isUnMounted = true;
    }



    OnCompoentSheetPress() {
      useCustomThemeConfig && OstWalletSdkUI.setThemeConfig(theme_config);
      OstWalletSdkUI.showComponentSheet();
    }

    onTestGetterMethods() {
      if ( this.getMethodsModel ) {
        this.getMethodsModel.showModal();
      }
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
                      style={styles.buttonInfoWrapper}
                      onPress={() =>
                        this.OnCompoentSheetPress()
                      }
                    >
                      <Text style={styles.buttonText}>Component Sheet</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonInfoWrapper} onPress={() => this.onTestGetterMethods()}>
                        <Text style={styles.buttonText}>Test Getter Methods</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buttonWrapper}
                        onPress={() =>
                          this.OnActivateUserPress()
                        }
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
                        onPress={() =>
                          this.onAuthorizeCurrentDeviceWithMnemonics() }
                    >
                        <Text style={styles.buttonText}>Authorize Device With Mnemonics</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buttonWrapper}
                        onPress={() =>
                          this.onResetPin()
                        }
                    >
                        <Text style={styles.buttonText}>Reset Pin</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buttonWrapper}
                        onPress={() =>
                            this.onInitiateDeviceRecovery()
                        }
                    >
                        <Text style={styles.buttonText}>Device recovery</Text>
                    </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.buttonWrapper}
                    onPress={() =>
                       this.onAbortDeviceRecovery()
                    }
                  >
                    <Text style={styles.buttonText}>Abort Device recovery</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.buttonWrapper}
                    onPress={() =>
                      this.revokeDevice()
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
              <WorkflowStatusModel ref={(wsModel) => {
                this.wsModel = wsModel;
              }}></WorkflowStatusModel>

              <GetMethodsModel userId={this.state.userId} ref={( gmm ) => {
                this.getMethodsModel = gmm;
              }}></GetMethodsModel>
            </ScrollView>
        );
    }
}

export default HomePage;
