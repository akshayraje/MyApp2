import React, { Component } from 'react';
import styles from "../../Styles";
import { Text, TextInput, TouchableOpacity, ScrollView, Picker } from 'react-native';
import {apiRoot} from "../../helpers";

export default class AbortDeviceRecovery extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      deviceAddress: null,
      deviceAddresses: [],
      pin: null
    };
    this.getDevices= this.getDevices.bind(this);
  }

  componentDidMount() {
    this.getDevices();
  }

  getDevices(){
    let devices = [];
    fetch(`${apiRoot}/devices`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => response.json())
      .then((responseData) => {
        if(responseData.data) {
          devices = responseData.data.devices;
          if( devices.length > 0 ){
            console.log(devices);
            this.setState({
              deviceAddresses: devices
            })
          }
        }
      })
      .catch(console.warn)
      .done();
  }

  render () {
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Picker
          selectedValue={this.props.deviceAddress}
          style={styles.selectBox}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({deviceAddress: itemValue})
          }>
          {this.state.deviceAddresses.map((device, index) => {
            return <Picker.Item key={index} label={device.address} value={device.address} />
          })}
        </Picker>
        <TextInput
          style={styles.inputBox}
          onChangeText={(pin) => this.setState({pin})}
          value={this.state.pin}
          placeholder="Enter pin"
        />
        <TouchableOpacity style={styles.buttonWrapper}
                          onPress={() => {this.props.onAbortDeviceRecovery( this.state.pin  )}}
        >
          <Text style={styles.buttonText}>{this.props.isLoading ? 'Aborting...' : 'Abort Device Recovery'}</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}
