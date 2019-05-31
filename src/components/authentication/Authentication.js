import React, { Component } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';
import FormData from 'form-data';

import AppData from '../../../app.json';
import styles from '../../Styles';
import {apiRoot} from '../../helpers';

const formData = new FormData();

class Authentication extends Component {
    constructor() {
        super();
        this.state = {
            fullname: null,
            username: null,
            password: null,
            signup: false
        };
    }

    async saveItem(item, selectedValue) {
        try {
            await AsyncStorage.setItem(item, selectedValue);
        } catch (error) {
            console.warn('AsyncStorage error: ' + error.message);
        }
    }

    userSignin() {
        if (!this.state.username || !this.state.password) {
            Alert.alert('All fields are mandatory');
            return;
        }
        if (this.state.signup && !this.state.fullname) {
            Alert.alert('All fields are mandatory');
            return;
        }
        formData.append('username', this.state.username);
        formData.append('password', this.state.password);
        this.state.signup && formData.append('fullname', this.state.fullname);

        let getUserSaltPromise = fetch(`${apiRoot}/users/current-user-salt`,
          {
            method: 'GET',
            credentials: 'include'
          });
        let authPromise = fetch(
            `${apiRoot}/${this.state.signup ? 'signup' : 'login'}`,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                body: formData
            });
        Promise.all([getUserSaltPromise, authPromise])
          .then((responses) => Promise.all(responses.map(res => res.json())))
          .then((responseData) => {
            console.log('current_user_salt:', responseData[0]);
            console.log('Signin responseData:', responseData[1]);
            if (responseData[1].success && responseData[1].data && responseData[0].success && responseData[0].data) {
              this.saveItem('user', JSON.stringify({
                'user_details':responseData[1].data[responseData[1].data.result_type],
                'user_pin_salt': responseData[0].data.current_user_salt && responseData[0].data.current_user_salt.recovery_pin_salt
              }));
              Actions.HomePage();
            } else {
              Alert.alert(responseData[1].msg, responseData[0].msg);
            }
          })
          .catch(console.warn)
          .done();

    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>React Native {'\n'}OST Wallet SDK ({AppData.TOKEN_ID})</Text>
                <View style={styles.form}>
                    {this.state.signup && (
                        <TextInput
                            editable={true}
                            onChangeText={(fullname) => this.setState({ fullname })}
                            placeholder="Full Name"
                            ref="fullname"
                            returnKeyType="next"
                            style={styles.inputText}
                            value={this.state.fullname}
                        />
                    )}

                    <TextInput
                        editable={true}
                        onChangeText={(username) => this.setState({ username })}
                        placeholder="Username"
                        ref="username"
                        returnKeyType="next"
                        style={styles.inputText}
                        value={this.state.username}
                    />

                    <TextInput
                        editable={true}
                        onChangeText={(password) => this.setState({ password })}
                        placeholder="Password"
                        ref="password"
                        returnKeyType="next"
                        secureTextEntry={true}
                        style={styles.inputText}
                        value={this.state.password}
                    />

                    {!this.state.signup && (
                        <React.Fragment>
                            <TouchableOpacity style={styles.buttonWrapper} onPress={this.userSignin.bind(this)}>
                                <Text style={styles.buttonText}> Log In </Text>
                            </TouchableOpacity>
                            <Text style={styles.buttonTextSm} onPress={() => this.setState({ signup: true })}>
                                Sign Up
                            </Text>
                        </React.Fragment>
                    )}

                    {this.state.signup && (
                        <React.Fragment>
                            <TouchableOpacity style={styles.buttonWrapper} onPress={this.userSignin.bind(this)}>
                                <Text style={styles.buttonText}> Sign Up </Text>
                            </TouchableOpacity>
                            <Text style={styles.buttonTextSm} onPress={() => this.setState({ signup: false })}>
                                Log In
                            </Text>
                        </React.Fragment>
                    )}
                </View>
            </View>
        );
    }
}

export default Authentication;
