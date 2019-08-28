import React,{Component } from 'react';
import {SafeAreaView, View, Modal, Text, ScrollView,TouchableOpacity} from 'react-native';
import AppData from '../../app.json';
import {OstJsonApi, OstWalletSdkUI} from '@ostdotcom/ost-wallet-sdk-react-native';
import styles from '../Styles';
import JSONTree from 'react-native-json-tree'
import successResponseTheme from '../themes/bright';
import errorResponseTheme from '../themes/marrakesh';
const invertThemeOnSuccess = true;
const invertThemeOnError = true;
const keyPrefix = "JMM";
let keyCnt =1;

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
    this.getDeviceListForUserId();
    this.getTransactionsForUserId();
  }

  getCurrentDeviceForUserId = () => {
    this.setState({
      getCurrentDeviceForUserId: "\n\n\nWaiting for response\n\n\n"
    });
    let userId = this.props.userId;

    OstJsonApi.getCurrentDeviceForUserId(userId, (response) => {
      this.setState({
        getCurrentDeviceForUserId: response
      })
    }, (error) => {
      this.setState({
        getCurrentDeviceForUserId: this.processData(error)
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
        getBalanceWithPricePointForUserId: this.processData(response)
      })
    }, (error) => {
      this.setState({
        getBalanceWithPricePointForUserId: this.processData(error)
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
        getBalanceForUserId: this.processData(response)
      })
    }, (error) => {
      this.setState({
        getBalanceForUserId: this.processData(error)
      })
    });
  }

  getPendingRecoveryForUserId = () => {
    this.setState({
      getPendingRecoveryForUserId: "\n\n\nWaiting for response\n\n\n"
    });
    let userId = this.props.userId;

    OstJsonApi.getPendingRecoveryForUserId(userId, (response) => {
      console.log("getPendingRecoveryForUserId response", response);
      this.setState({
        getPendingRecoveryForUserId: this.processData(response)
      })
    }, (error) => {
      console.log("getPendingRecoveryForUserId error", error);
      this.setState({
        getPendingRecoveryForUserId: this.processData(error)
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
        getPricePointForUserId: this.processData(response)
      })
    }, (error) => {
      this.setState({
        getPricePointForUserId: this.processData(error)
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

      let allResponses = this.state.getTransactionsForUserId || [];
      if ( null == prevPageMeta ) {
        // First Page.
        allResponses = ["Frist Page"];
      }

      //Parse response.
      allResponses.push(this.processData(response));


      if ( Object.keys(newNextPagePayload).length > 0 ) {
        allResponses.push("Next Page");
        // Make the next page API call.
        this.getTransactionsNextPage(pageMeta, newNextPagePayload);
      } else {
        allResponses.push("No More Pages");
      }

      this.setState({
        getTransactionsForUserId: allResponses,
        txPrevPageMeta: pageMeta
      });

    }, (error) => {
      let allResponses = this.state.getTransactionsForUserId || [];
      if ( null == prevPageMeta ) {
        allResponses = [];
      }
      allResponses.push( this.processData(error) );
      this.setState({
        getTransactionsForUserId: allResponses,
        txPrevPageMeta: {gotError: 1}
      })
    });

  };

  getTransactionsForUserId = () => {
    this.setState({
      getTransactionsForUserId: ["\n\n\nWaiting for response\n\n\n"],
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
        getDeviceListForUserId: this.processData(response)
      })
    }, (error) => {
      this.setState({
        getDeviceListForUserId: this.processData(error)
      })
    });
  }

  processData = (response) => {
    console.log("JSONMethodsModel: processData\n", JSON.stringify(response, null, 2) );
    return response;
  }

  _expandNode = () => {
    return true;
  }

  renderResponse( response ) {
    if ( response instanceof Array ) {
      return this.renderArrayResponse(response );
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
    keyCnt =1;

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
              <View style={{flexDirection:'column', marginBottom:10, flex:1,justifyContent: 'space-between'}}>
                <View style={styles.secondaryInfoWrap}>
                  <Text style={styles.secondaryInfoText}>userId: {this.props.userId}</Text>
                </View>

                <View style={styles.infoWrap}>
                  <Text style={styles.infoHead}>getCurrentDeviceForUserId</Text>
                  <TouchableOpacity onPress={this.getCurrentDeviceForUserId} style={styles.buttonRetryWrapper}>
                    <Text style={styles.buttonRetryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
                {this.renderResponse(this.state.getCurrentDeviceForUserId )}

                <View style={styles.infoWrap}>
                  <Text style={styles.infoHead}>getBalanceWithPricePointForUserId</Text>
                  <TouchableOpacity onPress={this.getBalanceWithPricePointForUserId} style={styles.buttonRetryWrapper}>
                    <Text style={styles.buttonRetryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
                {this.renderResponse(this.state.getBalanceWithPricePointForUserId ) }

                <View style={styles.infoWrap}>
                  <Text style={styles.infoHead}>getBalanceForUserId</Text>
                  <TouchableOpacity onPress={this.getBalanceForUserId} style={styles.buttonRetryWrapper}>
                    <Text style={styles.buttonRetryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
                {this.renderResponse(this.state.getBalanceForUserId ) }

                <View style={styles.infoWrap}>
                  <Text style={styles.infoHead}>getPricePointForUserId</Text>
                  <TouchableOpacity onPress={this.getPricePointForUserId} style={styles.buttonRetryWrapper}>
                    <Text style={styles.buttonRetryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
                {this.renderResponse(this.state.getPricePointForUserId ) }

                <View style={styles.infoWrap}>
                  <Text style={styles.infoHead}>getPendingRecoveryForUserId</Text>
                  <TouchableOpacity onPress={this.getPendingRecoveryForUserId} style={styles.buttonRetryWrapper}>
                    <Text style={styles.buttonRetryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
                {this.renderResponse(this.state.getPendingRecoveryForUserId ) }

                <View style={styles.infoWrap}>
                  <Text style={styles.infoHead}>getDeviceListForUserId</Text>
                  <TouchableOpacity onPress={this.getDeviceListForUserId} style={styles.buttonRetryWrapper}>
                    <Text style={styles.buttonRetryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
                {this.renderResponse(this.state.getDeviceListForUserId ) }

                <View style={styles.infoWrap}>
                  <Text style={styles.infoHead}>getTransactionsForUserId</Text>
                  <TouchableOpacity onPress={this.getTransactionsForUserId} style={styles.buttonRetryWrapper}>
                    <Text style={styles.buttonRetryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
                {this.renderResponse(this.state.getTransactionsForUserId)}
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    )
  }

}