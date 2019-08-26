import React,{Component } from 'react';
import {SafeAreaView, View, Modal, Text, ScrollView,TouchableOpacity} from 'react-native';
import AppData from '../../app.json';
import {OstWalletSdk, OstWalletSdkUI} from '@ostdotcom/ost-wallet-sdk-react-native';
import styles from '../Styles';

export default class GetMethodsModel extends Component {
  constructor(props){
    props = props || {};
    super(props)
    this.state = {
      isShowing : false
    };
    this.tokenId = AppData.TOKEN_ID;

    console.log("props", this.props);
  }

  hideModal = () => {
    this.setState({
      isShowing : false
    });
  }

  showModal = () => {
    this.fetchAllResponses();
  }

  fetchAllResponses = () => {
    this.setState({
      isShowing : true
    });    
    this.getToken();
    this.getUser();
    this.getCurrentDevice();
    this.getActiveSessions();
    this.getActiveSessionsWithLimit();
    this.isBiometricEnabled();
  }

  isBiometricEnabled = () => {
    this.setState({
      is_biometric_enabled_response: "Waiting for response"
    });
    let userId = this.props.userId;

    OstWalletSdk.isBiometricEnabled(userId, (response) => {
      this.setState({
        "is_biometric_enabled_response": String(response)
      });
    });
  }

  getActiveSessionsWithLimit = () => {
    console.log("props", this.props);
    this.setState({
      get_active_sessions_with_limit_response: "Waiting for response"
    });
    let userId = this.props.userId;
    let minLimit = "1000000000000000000";
    OstWalletSdk.getActiveSessionsForUserId(userId, minLimit, (response) => {
      this.setState({
        "get_active_sessions_with_limit_response": this.parseJson(response)
      });
    });
  }

  getActiveSessions = () => {
    this.setState({
      get_active_sessions_response: "Waiting for response"
    });
    let userId = this.props.userId;

    OstWalletSdk.getActiveSessionsForUserId(userId, (response) => {
      this.setState({
        "get_active_sessions_response": this.parseJson(response)
      });
    });
  }

  getCurrentDevice = () => {
    this.setState({
      get_current_device_response: "Waiting for response"
    });
    let userId = this.props.userId;

    OstWalletSdk.getCurrentDeviceForUserId(userId, (response) => {
      this.setState({
        get_current_device_response: this.parseJson(response)
      })
    });
  }

  getUser = () => {
    this.setState({
      get_user_response: "Waiting for response"
    });

    OstWalletSdk.getUser(this.props.userId, (response) => {
      this.setState({
        get_user_response: this.parseJson(response)
      })
    });
  }

  getToken = () => {
    this.setState({
      get_token_response: "Waiting for response"
    });

    OstWalletSdk.getToken(this.tokenId, (response) => {
      this.setState({
        get_token_response: this.parseJson(response)
      })
    });
  }

  parseJson = (response) => {
    return response ? JSON.stringify(response, null, 2) : "null";
  }


  render(){
    return(
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.isShowing}
      >
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
          <View style={{flexDirection:'column',padding:0,flex:1,justifyContent: 'space-between', position:'relative'}}>
            <TouchableOpacity onPress={this.hideModal} style={{justifyContent:'center',alignItems:'center',padding: 15,backgroundColor:'#ffffff', position:'absolute', top:0, right:0}}>
              <Text style={{color:'#007bff'}}>Close</Text>
            </TouchableOpacity>
            <ScrollView style={{marginTop: 50, borderWidth:1, padding:0,  backgroundColor: '#ffffff'}}>
              <View style={{flexDirection:'column',padding:10,flex:1,justifyContent: 'space-between'}}>

                <View style={styles.infoWrap}>
                  <Text style={styles.infoText}>getUser('{this.props.userId}')</Text>
                  <TouchableOpacity onPress={this.getUser} style={styles.buttonRetryWrapper}>
                    <Text style={styles.buttonRetryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.logs}> 
                  <Text>{this.state.get_user_response || "waiting"}</Text>
                </View>

                <View style={styles.infoWrap}>
                  <Text style={styles.infoText}>isBiometricEnabled('{this.props.userId}')</Text>
                  <TouchableOpacity onPress={this.isBiometricEnabled} style={styles.buttonRetryWrapper}>
                    <Text style={styles.buttonRetryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.logs}> 
                  <Text>{this.state.is_biometric_enabled_response || "waiting"}</Text>
                </View>
                
                <View style={styles.infoWrap}>
                  <Text style={styles.infoText}>getCurrentDeviceForUserId('{this.props.userId}')</Text>
                  <TouchableOpacity onPress={this.getCurrentDevice} style={styles.buttonRetryWrapper}>
                    <Text style={styles.buttonRetryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.logs}> 
                  <Text>{this.state.get_current_device_response || "waiting"}</Text>
                </View>
                
                <View style={styles.infoWrap}>
                  <Text style={styles.infoText}>getActiveSessionsForUserId('{this.props.userId}')</Text>
                  <TouchableOpacity onPress={this.getActiveSessions} style={styles.buttonRetryWrapper}>
                    <Text style={styles.buttonRetryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.logs}> 
                  <Text>{this.state.get_active_sessions_response || "waiting"}</Text>
                </View>

                <View style={styles.infoWrap}>
                  <Text style={styles.infoText}>getActiveSessionsForUserId('{this.props.userId}', '1000000000000000000') (1 ETH) </Text>
                  <TouchableOpacity onPress={this.getActiveSessionsWithLimit} style={styles.buttonRetryWrapper}>
                    <Text style={styles.buttonRetryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.logs}> 
                  <Text>{this.state.get_active_sessions_with_limit_response || "waiting"}</Text>
                </View>

                <View style={styles.infoWrap}>
                  <Text style={{fontSize:14}}>getToken('{this.tokenId}')</Text>
                  <TouchableOpacity onPress={this.getToken} style={styles.buttonRetryWrapper}>
                    <Text style={styles.buttonRetryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.logs}>
                  <Text>{this.state.get_token_response || "waiting"}</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    )
  }

}