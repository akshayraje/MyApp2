import React, { Component } from 'react';
import styles from "../../Styles";
import { Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';

export default class ActivateUser extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      pin: null
    };
  }

  render () {
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TextInput
          style={styles.inputBox}
          onChangeText={(pin) => this.setState({pin})}
          value={this.state.pin}
          placeholder="Enter Pin"
        />
        <TouchableOpacity style={styles.buttonWrapper}
                          onPress={() => {this.props.onActivateUser( this.state.pin )}}
        >
          <Text style={styles.buttonText}>{this.props.isLoading ? 'Activating User...' : 'Activate User'}</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}
