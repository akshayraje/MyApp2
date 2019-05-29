import React, { Component } from 'react';
import styles from "../../Styles";
import { Text, TextInput, TouchableOpacity, ScrollView, View } from 'react-native';

export default class PerformQRAction extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      data: null
    };
  }

  render () {
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form} pointerEvents={this.props.isLoading ? 'none' : 'auto'}>
          <TextInput
            style={styles.inputBox}
            onChangeText={(data) => this.setState({data})}
            value={this.state.data}
            placeholder="Enter data"
            multiline={true}
          />
          <TouchableOpacity style={styles.buttonWrapper}
                            onPress={() => {this.props.onPerformQRAction( this.state.data )}}
          >
            <Text style={styles.buttonText}>{this.props.isLoading ? 'Submitting action...' : 'Perform QR Action'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
}
