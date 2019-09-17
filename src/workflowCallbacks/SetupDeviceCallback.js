import { apiRoot } from '../helpers'; //Mappy Server API End Point
import FormData from 'form-data'; // Utility to post data to Mappy Server.
import BaseWorkflowCallback from './BaseWorkflowCallback';

class SetupDeviceCallback extends BaseWorkflowCallback {
    constructor( userId, getDisplayModel ) {
      super(userId, getDisplayModel);
    }

    registerDevice(apiParams, ostDeviceRegistered) {
        // Today, this callback is only called for setup device workflow.
        console.log('registerDevice:');
        console.log('- apiParams:\n', JSON.stringify(apiParams, null, 2) );

        const formData = new FormData();
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
}

export default SetupDeviceCallback;
