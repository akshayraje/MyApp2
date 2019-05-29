import { Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';

import OstWalletSdkCallbackImplementation from './OstWalletSdkCallbackImplementation';
import { setLoading } from '../actions';
import store from '../store';


class DeviceMnemonicsCallbackImplementation extends OstWalletSdkCallbackImplementation {
    constructor() {
        super();
    }

    flowComplete(ostWorkflowContext , ostContextEntity) {
        console.log('flowComplete', arguments);
        Alert.alert('Device Mnemonics', ostContextEntity.entity);
        if(Actions.currentScene !== "HomePage"){
          Actions.popTo("HomePage");
        }
        store.dispatch(setLoading(false));
    }

}

export default DeviceMnemonicsCallbackImplementation;
