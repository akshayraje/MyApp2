import React,{Component } from 'react';
import {SafeAreaView, View, Modal, Text, ScrollView,TouchableOpacity} from 'react-native';
import AppData from '../../app.json';
import {OstJsonApi, OstWalletSdkUI} from '@ostdotcom/ost-wallet-sdk-react-native';
import styles from '../Styles';

export default class JSONMethodsModel extends Component {
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
    this.getCurrentDeviceForUserId();
    this.getBalanceWithPricePointForUserId();
    this.getBalanceForUserId();
    this.getPricePointForUserId();
    this.getPendingRecoveryForUserId();
    this.getTransactionsForUserId();
    this.getDeviceListForUserId();
  }

  getCurrentDeviceForUserId = () => {
    this.setState({
      getCurrentDeviceForUserId: "\n\n\nWaiting for response\n\n\n"
    });
    let userId = this.props.userId;

    OstJsonApi.getCurrentDeviceForUserId(userId, (response) => {
      this.setState({
        getCurrentDeviceForUserId: this.parseJson(response)
      })
    }, (error) => {
      this.setState({
        getCurrentDeviceForUserId: this.parseJson(error)
      })
    });
  }

  getBalanceWithPricePointForUserId = () => {
    //getBalanceWithPricePointForUserId
    this.setState({
      getBalanceWithPricePointForUserId: "\n\n\nWaiting for response\n\n\n"
    });
    let userId = this.props.userId;

    OstJsonApi.getBalanceWithPricePointForUserId(userId, (response) => {
      this.setState({
        getBalanceWithPricePointForUserId: this.parseJson(response)
      })
    }, (error) => {
      this.setState({
        getBalanceWithPricePointForUserId: this.parseJson(error)
      })
    });
  }

  getBalanceForUserId = () => {
    //getBalanceForUserId
    this.setState({
      getBalanceForUserId: "\n\n\nWaiting for response\n\n\n"
    });
    let userId = this.props.userId;

    OstJsonApi.getBalanceForUserId(userId, (response) => {
      this.setState({
        getBalanceForUserId: this.parseJson(response)
      })
    }, (error) => {
      this.setState({
        getBalanceForUserId: this.parseJson(error)
      })
    });
  }

  getPendingRecoveryForUserId = () => {
    this.setState({
      getPendingRecoveryForUserId: "\n\n\nWaiting for response\n\n\n"
    });
    let userId = this.props.userId;

    OstJsonApi.getPendingRecoveryForUserId(userId, (response) => {
      this.setState({
        getPendingRecoveryForUserId: this.parseJson(response)
      })
    }, (error) => {
      this.setState({
        getPendingRecoveryForUserId: this.parseJson(error)
      })
    });
  }

  getPricePointForUserId = () => {
    //getPricePointForUserId
    this.setState({
      getPricePointForUserId: "\n\n\nWaiting for response\n\n\n"
    });
    let userId = this.props.userId;

    OstJsonApi.getPricePointForUserId(userId, (response) => {
      this.setState({
        getPricePointForUserId: this.parseJson(response)
      })
    }, (error) => {
      this.setState({
        getPricePointForUserId: this.parseJson(error)
      })
    });
  }


  getTransactionsNextPage = (prevPageMeta, nextPagePayload) => {
    let userId = this.props.userId;

    OstJsonApi.getTransactionsForUserId(userId, nextPagePayload, (response) => {
      let strPrevPageMeta = prevPageMeta ? JSON.stringify(prevPageMeta) : "null";
      let statePageMeta = this.state.txPrevPageMeta ? JSON.stringify(this.state.txPrevPageMeta): "null";
      if ( strPrevPageMeta != statePageMeta ) {
        // Ignore this response. The user retryed the Api call.
        return;
      }

      let pageMeta = null;
      let newNextPagePayload = {};
      if (response 
        && response.meta 
      ) {
        pageMeta = response.meta;
        newNextPagePayload = pageMeta.next_page_payload || {};
      }

      let logText = this.state.getTransactionsForUserId;
      if ( null == prevPageMeta ) {
        // First Page.
        logText = "";
      } else {
        // Some page.
        logText = logText + "\n--- Next Page ---\n";
      }

      //Parse response.
      logText = logText + this.parseJson(response);


      if ( Object.keys(newNextPagePayload).length > 0 ) {
        logText = logText + "\n--- Fetching Next Page---\n";
        // Make the next page API call.
        this.getTransactionsNextPage(pageMeta, newNextPagePayload);
      } else {
        logText = logText + "\n--- No More Pages ---\n";
      }

      this.setState({
        getTransactionsForUserId: logText,
        txPrevPageMeta: pageMeta
      });

    }, (error) => {
      this.setState({
        getTransactionsForUserId: this.parseJson(error),
        txPrevPageMeta: {gotError: 1}
      })
    });

  };

  getTransactionsForUserId = () => {
    //getTransactionsForUserId
    this.setState({
      getTransactionsForUserId: "\n\n\nWaiting for response\n\n\n",
      "txPrevPageMeta": null
    });
    this.getTransactionsNextPage(null, null);
  }

  getDeviceListForUserId = () => {
    this.setState({
      getDeviceListForUserId: "\n\n\nWaiting for response\n\n\n"
    });
    let userId = this.props.userId;

    OstJsonApi.getDeviceListForUserId(userId, null, (response) => {
      this.setState({
        getDeviceListForUserId: this.parseJson(response)
      })
    }, (error) => {
      this.setState({
        getDeviceListForUserId: this.parseJson(error)
      })
    });
  }

  parseJson = (response) => {
    let parsedJson = response ? JSON.stringify(response, null, 2) : "null";
    console.log("JSONMethodsModel: parsedJson\n", parsedJson);
    return parsedJson;
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
                  <Text style={styles.infoText}>getCurrentDeviceForUserId('{this.props.userId}')</Text>
                  <TouchableOpacity onPress={this.getCurrentDeviceForUserId} style={styles.buttonRetryWrapper}>
                    <Text style={styles.buttonRetryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.logs}> 
                  <Text>{this.state.getCurrentDeviceForUserId || "waiting"}</Text>
                </View>

                <View style={styles.infoWrap}>
                  <Text style={styles.infoText}>getBalanceWithPricePointForUserId('{this.props.userId}')</Text>
                  <TouchableOpacity onPress={this.getBalanceWithPricePointForUserId} style={styles.buttonRetryWrapper}>
                    <Text style={styles.buttonRetryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.logs}> 
                  <Text>{this.state.getBalanceWithPricePointForUserId || "waiting"}</Text>
                </View>

                <View style={styles.infoWrap}>
                  <Text style={styles.infoText}>getBalanceForUserId('{this.props.userId}')</Text>
                  <TouchableOpacity onPress={this.getBalanceForUserId} style={styles.buttonRetryWrapper}>
                    <Text style={styles.buttonRetryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.logs}> 
                  <Text>{this.state.getBalanceForUserId || "waiting"}</Text>
                </View>

                <View style={styles.infoWrap}>
                  <Text style={styles.infoText}>getPricePointForUserId('{this.props.userId}')</Text>
                  <TouchableOpacity onPress={this.getPricePointForUserId} style={styles.buttonRetryWrapper}>
                    <Text style={styles.buttonRetryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.logs}> 
                  <Text>{this.state.getPricePointForUserId || "waiting"}</Text>
                </View>

                <View style={styles.infoWrap}>
                  <Text style={styles.infoText}>getPendingRecoveryForUserId('{this.props.userId}')</Text>
                  <TouchableOpacity onPress={this.getPendingRecoveryForUserId} style={styles.buttonRetryWrapper}>
                    <Text style={styles.buttonRetryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.logs}> 
                  <Text>{this.state.getPendingRecoveryForUserId || "waiting"}</Text>
                </View>



                <View style={styles.infoWrap}>
                  <Text style={styles.infoText}>getTransactionsForUserId('{this.props.userId}', null)</Text>
                  <TouchableOpacity onPress={this.getTransactionsForUserId} style={styles.buttonRetryWrapper}>
                    <Text style={styles.buttonRetryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.logs}> 
                  <Text>{this.state.getTransactionsForUserId || "waiting"}</Text>
                </View>

                <View style={styles.infoWrap}>
                  <Text style={styles.infoText}>getDeviceListForUserId('{this.props.userId}', null)</Text>
                  <TouchableOpacity onPress={this.getDeviceListForUserId} style={styles.buttonRetryWrapper}>
                    <Text style={styles.buttonRetryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.logs}> 
                  <Text>{this.state.getDeviceListForUserId || "waiting"}</Text>
                </View>

              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    )
  }

}