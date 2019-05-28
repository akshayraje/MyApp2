import { Actions } from 'react-native-router-flux';

import OstWalletSdkCallbackImplementation from './OstWalletSdkCallbackImplementation';
import { setLoading } from '../actions';
import store from '../store';
import AsyncStorage from "@react-native-community/async-storage";
import {apiRoot} from "../helpers";


class ActivateUserCallbackImplementation extends OstWalletSdkCallbackImplementation {
  constructor() {
    super();
  }

  flowComplete(res) {
    console.log('flowComplete', res);
    AsyncStorage.getItem('user').then((user) => {
      user = JSON.parse(user);
      if(user.status === 'CREATED'){
        fetch(
          `${apiRoot}/notify/user-activate`,
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
          .then((response) => response.json())
          .then((responseData) => {
            console.log('user-activate responseData:', responseData);
          })
          .catch(console.warn)
          .done();
      }
    });
    if(Actions.currentScene !== "HomePage"){
      Actions.popTo("HomePage");
    }
    store.dispatch(setLoading(false));
  }

}

export default ActivateUserCallbackImplementation;
