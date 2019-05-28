import React, { Component } from 'react';
import styles from "../../Styles";
import { Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';

export default class ResetPin extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      oldPin: null,
      newPin: null
    };
  }

  render () {
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TextInput
          style={styles.inputBox}
          onChangeText={(oldPin) => this.setState({oldPin})}
          value={this.state.oldPin}
          placeholder="Enter old pin"
        />
        <TextInput
          style={styles.inputBox}
          onChangeText={(newPin) => this.setState({newPin})}
          value={this.state.newPin}
          placeholder="Enter new pin"
        />
        <TouchableOpacity style={styles.buttonWrapper}
                          onPress={() => {this.props.onResetPin( this.state.oldPin, this.state.newPin  )}}
        >
          <Text style={styles.buttonText}>{this.props.isLoading ? 'Resetting...' : 'Reset'}</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}
