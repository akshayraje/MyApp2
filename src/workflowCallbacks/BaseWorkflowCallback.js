import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import { setLoading } from '../actions';
import store from '../store';

import {OstWalletWorkFlowCallback} from '@ostdotcom/ost-wallet-sdk-react-native';
class BaseWorkflowCallback extends OstWalletWorkFlowCallback {
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

    // Add a custom method that can logout the user.
    logoutUser() {
        // You could use redux or eventemitter3 to publish 
        // this message so that the user can be logged-out.
    }


    registerDevice(apiParams, ostDeviceRegistered) {
        // By default, refuse to register the device.
        // Let the derived classes do the needed implementation.
        // Note: Derived classes should NOT call super.registerDevice().
        ostDeviceRegistered.cancelFlow();
    }

    getPin(ostWorkflowContext, userId,  ostPinAccept) {
        // Ask user to enter Pin.
        this.verifyUser()
            .then((isLoggedIn) => {
                if ( !isLoggedIn ) {
                    // Ignore the call silently.
                    // You may choose to update data if needed.
                    ostPinAccept.cancelFlow();
                    return;
                }
                // TBD: Show get pin UI and call ostPinAccept.pinEntered method.
            })
    }

    invalidPin(ostWorkflowContext, userId, ostPinAccept) {
        // User has entered invalid pin. Ask them to re-enter.

        this.verifyUser()
            .then((isLoggedIn) => {
                if ( !isLoggedIn ) {
                    // Ignore the call silently.
                    // You may choose to update data if needed.
                    ostPinAccept.cancelFlow();
                    return;
                }
                // TBD: Show get pin UI and call ostPinAccept.pinEntered method.
            });
    }

    pinValidated(ostWorkflowContext, userId ) {
        // User has entered valid pin, show user a loader
        // or clear the invalid pin error messages as needed.

        this.verifyUser()
            .then((isLoggedIn) => {
                if ( !isLoggedIn ) {
                    // Ignore the call silently.
                    // You may choose to update data if needed.
                    return;
                }
                // TBD: Clear any invalid-pin error messages.
                // Show loader to user.
                store.dispatch(setLoading(true));
            });
    }

    verifyData(ostWorkflowContext , ostContextEntity , ostVerifyData) {
        // User is being asked to verify data.
        // Today, this happens in Scan QR workflows.

        // By default, refuse to verify data.
        // Let the derived classes do the needed implementation.
        // Note: Derived classes should NOT call super.verifyData().
        ostVerifyData.cancelFlow();
    }

    /**
    * Request acknowledged
    * @param {Object} ostWorkflowContext - info about workflow type
    * @param ostContextEntity - info about entity
    * @override
    */
    requestAcknowledged(ostWorkflowContext , ostContextEntity ) {
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
    flowComplete(ostWorkflowContext , ostContextEntity ) {
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
    flowInterrupt(ostWorkflowContext , ostError)  {
        this.verifyUser()
            .then((isLoggedIn) => {
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

                // For this demo, show the error.
                this.showFlowInterrupt(ostWorkflowContext , ostError);
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

}

export default BaseWorkflowCallback;
