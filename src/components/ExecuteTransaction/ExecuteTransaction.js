import React, { Component } from 'react';
import styles from "../../Styles";
import { Text, TextInput, TouchableOpacity, ScrollView, View, Switch, CheckBox } from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";
import {OstJsonApi} from '@ostdotcom/ost-wallet-sdk-react-native';
import OstWalletWorkflowCallback from "../../services/OstWalletSdkCallbackImplementation";

import {OstWalletSdk} from '@ostdotcom/ost-wallet-sdk-react-native';

export default class ExecuteTransaction extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      addresses: null,
      amounts: null,
      ruleName: "direct transfer",
      requestData: null,
      requsetError: null,
      currencyCode: "USD"
    };
  }

  componentDidMount() {
    var oThis = this;
    AsyncStorage.getItem('user').then((user) => {
      console.log("I have user.", user);
      var user = JSON.parse(user);
      this.userId = user.user_details.user_id;

      oThis.fetchDetails(this.userId);
    });
  }

  fetchDetails(userId) {

    var oThis = this;

    OstJsonApi.getPendingRecoveryForUserId(userId,function (data) {
      console.log("data of getPendingRecoveryForUserId\n", data);

      oThis.setState({
        requestData: data
      });
    }, function (ostError, apiErrObj) {
      console.log("apiErrObj of getPendingRecoveryForUserId\n", apiErrObj);
      console.log("ostError of getPendingRecoveryForUserId\n", ostError);

      oThis.setState({
        requsetError: ostError
      });
    });

    OstJsonApi.getDeviceListForUserId(userId, null, function (data) {
      console.log("data of getDeviceListForUserId\n", data);

      oThis.setState({
        requestData: data
      });
    }, function (ostError, apiErrObj) {
      console.log("apiErrObj of getDeviceListForUserId\n", apiErrObj);
      console.log("ostError of getDeviceListForUserId\n", ostError);

      oThis.setState({
        requsetError: ostError
      });
    });

    OstJsonApi.getBalanceWithPricePointForUserId(userId, function (data) {
      console.log("data of getBalanceWithPricePointForUserId\n", data);

      oThis.setState({
        requestData: data
      });
    }, function (ostError, apiErrObj) {
      console.log("apiErrObj of getBalanceWithPricePointForUserId\n", apiErrObj);
      console.log("ostError of getBalanceWithPricePointForUserId\n", ostError);

      oThis.setState({
        requsetError: ostError,
        requestData: apiErrObj
      });
    })
  }

  render () {
    let requestData = this.state.requestData;
    let userBalance = "fetching";
    if (requestData) {
      userBalance = requestData
    }

    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form} pointerEvents={this.props.isLoading ? 'none' : 'auto'}>

          <TextInput
            style={styles.inputBox}
            onChangeText={(addresses) => this.setState({addresses})}
            value={this.state.addresses}
            placeholder="Enter addresses"
          />
          <TextInput
            style={styles.inputBox}
            onChangeText={(amounts) => this.setState({amounts})}
            value={this.state.amounts}
            placeholder="Enter amounts"
          />

          <View style = {styles.container}>
            <Text>Change rule name ({this.state.ruleName})</Text>
            <Switch
              value={this.state.ruleName == "direct transfer"}
              onValueChange={(value) =>
                this.onRuleToggle(value)
              }
            />
            <Text></Text>
          </View>

          <TouchableOpacity style={styles.buttonWrapper}
                            onPress={() => this.setState({currencyCode: "USD"})}
          >
            <Text style={styles.buttonText}>{"USD"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonWrapper}
                            onPress={() => this.setState({currencyCode: "EUR"})}
          >
            <Text style={styles.buttonText}>{"EUR"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonWrapper}
                            onPress={() => this.setState({currencyCode: "GBP"})}
          >
            <Text style={styles.buttonText}>{"GBP"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonWrapper}
                            onPress={() => {this.onExecuteTransaction( this.state.addresses,
                              this.state.amounts, this.state.ruleName, this.state.currencyCode )}}
          >
            <Text style={styles.buttonText}>{this.props.isLoading ? 'Executing...' : 'Execute Transactions'}</Text>
          </TouchableOpacity>

          <View style = {styles.container}>
            <Text> User Balance: {JSON.stringify(userBalance)}</Text>
          </View>

        </View>
      </ScrollView>
    )
  }

  onRuleToggle(value) {
    if (value == true) {
      this.setState({ruleName : "direct transfer"});
    }else {
      this.setState({ruleName : "pricer"});
    }
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

      OstWalletSdk.executeTransaction(
        this.userId,
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
  }

}
