import FormData from 'form-data';
import { Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import {OstWalletWorkFlowCallback} from 'ost-wallet-sdk-react-native';

import { apiRoot } from '../helpers';
import AsyncStorage from '@react-native-community/async-storage';
import { setLoading } from '../actions';
import store from '../store';

const formData = new FormData();

class OstWalletSdkCallbackImplementation extends OstWalletWorkFlowCallback {
    constructor() {
        super();
    }

    registerDevice(apiParams, ostDeviceRegistered) {
        console.log('registerDevice apiParams', apiParams, ostDeviceRegistered);
        formData.append('address', apiParams.address || apiParams.device.address);
        formData.append('api_signer_address', apiParams.api_signer_address || apiParams.device.api_signer_address);
        fetch(`${apiRoot}/devices`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: formData
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.data) {
                    console.log('data to send:', responseData.data[responseData.data.result_type]);
                    ostDeviceRegistered.deviceRegistered(responseData.data[responseData.data.result_type], (error) => {
                        console.warn(error);
                    });
                }
            })
            .catch(console.warn)
            .done();
    }

    getPin(ostWorkflowContext, userId,  ostPinAccept) {
        AsyncStorage.getItem('user', (err, user) => {
            user = JSON.parse(user);
            Actions.GetPin({
                onGetPin: ostPinAccept.pinEntered.bind(ostPinAccept),
                onCancel: ostPinAccept.cancelFlow.bind(ostPinAccept), //custom handler to handle hardware back press
                onBack: ostPinAccept.cancelFlow.bind(ostPinAccept), //handler given by router api to handle back arrow
                userId: user.user_details.user_id,
                userPinSalt: user.user_pin_salt,
                errorHandler: console.warn
            });
        });
    }

    invalidPin(ostWorkflowContext, userId, ostPinAccept) {
        AsyncStorage.getItem('user', (err, user) => {
            user = JSON.parse(user);
            Actions.GetPin({
                onGetPin: ostPinAccept.pinEntered.bind(ostPinAccept),
                onCancel: ostPinAccept.cancelFlow.bind(ostPinAccept), //custom handler to handle hardware back press
                onBack: ostPinAccept.cancelFlow.bind(ostPinAccept), //handler given by router api to handle back arrow
                userId: user.user_details.user_id,
                userPinSalt: user.user_pin_salt,
                errorHandler: console.warn
            });
        });
    }

    pinValidated(ostWorkflowContext, userId ) {
        console.log('pinValidated', ostWorkflowContext ,"userid--" ,  userId );
    }

    flowComplete(ostWorkflowContext , ostContextEntity) {
        console.log('flowComplete ostWorkflowContext', ostWorkflowContext,  "ostContextEntity- ", ostContextEntity);
          if(Actions.currentScene !== "HomePage"){
            Actions.popTo("HomePage");
          }
        if(ostWorkflowContext){
            let wfType = ostWorkflowContext.WORKFLOW_TYPE;
            if( wfType !== "SETUP_DEVICE") {
                Alert.alert(`${wfType} Complete!`);
            }
        }
        store.dispatch(setLoading(false));
    }

    flowInterrupt(ostWorkflowContext , ostError) {
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
            Alert.alert('Error!', displayError);
        }
          if(Actions.currentScene !== "HomePage"){
            Actions.popTo("HomePage");
          }
        store.dispatch(setLoading(false));
      if(ostError.isApiError()) {
        console.log("getApiError", ostError.getApiError());
        console.log("getApiInternalId", ostError.getApiInternalId());
        console.log("getApiErrorCode", ostError.getApiErrorCode());
        console.log("getApiErrorData", ostError.getApiErrorData());
        console.log("getApiErrorMessage", ostError.getApiErrorMessage());
        console.log("isBadRequest", ostError.isBadRequest());
        console.log("isNotFound", ostError.isNotFound());
        console.log("isDeviceTimeOutOfSync", ostError.isDeviceTimeOutOfSync());
        console.log("isApiSignerUnauthorized", ostError.isApiSignerUnauthorized());
        console.log("isErrorParameterKey", ostError.isErrorParameterKey("new_recovery_owner_address"));
      }
      console.log("getErrorCode",ostError.getErrorCode());
      console.log("getInternalErrorCode",ostError.getInternalErrorCode());
      console.log("getErrorMessage",ostError.getErrorMessage());
      console.log("getErrorInfo",ostError.getErrorInfo());
      console.log("isApiError",ostError.isApiError());
    }

    requestAcknowledged(ostWorkflowContext, ostContextEntity) {
        console.log('requestAcknowledged ostWorkflowContext', ostWorkflowContext , "ostContextEntity- ", ostContextEntity );
    }

    verifyData(ostWorkflowContext , ostContextEntity , ostVerifyData) {
        console.log('verifyData ostWorkflowContext', ostWorkflowContext , "ostContextEntity" , ostContextEntity );
        ostVerifyData.dataVerified();
    }
}

export default OstWalletSdkCallbackImplementation;
