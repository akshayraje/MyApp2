import React,{Component } from 'react';
import {View, Modal, Text, ScrollView,TouchableOpacity} from 'react-native';

export default class WorkflowStatus extends Component {
  constructor(props){
    props = props || {};
    super(props)
    this.state ={
      isShowing : false
    }
  }

  hideModal = () =>{
    this.setState({
      isShowing : false
    });
  }

  render(){
    return(
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.isShowing}
      >
        <View style={{flexDirection:'column',padding:10,flex:1,justifyContent: 'space-between'}}>
          <ScrollView style={{marginTop: 50, borderWidth:1, padding:5}}>
            <View style={{flexDirection:'row', marginTop:10}}>
              <Text style={{fontSize:14}}>WorkFlow Type :</Text>
            </View>
            <View style={{flexDirection:'row', marginTop:10}}>
              <Text style={{fontSize:12}}>{this.state.workflowType || "NA"}</Text>
            </View>
            <View style={{flexDirection:'row', marginTop:10}}>
              <Text style={{fontSize:14}}>WorkFlow Id : </Text>
            </View>
            <View style={{flexDirection:'row', marginTop:10}}>
              <Text style={{fontSize:12}}>{this.state.workflowId || "NA"}</Text>
            </View>
            <View style={{flexDirection:'row'}}>
              <Text style={{fontSize:14,marginTop:10}}>Callback Logs: </Text>
            </View>
            <View style={{flexDirection:'row', marginTop:10, padding: 10, backgroundColor: '#eeeeee'}}> 
                <Text>{this.state.callbackLogs || "NA"}</Text>
            </View>
            <View style={{flexDirection:'row', marginTop:10}}>
              <Text style={{fontSize:14}} >Event Logs: </Text>
            </View>
            <View style={{flexDirection:'row', marginTop:10, padding: 10, backgroundColor: '#eeeeee'}}> 
              <Text>{this.state.eventLogs || "NA"}</Text>
            </View>
          </ScrollView>
          <TouchableOpacity onPress={this.hideModal} style={{justifyContent:'center',alignItems:'center',width:'100%',height:40,backgroundColor:'grey'}}>
            <Text style={{color:'white'}}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}