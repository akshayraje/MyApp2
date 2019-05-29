import React, { Component } from 'react';
import styles from "../../Styles";
import { Text, TextInput, TouchableOpacity, ScrollView, View } from 'react-native';

export default class AuthorizeDevice extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      passphrase: null
    };
  }

  render () {
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form} pointerEvents={this.props.isLoading ? 'none' : 'auto'}>
          <TextInput
            style={styles.inputBox}
            onChangeText={(passphrase) => this.setState({passphrase})}
            value={this.state.passphrase}
            placeholder="Enter passphrase"
          />
          <TouchableOpacity style={styles.buttonWrapper}
                            onPress={() => {this.props.onAuthorizeCurrentDeviceWithMnemonics( this.state.passphrase )}}
          >
            <Text style={styles.buttonText}>{this.props.isLoading ? 'Authorizing...' : 'Authorize Device'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
}
