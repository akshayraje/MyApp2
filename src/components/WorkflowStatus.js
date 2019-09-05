import React,{Component } from 'react';
import {View, Modal, Text, ScrollView,TouchableOpacity} from 'react-native';
import successResponseTheme from "../themes/bright";
import styles from "../Styles";
import JSONTree from 'react-native-json-tree'
import errorResponseTheme from '../themes/marrakesh';
const invertThemeOnSuccess = true;
const invertThemeOnError = true;

const showCallLogs = false;
const keyPrefix = "JMM";
let keyCnt = 1;

export default class WorkflowStatus extends Component {
  constructor(props){
    props = props || {};
    super(props)
    this.state ={
      isShowing : false
    }
  }

  hideModal = () =>{
    this.setState({
      isShowing : false
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
        return(<View key={keyId} style={styles.whiteInfoWrap}>
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
    return(
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.isShowing}
      >
        <View style={{flexDirection:'column',padding:10,flex:1,justifyContent: 'space-between'}}>
          <ScrollView style={{marginTop: 50, borderWidth:1, padding:5}}>
            <View style={styles.infoWrap}>
              <Text style={styles.infoHead}>WorkFlow Type :</Text>
            </View>
            <View style={styles.whiteInfoWrap}>
              <Text style={styles.secondaryInfoText}>{this.state.workflowType || "NA"}</Text>
            </View>
            <View style={styles.infoWrap}>
              <Text style={styles.infoHead}>WorkFlow Id : </Text>
            </View>
            <View style={styles.whiteInfoWrap}>
              <Text style={styles.secondaryInfoText}>{this.state.workflowId || "NA"}</Text>
            </View>
              {showCallLogs && <View style={styles.infoWrap}>
             <Text style={styles.infoHead}>Callback Logs: </Text>
            </View>}
            {showCallLogs && this.renderResponse(this.state.callbackLogs)}
            <View style={styles.infoWrap}>
              <Text style={styles.infoHead} >Event Logs: </Text>
            </View>
            {this.renderResponse(this.state.eventLogs || "NA")}
          </ScrollView>
          <TouchableOpacity onPress={this.hideModal} style={{justifyContent:'center',alignItems:'center',width:'100%',height:40,backgroundColor:'grey'}}>
            <Text style={{color:'white'}}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}
