import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import { setLoading } from '../actions';
import store from '../store';

import { OstWalletSdkUI } from '@ostdotcom/ost-wallet-sdk-react-native';
import { OstWalletUIWorkflowCallback } from '@ostdotcom/ost-wallet-sdk-react-native';

class BaseUIWorkflowCallback extends OstWalletUIWorkflowCallback {
    constructor(userId, getDisplayModel) {
        super();
        //NOTE: super class doesn't need any arguments.

        // Store the userId, this will help us in managing user.
        this.userId = userId;

        // getDisplayModel is method that shall give UI component to display result.
        // This is NOT part of SDK.
        this.getDisplayModel = getDisplayModel;
    }

    // Add your custom method to validate userId
    verifyUser() {
        return AsyncStorage.getItem('user').then((user) => {
            user = JSON.parse(user);
            if ( user && user.user_details ) {
                let currentUserOstUserId = user.user_details.user_id;
                if ( this.userId === currentUserOstUserId ) {
                    return true;
                }
            }
            return false;
        })
    }

    /** Get passphrase prefix associated with user,
     * from mappy application server
     * and provide it to the sdk.
     *
     * @param {String} userId - Id of user whose passphrase is required.
     * @param {Object} ostWorkflowContext - info about workflow type
     * @param {OstPassphrasePrefixAccept} setPassphrase - Set passhrase which received from server
     */
    getPassphrase(userId, ostWorkflowContext, OstPassphrasePrefixAccept) {

      this.verifyUser().then((isLoggedIn) =>{

        if ( !isLoggedIn ) {
          //Refuse to provide the passphrase prefix.
          OstPassphrasePrefixAccept.cancelFlow();
          return;
        }

        // Fetch the passphrase prefix from the Mappy Application server.
        return this.getPassphraseForCurrentUser().then((passphrase) =>{
          // provide passhrase to sdk.
          OstPassphrasePrefixAccept.setPassphrase(passphrase, userId);
        }).catch(() => {
          // If API call fails, cancel the workflow.
          OstPassphrasePrefixAccept.cancelFlow();
        });

      })

    }

    // The below method is just for the purpose of this demo.
    // Ideally, application will be subscribing to events from outside this class.
    setWorkflowInfo( workflowId ) {
      OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.requestAcknowledged,
        (ostWorkflowContext , ostContextEntity) => {
          this.onRequestAcknowledged(ostWorkflowContext, ostContextEntity);
        });

      OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowComplete,
        (ostWorkflowContext , ostContextEntity) => {
          this.onFlowComplete(ostWorkflowContext, ostContextEntity);
        });

      OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowInterrupt,
        (ostWorkflowContext , ostError) => {
          this.onFlowInterrupt(ostWorkflowContext, ostError);
        });

      this.workflowId = workflowId;
    }

    /**
    * Request acknowledged
    * @param {Object} ostWorkflowContext - info about workflow type
    * @param ostContextEntity - info about entity
    * @override
    */
    onRequestAcknowledged(ostWorkflowContext , ostContextEntity ) {
        this.verifyUser()
            .then((isLoggedIn) => {
                if ( !isLoggedIn ) {
                    // Ignore the call silently.
                    // You may choose to update data if needed.
                    return;
                }
                this.showRequestAcknowledged(ostWorkflowContext , ostContextEntity);
            });
    }

    /**
    * Flow complete
    * @param {String} workflowId - Workflow id
    * @param ostWorkflowContext - workflow type
    * @param ostContextEntity -  status of the flow
    * @override
    */
    onFlowComplete(ostWorkflowContext , ostContextEntity ) {
        this.verifyUser()
            .then((isLoggedIn) => {
                // Hide the loader.
                store.dispatch(setLoading(false));
                if ( !isLoggedIn ) {
                    // Ignore the call silently.
                    // You may choose to update data if needed.
                    return;
                }
                this.showFlowComplete(ostWorkflowContext , ostContextEntity);
            });
    }

    /**
    * Flow interrupt
    * @param {String} workflowId - Workflow id
    * @param ostWorkflowContext workflow type
    * @param ostError reason of interruption
    * @override
    */
    onFlowInterrupt(ostWorkflowContext , ostError)  {
        this.verifyUser()
            .then((isLoggedIn) => {
                // For this demo, show the error.
                this.showFlowInterrupt(ostWorkflowContext , ostError);

                // Hide the loader.
                store.dispatch(setLoading(false));
                if ( !isLoggedIn ) {
                    // Ignore the call silently.
                    // You may choose to update data if needed.
                    return;
                }

                if ( "WORKFLOW_CANCELLED" === ostError.getErrorCode() ) {
                    // Application Code has cancelled the workflow.
                    // It is safe to ignore this error.
                    // SDK shall never cancel workflow.
                } else if ( ostError.isApiError() ) {
                    // OstError is base error class.
                    // If this flag is true, we have received an object of OstApiError.
                    // OstApiError is derived from OstError.
                    // In javascript, you don't need to typecast, so we shall use the same object.

                    // Check if user's device is revoked.
                    if ( ostError.isApiSignerUnauthorized() ) {
                        // IMPORTANT: User's Device has been revoked.
                        // Application must logout the user in this case.
                        this.logoutUser();
                        return;
                    }

                    // API calls may fail if device's clock is out of sync.
                    if ( ostError.isDeviceTimeOutOfSync() ) {
                        //TODO: Tell the user to update the clock.
                    }
                } else if ("DEVICE_NOT_SETUP" == ostError.getErrorCode() ) {
                    // User's device is not set-up.
                    // IMPORTANT: User's Device has been revoked.
                    // Application must logout the user in this case.
                    this.logoutUser();
                    return;
                }

            });
    }







    showFlowComplete(ostWorkflowContext , ostContextEntity) {
        // Show the result.
        let workflowId = ostWorkflowContext.WORKFLOW_ID;
        this.workflowId = workflowId;
        this.workflowType = ostWorkflowContext.WORKFLOW_TYPE;
        this.logCallback("flowComplete callback received", "workflowId: " + workflowId, "ostWorkflowContext:", ostWorkflowContext, "ostContextEntity", ostContextEntity);
    }

    showRequestAcknowledged(ostWorkflowContext , ostContextEntity ) {
        let workflowId = ostWorkflowContext.WORKFLOW_ID;
        this.workflowType = ostWorkflowContext.WORKFLOW_TYPE;
        this.workflowId = workflowId;
        this.logCallback("requestAcknowledged callback received", "workflowId: " + workflowId, "ostWorkflowContext:", ostWorkflowContext, "ostContextEntity", ostContextEntity);
    }

    showFlowInterrupt(ostWorkflowContext , ostError)  {
        let workflowId = ostWorkflowContext.WORKFLOW_ID;
        this.workflowType = ostWorkflowContext.WORKFLOW_TYPE;
        this.workflowId = workflowId;
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

  logCallback(...args) {
    let d = new Date();
    let newLine = "\n";
    let dText = d.getDate() + "/" + d.getMonth() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ":" + d.getMilliseconds();

    let logTextArray = [];
    let cnt = 0, len = args.length;
    for(cnt = 0; cnt < len; cnt++) {
      let val = args[ cnt ];
      logTextArray.push( val );
    }
    let newLog = logTextArray;
    if ( this.eventLogs ) {
      this.eventLogs = this.eventLogs.concat(newLog);
    } else {
      this.eventLogs = newLog;
    }

    if ( this.getDisplayModel ) {
      let model = this.getDisplayModel()
      model && model.setState({
        callbackLogs: "",
        eventLogs: this.eventLogs,
        isShowing: true,
        workflowId: this.workflowId,
        workflowType: this.workflowType
      });
    }
    console.log("New callback log:\n",newLog);
  }

  // Add a custom method that can logout the user.
  logoutUser() {
      // You could use redux or eventemitter3 to publish
      // this message so that the user can be logged-out.
  }

  getPassphraseForCurrentUser() {

    return new Promise( (resolve, reject) => {
      AsyncStorage.getItem('user', (err, user) => {
        user = JSON.parse(user);
        console.log("user.user_pin_salt", user.user_pin_salt);
        resolve(user.user_pin_salt);
      });
    });

  }
}

export default BaseUIWorkflowCallback;
