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
            await AsyncStorage.clear();
            await AsyncStorage.setItem(item, selectedValue);
        } catch (error) {
            Alert.alert('in try catch : AsyncStorage error ' +  error.message );
            console.warn('AsyncStorage error: ' + error.message);
            Promise.reject('AsyncStorage error: ' + error.message);
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
  
        // AsyncStorage.clear().catch(() => {
        //     Alert.alert("caught AsyncStorage.clear");
        //    //Dont care. 
        // }).finally(() => {

        // })
        this.userSignInFetchCall();

    }

    userSignInFetchCall() {
        let urlToFetch = `${apiRoot}/${this.state.signup ? 'signup' : 'login'}`
        let requestOptions = {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: formData
        };
        return fetch(urlToFetch, requestOptions)
          .then( res => res.json())
          .then( responseData => {
            let userData = responseData.data && responseData.data[responseData.data.result_type];
            
            if( !userData ){
              Alert.alert("User not found");
              return ;
            }
  
            fetch(`${apiRoot}/users/current-user-salt`,
              {
                method: 'GET',
                credentials: 'include'
              }).then( res => res.json() )
              .then( responseData => {
                let userSalt = responseData.data && responseData.data.current_user_salt && responseData.data.current_user_salt.recovery_pin_salt ;
                
                if( !userSalt ){
                  Alert.alert("User slat not found");
                  return;
                }
                
                this.saveItem('user', JSON.stringify({
                  'user_details':userData,
                  'user_pin_salt': userSalt
                })).then(() => {
                    Actions.HomePage();    
                });
              });
            
          }).catch( e => {
          Alert.alert("Something went wrong" + JSON.stringify( e ));
        });
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
