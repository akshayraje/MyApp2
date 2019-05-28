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
        apiParams = apiParams.apiParams;
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

    getPin(res, ostPinAcceptInterface) {
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

    invalidPin(res, ostPinAcceptInterface) {
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

    pinValidated(res) {
        console.log('pinValidated', res);
    }

    flowComplete(res) {
        console.log('flowComplete', res);
          if(Actions.currentScene !== "HomePage"){
            Actions.popTo("HomePage");
          }
        if(res.ostWorkflowContext){
            let wfType = res.ostWorkflowContext.WORKFLOW_TYPE;
            if( wfType !== "SETUP_DEVICE") {
                Alert.alert(`${wfType} Complete!`);
            }
        }
        store.dispatch(setLoading(false));
    }

    flowInterrupt(res) {
        console.log('flowInterrupt', res);
        if (res.ostError) {
              let displayError = res.ostError.error_message,
              apiError;
            if(res.ostError.is_api_error){
                apiError = res.ostError.api_error && res.ostError.api_error.error_data[0].msg;
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
        console.log('requestAcknowledged', arguments);
    }

    verifyData(params, ostVerifyDataInterface) {
        console.log('verifyData', arguments);
        ostVerifyDataInterface.dataVerified();
    }
}

export default OstWalletSdkCallbackImplementation;
