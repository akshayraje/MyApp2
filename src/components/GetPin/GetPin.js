import React, { Component } from 'react';
import styles from '../../Styles';
import { Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';

export default class GetPin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pin: null
        };
        this.props.dispatchLoadingState(false);
    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <TextInput
                    style={styles.inputBox}
                    onChangeText={(pin) => this.setState({ pin })}
                    value={this.state.pin}
                    placeholder="Enter pin"
                />
                <TouchableOpacity
                    style={styles.buttonWrapper}
                    onPress={() => {
                      this.props.dispatchLoadingState(true);
                        this.props.onGetPin(
                            this.props.userId,
                            this.state.pin,
                            this.props.userPinSalt,
                            this.props.errorHandler
                        );
                    }}
                >
                    <Text style={styles.buttonText}>{this.props.isLoading ? 'Authenticating...' : 'Authenticate'}</Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }
}
