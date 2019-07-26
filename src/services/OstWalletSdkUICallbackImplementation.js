import { OstWalletUIWorkflowCallback } from '@ostdotcom/ost-wallet-sdk-react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {setLoading} from "../actions";
import store from "../store";
import { Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';

class OstWalletSdkUICallbackImplementation extends OstWalletUIWorkflowCallback {
  constructor() {
    super();
  }

  getPassphrase(userId, ostWorkflowContext, OstPassphrasePrefixAccept) {
    AsyncStorage.getItem('user', (err, user) => {
      user = JSON.parse(user);

      OstPassphrasePrefixAccept.setPassphrase(user.user_pin_salt, user.user_details.user_id,  (error) => {
        console.warn(error);
      });
    });
  }

  requestAcknowledged(workflowId, ostWorkflowContext , ostContextEntity ) {
    console.log('requestAcknowledged ostWorkflowContext', ostWorkflowContext , "ostContextEntity" , ostContextEntity );
    // Alert.alert('Request Acknowledged',JSON.stringify(ostError, null, 2));
  }

  /**
   * Flow complete
   * @param {String} workflowId - Workflow id
   * @param ostWorkflowContext - workflow type
   * @param ostContextEntity -  status of the flow
   * @override
   */
  flowComplete(workflowId, ostWorkflowContext , ostContextEntity ) {
    console.log('flowComplete ostWorkflowContext', ostWorkflowContext , "ostContextEntity" , ostContextEntity );
    if(ostWorkflowContext){
      let wfType = ostWorkflowContext.WORKFLOW_TYPE;
      if( wfType !== "SETUP_DEVICE") {
        Alert.alert(`${wfType} Complete!`);
      }
    }
    store.dispatch(setLoading(false));
  }

  /**
   * Flow interrupt
   * @param {String} workflowId - Workflow id
   * @param ostWorkflowContext workflow type
   * @param ostError reason of interruption
   * @override
   */
  flowInterrupt(workflowId, ostWorkflowContext , ostError)  {
    console.log('flowInterrupt ostWorkflowContext', ostWorkflowContext , "ostError" , ostError );
    if (ostError) {
      let displayError = ostError.getErrorMessage(),
        apiError, errorData;
      if(ostError.isApiError()){
        apiError = ostError.getApiErrorMessage();
        if(apiError && apiError.includes('err.error_data')){
          apiError = '';
        }
        errorData = ostError.getApiErrorData();
        if(errorData && errorData.length > 0){
          for(let i=0; i<errorData.length;i++){
            apiError = apiError + errorData[i].msg;
          }
        }
        displayError = displayError+apiError;
      }
      // Alert.alert('Error', displayError + "\nError Code : "+ostError.getErrorCode());
      setTimeout(function(){ Alert.alert('Error',JSON.stringify(ostError, null, 2)); }, 500);
    }
    if(Actions.currentScene !== "HomePage"){
      Actions.popTo("HomePage");
    }
    store.dispatch(setLoading(false));
  }


}

export default OstWalletSdkUICallbackImplementation;