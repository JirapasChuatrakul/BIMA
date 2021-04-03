import React, {Component} from 'react';
import {Alert ,TouchableHighlight ,StyleSheet ,Image ,View ,Text ,FlatList} from 'react-native';
import Modal from 'react-native-modal';
import firebase from '../database/firebase';

export default class Notification extends Component{
 constructor(props){
 super(props);
 this.state={
 modalVisible:false,
 setModalVisible:false,
 Itemkey:'',
 cs: 0,
 list:[],
 mostlistitem:[],
 modaltitle: ''
 }}
  componentDidMount(){
    firebase.database().ref('alertmanager/' + firebase.auth().currentUser.uid).on('value', (snapshot) =>{
      var liitem = []
      snapshot.forEach((child)=>{
       liitem.push({
           key: child.key,
           staffid: child.val().staffid,
           topic: child.val().topic,
           detail: child.val().detail
       })
      })
      this.setState({mostlistitem:liitem})
      firebase.database().ref('summary/' + firebase.auth().currentUser.uid).child('currentstock').on('value', snapshot => {
        this.setState({cs:snapshot.val()});
      })
     })
  };
  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

  clearNotification = () => {
    Alert.alert(
        'Clear all notification',
        'are you sure you want to clear all notifation ?',
        [
          {text: 'Cancel', onPress: () => console.log('cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => firebase.database().ref('alertmanager/' + firebase.auth().currentUser.uid).remove()},
        ],
        {cancelable: false}
      )
  };

  notificationShow = () => {      
    this.setState({modalVisible:true});
    this.setState({modaltitle: 'Notification'});
  };

 render(){
  return(
    <View style={styles.container}>
        <View style={styles.containerlogo}>
          <Image source={require('../assets/notification.png')} />
        </View>

        <TouchableHighlight style={{ ...styles.currentButton}}>
        <Text style={styles.currentText}>Current Stock is {this.state.cs} {"\n"}</Text> 
        </TouchableHighlight>

        <TouchableHighlight style={{ ...styles.notificationButton}}
         onPress={() => {
          this.notificationShow();
        }}>
        <Text style={styles.notificationText}>Show Notification</Text> 
        </TouchableHighlight>

        <TouchableHighlight
                    style={{ ...styles.notificationButton, backgroundColor: "red" }}
                    onPress={() => {
                      this.clearNotification();
                    }}
        >
        <Text style={styles.notificationText}>
          Clear all Notification
        </Text>  
        </TouchableHighlight>
            <Modal
              isVisible={this.state.modalVisible}
              >
              <View style={styles.centeredView}>
              <View style={styles.modalView}>
              <Text style={styles.notificationText}>{this.state.modaltitle}</Text>
              <FlatList
                data={this.state.mostlistitem}
                keyExtractor={(item)=>item.key}
                renderItem={({item})=>{
                  return(
                      <View style={styles.listmodalcontainer}>
                      <Text style={styles.modalcontainer}>
                      <Text style={{...styles.itemcontainer, fontWeight:'bold'}}>From:{"\n"}</Text> {item.staffid} {"\n"}{"\n"}
                      <Text style={{...styles.itemcontainer, fontWeight:'bold'}}>Topic:{"\n"}</Text> {item.topic} {"\n"}{"\n"}
                      <Text style={{...styles.itemcontainer, fontWeight:'bold'}}>Detail:{"\n"}</Text> {item.detail}
                      </Text>
                      </View>
                  )
                  }}/>
                <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                    onPress={() => {
                    this.setState({modalVisible:false});
                    }}
                    >
                    <Text style={styles.textStyle}>Close</Text>
                </TouchableHighlight>
              </View>
              </View>
            </Modal>
    </View>
  )}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    alignSelf:'center',
    flexDirection: "column",
    padding: 5,
    width:'85%'
  },
  containerlogo: {
    alignItems: 'center',
    justifyContent: "center",
  },
  listcontainer: {
    flex:1, 
    flexDirection: 'row', 
    alignSelf: 'center', 
    justifyContent:'center',
    backgroundColor: '#D8D8D6',
    borderRadius: 20,
    padding: 15
  },
  listmodalcontainer: {
    flex:1,
    justifyContent:'center',
    alignSelf:'center',
    backgroundColor: '#D8D8D6',
    borderRadius: 20,
    padding: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  itemcontainer: {
    flex:3, 
    flexDirection: 'row', 
    alignSelf: 'center', 
    justifyContent:'center',
    fontFamily: 'Verdana',
    fontSize: 14,
    backgroundColor: '#D8D8D6'
  },
  modalcontainer: {
    flex:1,
    padding: 10,
    flexDirection: 'row', 
    alignSelf: 'center', 
    justifyContent:'center',
    fontFamily: 'Verdana',
    fontSize: 14,
    backgroundColor: '#D8D8D6'
  },   
  clearText: {
      marginBottom: 10,
      color: 'red',
      textAlign: 'center'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    flex:1,
    width: '85%',
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  ClearText: {
    fontSize: 15,
    textAlign: 'center',
    color : '#F9F9F9',
    fontFamily: 'Verdana-Bold',
    alignItems: "center"
  },
  currentButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width:'70%',
    height: '8%',
    marginTop: 10,
    marginBottom: 5,
    borderWidth: 4,
    padding: 5,
    justifyContent:'center',
    alignSelf: 'center', 
    borderColor: '#D8D8D6'
  },
  currentText: {
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'Verdana-Bold',
    alignItems: "center"
  },
  notificationButton: {
    backgroundColor: '#87cefa',
    borderRadius: 20,
    width:'70%',
    height: '8%',
    marginTop: 10,
    marginBottom: 5,
    borderWidth: 4,
    padding: 5,
    justifyContent:'center',
    alignSelf: 'center', 
    borderColor: '#D8D8D6'
  },
  notificationText: {
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'Verdana-Bold',
    alignItems: "center"
  }
});