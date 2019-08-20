import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
  buttonTextSm: {
    fontSize: 12,
    padding: 8,
    textAlign: 'center'
  },
  buttonText: {
    fontSize: 16,
    padding: 10,
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: 'bold'
  },
  buttonWrapper: {
    backgroundColor:'#007bff',
    marginBottom: 10,
    width: '100%',
    borderRadius: 10
  },
  buttonInfoWrapper: {
    backgroundColor:'#17a2b8',
    marginBottom: 10,
    width: '100%',
    borderRadius: 10
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  scrollContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor:'#ffffff',
  },
  form: {
    width: 300
  },
  image: {
    margin: 10
  },
  inputText: {
    borderColor: '#D3D3D3',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10
  },
  title: {
    fontSize: 24,
    margin: 10,
    textAlign: 'center'
  },
  dialogInput: {
    backgroundColor: '#e8e8e8',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  inputBox:{
    width: '100%',
    borderColor: '#D3D3D3',
    borderWidth: 1,
    marginBottom: 30,
    padding: 10
  },
  selectBox:{
    width: '100%',
    borderColor: '#D3D3D3',
    borderWidth: 1,
    marginBottom: 30,
    padding: 10
  },
  qrCode:{
    width: 150,
    height: 150,
    margin: 20
  },
  buttonRetryText: {
    color:'#eeeeee', 
    fontSize: 12
  },
  buttonRetryWrapper: {
    justifyContent:'center',
    alignItems:'center', 
    padding: 10, 
    backgroundColor:'#007bff', 
    borderBottomWidth: 1, 
    position:'absolute', 
    bottom:-50, 
    right:0, 
    zIndex:1
  },
  infoWrap: {
    flexDirection:'row', 
    marginTop:10, 
    position:'relative'
  },
  infoText: {
    fontSize:12, 
    marginRight: 10
  },
  logs: {
    flexDirection:'row', 
    marginTop:10, 
    padding: 10, 
    backgroundColor: '#eeeeee',
    borderWidth: 1,
    borderColor: "#333333"
  }

});
