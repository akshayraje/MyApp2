import React, { Component } from 'react';
import styles from "../../Styles";
import BalanceAndPricePoints from "./BalanceAndPricePoints";
import { Text, TextInput, TouchableOpacity, ScrollView, View } from 'react-native';

export default class ExecuteTransaction extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      addresses: null,
      amounts: null,
      ruleName: null
    };
  }

  render () {
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form} pointerEvents={this.props.isLoading ? 'none' : 'auto'}>
          <TextInput
            style={styles.inputBox}
            onChangeText={(addresses) => this.setState({addresses})}
            value={this.state.addresses}
            placeholder="Enter addresses"
          />
          <TextInput
            style={styles.inputBox}
            onChangeText={(amounts) => this.setState({amounts})}
            value={this.state.amounts}
            placeholder="Enter amounts"
          />
          <TextInput
            style={styles.inputBox}
            onChangeText={(ruleName) => this.setState({ruleName})}
            value={this.state.ruleName}
            placeholder="Enter rule name"
          />
          <TouchableOpacity style={styles.buttonWrapper}
                            onPress={() => {this.props.onExecuteTransaction( this.state.addresses, this.state.amounts, this.state.ruleName )}}
          >
            <Text style={styles.buttonText}>{this.props.isLoading ? 'Executing...' : 'Execute Transactions'}</Text>
          </TouchableOpacity>
        </View>
          <BalanceAndPricePoints />
      </ScrollView>
    )
  }
}
