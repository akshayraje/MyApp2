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

    OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.requestAcknowledged, (ostWorkflowContext , ostContextEntity) => {
      let workflowId = ostWorkflowContext.WORKFLOW_ID;
      this.logEvent("requestAcknowledged event received", "workflowId: " + workflowId, "ostWorkflowContext:", ostWorkflowContext, "ostContextEntity", ostContextEntity);
    });
    OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowComplete, (ostWorkflowContext , ostContextEntity) => {
      let workflowId = ostWorkflowContext.WORKFLOW_ID;
      this.logEvent("flowComplete event received", "workflowId: " + workflowId, "ostWorkflowContext:", ostWorkflowContext, "ostContextEntity", ostContextEntity);
    });
    OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowInterrupt, (ostWorkflowContext , ostError) => {
      let workflowId = ostWorkflowContext.WORKFLOW_ID;
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
      logTextArray.push( val );
    }
    let newLog = logTextArray;
    if ( this.callbackLogs ) {
      this.callbackLogs = this.callbackLogs.concat(newLog);
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
      logTextArray.push(val);
    }
    let newLog = logTextArray;
    if ( this.eventLogs ) {
      this.eventLogs = this.eventLogs.concat(newLog);
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

  requestAcknowledged(ostWorkflowContext , ostContextEntity ) {
    let workflowId = ostWorkflowContext.WORKFLOW_ID;
    this.logCallback("requestAcknowledged callback received", "workflowId: " + workflowId, "ostWorkflowContext:", ostWorkflowContext, "ostContextEntity", ostContextEntity);
  }

  /**
   * Flow complete
   * @param {String} workflowId - Workflow id
   * @param ostWorkflowContext - workflow type
   * @param ostContextEntity -  status of the flow
   * @override
   */
  flowComplete(ostWorkflowContext , ostContextEntity ) {
    let workflowId = ostWorkflowContext.WORKFLOW_ID;
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
  flowInterrupt(ostWorkflowContext , ostError)  {
    let workflowId = ostWorkflowContext.WORKFLOW_ID;
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
    if(ostError.isApiError()) {

      apiError = ostError.getApiErrorMessage();
        console.log("ost c1 apiError", apiError);
      if(apiError && apiError.includes('err.error_data')){
          console.log("ost c1.t");
        apiError = '';
      }
      errorData = ostError.getApiErrorData();
        console.log("ost c2", errorData);
      if(errorData && errorData.length > 0){
          console.log("ost c2.T");
        for(let i=0; i<errorData.length;i++){
          apiError = apiError + errorData[i].msg;
        }
      }
        console.log("c3");
      displayError = displayError+apiError;
    }
    return [displayError, "OstError Object:", ostError.error];
  }


}

export default OstWalletSdkUICallbackImplementation;
