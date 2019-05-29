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

    getPin(ostWorkflowContext, userId,  ostPinAcceptInterface) {
        AsyncStorage.getItem('user', (err, user) => {
            user = JSON.parse(user);
            Actions.GetPin({
                onGetPin: ostPinAcceptInterface.pinEntered.bind(ostPinAcceptInterface),
                userId: user.user_id,
                userPinSalt: user.user_pin_salt,
                errorHandler: console.warn
            });
        });
    }

    invalidPin(ostWorkflowContext, userId, ostPinAcceptInterface) {
        AsyncStorage.getItem('user', (err, user) => {
            user = JSON.parse(user);
            Actions.GetPin({
                onGetPin: ostPinAcceptInterface.pinEntered.bind(ostPinAcceptInterface),
                userId: user.user_id,
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
              let displayError = ostError.error_message,
              apiError;
            if(ostError.is_api_error){
                apiError = ostError.api_error && ostError.api_error.error_data[0].msg;
                displayError = displayError+apiError;
            }
            Alert.alert('Error!', displayError);
        }
          if(Actions.currentScene !== "HomePage"){
            Actions.popTo("HomePage");
          }
        store.dispatch(setLoading(false));
    }

    requestAcknowledged(ostWorkflowContext, ostContextEntity) {
        console.log('requestAcknowledged ostWorkflowContext', ostWorkflowContext , "ostContextEntity- ", ostContextEntity );
    }

    verifyData(ostWorkflowContext , ostContextEntity , ostVerifyDataInterface) {
        console.log('verifyData ostWorkflowContext', ostWorkflowContext , "ostContextEntity" , ostContextEntity );
        ostVerifyDataInterface.dataVerified();
    }
}

export default OstWalletSdkCallbackImplementation;
