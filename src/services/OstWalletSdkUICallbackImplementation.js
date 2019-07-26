import FormData from 'form-data';
import { Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import {OstWalletUIWorkflowCallback} from '@ostdotcom/ost-wallet-sdk-react-native';

import { apiRoot } from '../helpers';
import AsyncStorage from '@react-native-community/async-storage';
import { setLoading } from '../actions';
import store from '../store';
import OstWalletSdkCallbackImplementation from "./OstWalletSdkCallbackImplementation";

const formData = new FormData();

class OstWalletSdkUICallbackImplementation extends OstWalletUIWorkflowCallback {
  constructor() {
    super();
  }

  getPassphrase(userId, ostWorkflowContext, OstPassphrasePrefixAccept) {
    AsyncStorage.getItem('user', (err, user) => {
      user = JSON.parse(user);

      OstPassphrasePrefixAccept.setPassphrasePrefix(user.user_pin_salt, user.user_details.user_id,  (error) => {
        console.warn(error);
      });
    });
  }
}

export default OstWalletSdkUICallbackImplementation;