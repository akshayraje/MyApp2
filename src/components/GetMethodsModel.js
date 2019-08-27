import React,{Component } from 'react';
import {SafeAreaView, View, Modal, Text, ScrollView,TouchableOpacity, Image} from 'react-native';
import AppData from '../../app.json';
import {OstWalletSdk, OstWalletSdkUI} from '@ostdotcom/ost-wallet-sdk-react-native';
import styles from '../Styles';
import JSONTree from 'react-native-json-tree'
import successResponseTheme from '../themes/bright';
import errorResponseTheme from '../themes/marrakesh';
const invertThemeOnSuccess = true;
const invertThemeOnError = true;
const keyPrefix = "JMM";
let keyCnt =1;


export default class GetMethodsModel extends Component {
  constructor(props){
    props = props || {};
    super(props)
    this.state = {
      isShowing : false,
      isFetchingQr : true,
      failedToFetchQr: false
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
    this.getAddDeviceQRCode();
  }

  getAddDeviceQRCode = () => {
    this.setState({
      getAddDeviceQRCode: "Waiting for response",
      isFetchingQr : true,
      failedToFetchQr: false
    })
    let userId = this.props.userId;
    OstWalletSdk.getAddDeviceQRCode(userId, 
      (response) => {
        console.log('qrCode:\n', response);
        this.setState({
          getAddDeviceQRCode: String(response),
          isFetchingQr : false,
          failedToFetchQr: false
        })
      }, 
      (error) => {
        this.setState({
          getAddDeviceQRCode: this.processData(error),
          isFetchingQr : false,
          failedToFetchQr: true
        })
      })
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
        "get_active_sessions_with_limit_response": this.processData(response)
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
        "get_active_sessions_response": this.processData(response)
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
        get_current_device_response: this.processData(response)
      })
    });
  }

  getUser = () => {
    this.setState({
      get_user_response: "Waiting for response"
    });

    OstWalletSdk.getUser(this.props.userId, (response) => {
      this.setState({
        get_user_response: this.processData(response)
      })
    });
  }

  getToken = () => {
    this.setState({
      get_token_response: "Waiting for response"
    });

    OstWalletSdk.getToken(this.tokenId, (response) => {
      this.setState({
        get_token_response: this.processData(response)
      })
    });
  }

  processData = (response) => {
    console.log("GetMethodsModel: processData\n", JSON.stringify(response,null, 2) );
    return response;
  }

  renderQR() {
    let qrError = "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";;
    let qrFetching = "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";
    let isFetchingQr = this.state.isFetchingQr;
    let failedToFetchQr = this.state.failedToFetchQr;
    let qrBase64 = this.state.getAddDeviceQRCode;
    if ( isFetchingQr ) {
      qrBase64 = qrFetching;
    } else if (failedToFetchQr) {
      qrBase64 = qrError;
    } else {
      qrBase64 = this.state.getAddDeviceQRCode;
    }

    return(<Image
            style={styles.getAddDeviceQRCode}
            source={{uri: `data:image/png;base64,${qrBase64}`}}
    />);
  }

  _expandNode = () => {
    return true;
  }

  renderResponse( response ) {
    if ( response instanceof Array ) {
      return this.renderObjectResponse(response );
      // Do not use renderArrayResponse here. 
      // Lets also display empty arrays.
    } else if (typeof response === 'object') {
      return this.renderObjectResponse( response );
    } else {
      return this.renderTextResponse( response );
    }
  }

  renderObjectResponse( obj ) {
      let treeTheme = successResponseTheme;
      let invertTheme = invertThemeOnSuccess;
      let keyId = keyPrefix + "_txt_" + keyCnt++;
      if ( typeof obj.is_api_error != 'undefined' ) {
        treeTheme = errorResponseTheme;
        invertTheme = invertThemeOnError;
      } else {

      }
      // Its an Object.
      return(<ScrollView style={styles.jsonTreeWrap} key={keyId} horizontal={true}>
          <JSONTree style={styles.jsonTree} 
            data={obj}  shouldExpandNode={this._expandNode}
            invertTheme={invertTheme} theme={treeTheme} 
          />
        </ScrollView>);
  }


  renderTextResponse( text  ) {
    let textToDisplay = String( text );
    let keyId = keyPrefix + "_txt_" + keyCnt++;
    return(<View key={keyId} style={styles.secondaryInfoWrap}>
      <Text style={styles.secondaryInfoText}>{textToDisplay}</Text>
    </View>);
  }

  renderArrayResponse( arrayOfResponses ) {
      // Render multiple components.
      let subViews = [];
      let len = arrayOfResponses.length;
      for(let cnt =0; cnt < len; cnt++ ) {
        subViews.push(this.renderResponse( arrayOfResponses[cnt]) );
      }
      return(subViews);
  }

  render(){
    // reset key cnt
    keyCnt = 1;

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

                <View style={styles.secondaryInfoWrap}>
                  <Text style={styles.secondaryInfoText}>userId: {this.props.userId}</Text>
                </View>

                <View style={styles.infoWrap}>
                  <Text style={styles.infoHead}>getUser</Text>
                  <TouchableOpacity onPress={this.getUser} style={styles.buttonRetryWrapper}>
                    <Text style={styles.buttonRetryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
                {this.renderResponse(this.state.get_user_response)}

                <View style={styles.infoWrap}>
                  <Text style={styles.infoHead}>isBiometricEnabled</Text>
                  <TouchableOpacity onPress={this.isBiometricEnabled} style={styles.buttonRetryWrapper}>
                    <Text style={styles.buttonRetryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
                {this.renderResponse(this.state.is_biometric_enabled_response)}
                
                <View style={styles.infoWrap}>
                  <Text style={styles.infoHead}>getCurrentDeviceForUserId</Text>
                  <TouchableOpacity onPress={this.getCurrentDevice} style={styles.buttonRetryWrapper}>
                    <Text style={styles.buttonRetryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
                {this.renderResponse(this.state.get_current_device_response)}

                
                <View style={styles.infoWrap}>
                  <Text style={styles.infoHead}>getAddDeviceQRCode</Text>
                  <TouchableOpacity onPress={this.getAddDeviceQRCode} style={styles.buttonRetryWrapper}>
                    <Text style={styles.buttonRetryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
                {this.renderResponse(this.state.getAddDeviceQRCode)}
                {this.renderQR()}
                
                <View style={styles.infoWrap}>
                  <Text style={styles.infoHead}>getActiveSessionsForUserId</Text>
                  <TouchableOpacity onPress={this.getActiveSessions} style={styles.buttonRetryWrapper}>
                    <Text style={styles.buttonRetryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
                {this.renderResponse(this.state.get_active_sessions_response)}

                <View style={styles.infoWrap}>
                  <Text style={styles.infoHead}>getActiveSessionsForUserId (1 ETH) </Text>
                  <TouchableOpacity onPress={this.getActiveSessionsWithLimit} style={styles.buttonRetryWrapper}>
                    <Text style={styles.buttonRetryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
                {this.renderResponse(this.state.get_active_sessions_with_limit_response)}

                <View style={styles.infoWrap}>
                  <Text style={styles.infoHead}>getToken('{this.tokenId}')</Text>
                  <TouchableOpacity onPress={this.getToken} style={styles.buttonRetryWrapper}>
                    <Text style={styles.buttonRetryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
                {this.renderResponse(this.state.get_token_response)}
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    )
  }

}