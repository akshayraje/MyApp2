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
        fetch(
            `${apiRoot}/${this.state.signup ? 'signup' : 'login'}`,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                body: formData
            }
        )
            .then((response) => response.json())
            .then((responseData) => {
                console.log('Signin responseData:', responseData);
                if (responseData.success && responseData.data) {
                    this.saveItem('user', JSON.stringify(responseData.data[responseData.data.result_type]));
                    Actions.HomePage();
                } else {
                    Alert.alert(responseData.msg);
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
