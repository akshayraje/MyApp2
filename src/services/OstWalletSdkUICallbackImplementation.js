import { OstWalletUIWorkflowCallback } from '@ostdotcom/ost-wallet-sdk-react-native';
import AsyncStorage from '@react-native-community/async-storage';

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
}

export default OstWalletSdkUICallbackImplementation;