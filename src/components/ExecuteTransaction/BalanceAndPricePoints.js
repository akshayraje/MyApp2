import React, { Component } from 'react';
import styles from "../../Styles";
import { Text, TextInput, TouchableOpacity, ScrollView, View } from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";
import {OstWalletSdk} from '@ostdotcom/ost-wallet-sdk-react-native';
import {OstJsonApi} from '@ostdotcom/ost-wallet-sdk-react-native';

export default class BalanceAndPricePoints extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestData: null,
            requsetError: null
        };
    }

    componentDidMount() {
        var oThis = this;
        AsyncStorage.getItem('user').then((user) => {
            console.log("I have user.", user);
            var user = JSON.parse(user);
            var userId = user.user_details.user_id;
            oThis.fetchDetails(userId);
        });
    }


    fetchDetails(userId) {

        var oThis = this

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

        OstJsonApi.getDeviceListForUserId(userId, function (data) {
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
                requsetError: ostError
            });
        })
    }

    render () {
        if ( this.state.requestData ) {
            return this.renderData();
        } else if ( this.state.requsetError ) {
            return this.renderError();
        } else {
            return this.renderFetching();
        }
    }

    renderData() {

        let requestData = this.state.requestData

        return (
            <View style={styles.form} pointerEvents={this.props.isLoading ? 'none' : 'auto'}>
                <Text> Api Returned Data.</Text>
                <Text>{JSON.stringify(this.state.requestData || {note: "this.state.requestData is NULL. App Error"})}</Text>
            </View>
        );
    }

    renderError() {
        return (
            <View style={styles.form}>
                <Text> Api Returned Error.</Text>
                <Text>{JSON.stringify(this.state.requsetError || {note: "this.state.requsetError is NULL. App Error"})}</Text>
            </View>
        );
    }

    renderFetching() {
        return (
            <View style={styles.form}>
                <Text> Fetching Balances and Price Point.</Text>
            </View>
        );
    }
}