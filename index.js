/**
 * @format
 */

import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import App from './App';
import Store from './src/store';
import { name as appName } from './app.json';

const RNApp = () => (
    <Provider store={Store}>
        <App />
    </Provider>
);

AppRegistry.registerComponent(appName, () => RNApp);
