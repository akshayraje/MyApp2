import React, { Component } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, ScrollView, ActivityIndicator, Image, Switch} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';

import styles from '../../Styles';
import AppData from '../../../app.json';
import OstWalletWorkflowCallback from '../../services/OstWalletSdkCallbackImplementation';
import OstWalletSdkUICallbackImplementation from '../../services/OstWalletSdkUICallbackImplementation';
import DeviceMnemonicsCallbackImplementation from '../../services/DeviceMnemonicsCallbackImplementation';
import ActivateUserCallback from "../../services/ActivateUserCallbackImplementation";
import WorkflowStatusModel from "../WorkflowStatus";
import GetMethodsModel from "../GetMethodsModel";
import JSONMethodsModel from "../JSONMethodsModel";

import content_config from "./custom_content_config";
import theme_config from "./custom_theme_config";
const Logo = require("../../assets/ostLogoBlue.png");
import ost_wallet_sdk_config from "./OstWalletSdkConfig";
const useCustomThemeConfig = false;
const useCustomContentConfig = false;


import {OstWalletSdk, OstWalletSdkUI} from '@ostdotcom/ost-wallet-sdk-react-native';
import SetupDeviceCallback from '../../workflowCallbacks/SetupDeviceCallback';
import BaseUIWorkflowCallback from '../../workflowCallbacks/BaseUIWorkflowCallback';
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

    componentDidMount() {
        // Log-out button.
        this.props.navigation.setParams({
            key: 'HomePage',
            onRight: this.userLogout,
            rightTitle: 'Log out'
        });

        // Show a loader
        this.props.dispatchLoadingState(true);
        AsyncStorage.getItem('user').then((user) => {
          if ( this.isUnMounted || !user ) {
            return;
          }
          user = JSON.parse(user);
          let ostUserId = user.user_details.user_id;
          this.setState({
            userId: ostUserId
          }, () => {
            this.setupDevice(ostUserId);
          });
        });
    }

    setupDevice(ostUserId) {
      let getDisplayModel = () => {
        return this.wsModel;
      };

      // Create the callback.
      let workflowCallback = new SetupDeviceCallback(ostUserId, getDisplayModel);

      OstWalletSdk.setupDevice(ostUserId,
        AppData.TOKEN_ID,
        workflowCallback);
    }

    OnActivateUserPress() {
      let getDisplayModel = () => {
        return this.wsModel;
      };
      let userId = this.state.userId;

      let delegate = new BaseUIWorkflowCallback(userId, getDisplayModel);
      let workflowId = OstWalletSdkUI.activateUser(
        userId,
        (14 * 24 * 60 * 60), // 14 days.
        '1000000000000000000',
        delegate
      );

      // Subscribe to events.
      delegate.setWorkflowInfo(workflowId);
    }

    render() {
      if (this.props.isLoading)
          return (
              <View style={styles.scrollContainer}>
                  <Text style={{ marginBottom: 20 }}>Please wait while your device is being setup...</Text>
                  <ActivityIndicator size="large" color="#000" />
                  <WorkflowStatusModel ref={(wsModel) => {
                    this.wsModel = wsModel;
                  }}></WorkflowStatusModel>
              </View>
          );

      return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.form}>
              <TouchableOpacity style={styles.buttonInfoWrapper} onPress={() => this.onTestGetterMethods()}>
                  <Text style={styles.buttonText}>Test Getter Methods</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <TouchableOpacity style={styles.buttonWrapper} onPress={() => this.OnActivateUserPress() }>
                <Text style={styles.buttonText}>Activate User</Text>
              </TouchableOpacity>
            </View>

            <GetMethodsModel userId={this.state.userId} ref={( gmm ) => {
              this.getMethodsModel = gmm;
            }}></GetMethodsModel>
            <WorkflowStatusModel ref={(wsModel) => {
              this.wsModel = wsModel;
            }}></WorkflowStatusModel>
          </ScrollView>
        </SafeAreaView>
      )
    }

    onTestGetterMethods() {
      if ( this.getMethodsModel ) {
        this.getMethodsModel.showModal();
      }
    }






    revokeDevice(  ) {

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
      });
    }




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

    onScanDeviceQRCode() {
    let delegate = new OstWalletSdkUICallbackImplementation( this.wsModel );
    AsyncStorage.getItem('user').then((user) => {
      user = JSON.parse(user);
      let workflowId = OstWalletSdkUI.scanQRCodeToAuthorizeDevice(
        user.user_details.user_id,
        delegate
      );
      delegate.setWorkflowInfo(workflowId, "onGetAddDeviceQRCode");
      console.log("OstWalletSdkUI.onGetAddDeviceQRCode workflowId:", workflowId);

    });
  }

  onScanTransactionQRCode() {
    let delegate = new OstWalletSdkUICallbackImplementation( this.wsModel );
    AsyncStorage.getItem('user').then((user) => {
      user = JSON.parse(user);
      let workflowId = OstWalletSdkUI.scanQRCodeToExecuteTransaction(
        user.user_details.user_id,
        delegate
      );
      delegate.setWorkflowInfo(workflowId, "onScanTransactionQRCode");
      console.log("OstWalletSdkUI.onScanTransactionQRCode workflowId:", workflowId);

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

    onTestJSONMethods() {
      if ( this.JSONMethodsModel ) {
        this.JSONMethodsModel.showModal();
      }
    }

    initializeSetupDevice() {
         this.props.dispatchLoadingState(true);
         useCustomThemeConfig && OstWalletSdkUI.setThemeConfig(theme_config);
         useCustomContentConfig && OstWalletSdkUI.setContentConfig(content_config);
         OstWalletSdk.initialize('https://api.stagingost.com/testnet/v2', ost_wallet_sdk_config, (err , success ) => {
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

    renderMain() {
        if (this.props.isLoading)
            return (
                <View style={styles.scrollContainer}>
                    <Text style={{ marginBottom: 20 }}>Please wait while your device is being setup...</Text>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            );
        return (
          <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
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

                    <TouchableOpacity style={styles.buttonInfoWrapper} onPress={() => this.onTestJSONMethods()}>
                        <Text style={styles.buttonText}>Test JSON API</Text>
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

                  <TouchableOpacity
                    style={styles.buttonWrapper}
                    onPress={() =>this.onScanDeviceQRCode()}
                  >
                    <Text style={styles.buttonText}>Scan Add Device QR Code</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.buttonWrapper}
                    onPress={() =>this.onScanTransactionQRCode()}
                  >
                    <Text style={styles.buttonText}>Scan Transaction QR Code</Text>
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

              <JSONMethodsModel userId={this.state.userId} ref={( jmm ) => {
                this.JSONMethodsModel = jmm;
              }}></JSONMethodsModel>

            </ScrollView>
          </SafeAreaView>
        );
    }
}

export default HomePage;
