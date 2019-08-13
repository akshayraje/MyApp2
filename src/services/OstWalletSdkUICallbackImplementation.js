import { OstWalletUIWorkflowCallback } from '@ostdotcom/ost-wallet-sdk-react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {setLoading} from "../actions";
import store from "../store";
import { Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import {OstWalletSdkUI} from '@ostdotcom/ost-wallet-sdk-react-native';

class OstWalletSdkUICallbackImplementation extends OstWalletUIWorkflowCallback {
  constructor( wsModel ) {
    super();
    this.wsModel = wsModel;
    this.callbackLogs = "";
    this.eventLogs = "";
  }

  getPassphrase(userId, ostWorkflowContext, OstPassphrasePrefixAccept) {
    AsyncStorage.getItem('user', (err, user) => {
      user = JSON.parse(user);

      OstPassphrasePrefixAccept.setPassphrase(user.user_pin_salt, user.user_details.user_id,  (error) => {
        console.warn(error);
      });
    });
  }

  setWorkflowInfo( workflowId, workflowType ) {
    this.workflowId = workflowId;
    this.workflowType = workflowType;
    this.callbackLogs = "";
    this.eventLogs = "";
    console.log("OstWalletSdkUI.activateUser workflowId:", workflowId);

    OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.requestAcknowledged, (workflowId, ostWorkflowContext , ostContextEntity) => {
      this.logEvent("requestAcknowledged event received", "workflowId: " + workflowId, "ostWorkflowContext:", ostWorkflowContext, "ostContextEntity", ostContextEntity);
    });
    OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowComplete, (workflowId, ostWorkflowContext , ostContextEntity) => {
      this.logEvent("flowComplete event received", "workflowId: " + workflowId, "ostWorkflowContext:", ostWorkflowContext, "ostContextEntity", ostContextEntity);
    });
    OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowInterrupt, (workflowId, ostWorkflowContext , ostError) => {
      this.logEvent("flowInterrupt event received", 
        "workflowId: " + workflowId, 
        "ostWorkflowContext:", 
        ostWorkflowContext, 
        "ostError", 
        this.formatOstError(ostError) 
      );
    });
  }

  logCallback(...args) {
    let d = new Date();
    let newLine = "\n";
    let dText = d.getDate() + "/" + d.getMonth() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ":" + d.getMilliseconds();

    let logTextArray = ["---[CallbackLog]" + this.workflowId + "---", dText];
    let cnt = 0, len = args.length;
    for(cnt = 0; cnt < len; cnt++) {
      let val = args[ cnt ];
      if ( typeof val === 'object') {
        logTextArray.push( JSON.stringify(val, null ,1) );
      } else {
        logTextArray.push(val);
      }
    }
    let newLog = logTextArray.join(newLine);
    if ( this.callbackLogs ) {
      this.callbackLogs = this.callbackLogs + newLine + newLog;
    } else {
      this.callbackLogs = newLog;
    }

    if ( this.wsModel ) {
      this.wsModel.setState({
        callbackLogs: this.callbackLogs,
        eventLogs: this.eventLogs,
        isShowing: true,
        workflowId: this.workflowId,
        workflowType: this.workflowType
      });
    }
    console.log("New callback log:\n",newLog);
  }

  logEvent(...args) {
    let d = new Date();
    let newLine = "\n";
    let dText = d.getDate() + "/" + d.getMonth() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ":" + d.getMilliseconds();

    let logTextArray = ["---[EventLog]" + this.workflowId + "---", dText];
    let cnt = 0, len = args.length;
    for(cnt = 0; cnt < len; cnt++) {
      let val = args[ cnt ];
      if ( typeof val === 'object') {
        logTextArray.push( JSON.stringify(val, null ,1) );
      } else {
        logTextArray.push(val);
      }
    }
    let newLog = logTextArray.join(newLine);
    if ( this.eventLogs ) {
      this.eventLogs = this.eventLogs + newLine + newLog;
    } else {
      this.eventLogs = newLog;
    }
    
    if ( this.wsModel ) {
      this.wsModel.setState({
        callbackLogs: this.callbackLogs,
        eventLogs: this.eventLogs,
        isShowing: true,
        workflowId: this.workflowId,
        workflowType: this.workflowType
      });
    }
    console.log("New event log:\n", newLog);
  }

  requestAcknowledged(workflowId, ostWorkflowContext , ostContextEntity ) {
    this.logCallback("requestAcknowledged callback received", "workflowId: " + workflowId, "ostWorkflowContext:", ostWorkflowContext, "ostContextEntity", ostContextEntity);
  }

  /**
   * Flow complete
   * @param {String} workflowId - Workflow id
   * @param ostWorkflowContext - workflow type
   * @param ostContextEntity -  status of the flow
   * @override
   */
  flowComplete(workflowId, ostWorkflowContext , ostContextEntity ) {
    this.logCallback("flowComplete callback received", "workflowId: " + workflowId, "ostWorkflowContext:", ostWorkflowContext, "ostContextEntity", ostContextEntity);
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
    this.logCallback("flowInterrupt callback received", 
        "workflowId: " + workflowId, 
        "ostWorkflowContext:", 
        ostWorkflowContext, 
        "ostError", 
        this.formatOstError(ostError)
    );
    if(Actions.currentScene !== "HomePage"){
      Actions.popTo("HomePage");
    }
    store.dispatch(setLoading(false));
  }

  formatOstError(ostError) {
    let displayError = ostError.getErrorMessage(), apiError, errorData;
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
    return displayError + "\n OstError Object: \n" + JSON.stringify(ostError, null, 2);
  }


}

export default OstWalletSdkUICallbackImplementation;