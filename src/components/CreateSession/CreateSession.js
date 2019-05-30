import React, { Component } from 'react';
import styles from "../../Styles";
import { Text, TextInput, TouchableOpacity, ScrollView, View } from 'react-native';

export default class CreateSession extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      spendingLimit: null,
      expiryInDays: null
    };
  }

  render () {
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form} pointerEvents={this.props.isLoading ? 'none' : 'auto'}>
          <TextInput
            style={styles.inputBox}
            onChangeText={(spendingLimit) => this.setState({spendingLimit})}
            value={this.state.spendingLimit}
            placeholder="Enter Spending Limit(in atto)"
          />
          <TextInput
            style={styles.inputBox}
            onChangeText={(expiryInDays) => this.setState({expiryInDays})}
            value={this.state.expiryInDays}
            placeholder="Enter Expiry(in Days)"
          />
          <TouchableOpacity style={styles.buttonWrapper}
                            onPress={() => {this.props.onAddSession( this.state.spendingLimit, this.state.expiryInDays  )}}
          >
            <Text style={styles.buttonText}>{this.props.isLoading ? 'Creating Session...' : 'Create Session'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
}
