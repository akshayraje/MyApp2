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
  getAddDeviceQRCode: {
    padding: 10,
    width: "100%",
    aspectRatio: 1
  },
  infoWrap: {
    flexDirection:'row',
    position:'relative',
    backgroundColor:'#d1ecf1',
    minHeight: 30,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: 5
  },
  infoHead: {
    flex: 4,
    padding: 10,
    fontSize:14,
    fontWeight: 'bold',
    color: "#0c5460",
    marginRight: 80
  },
  infoText: {
    fontSize:12,
    marginLeft: 10,
    marginRight: 80,
    color: "#0c5460",
  },
  buttonRetryText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonRetryWrapper: {
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#007bff',
    width: 70,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    paddingLeft: 10,
    paddingRight: 10
  },
  secondaryInfoWrap: {
    flexDirection:'row',
    position:'relative',
    backgroundColor:'#e2e3e5',
    minHeight: 30,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  secondaryInfoText: {
    color: "#383d41",
    flex: 4,
    padding: 10,
    fontSize:14
  },
  logs: {
    flexDirection:'row',
    marginTop:10,
    padding: 10,
    backgroundColor: '#eeeeee',
    borderWidth: 1,
    borderColor: "#333333"
  },
  jsonTreeWrap: {
    flexDirection:'row'
  },
  whiteInfoWrap: {
    flexDirection:'row',
     position:'relative',
     backgroundColor:'#ffffff',
     minHeight: 30,
     alignItems: 'flex-end',
     justifyContent: 'center'
  }

});
