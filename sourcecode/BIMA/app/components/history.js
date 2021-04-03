import React, {Component} from 'react';
import {Alert ,TouchableHighlight ,StyleSheet ,Image ,View ,Text ,FlatList} from 'react-native';
import Modal from 'react-native-modal';
import firebase from '../database/firebase';

export default class History extends Component{
 constructor(props){
 super(props);
 this.state={
 modalVisible:false,
 setModalVisible:false,
 Itemkey:'',
 CurrentOrder:'',
 list:[],
 listitem:[],
 } }
  componentDidMount(){
    firebase.database().ref('history/' + firebase.auth().currentUser.uid).on('value', (snapshot) =>{
      var li = []
      snapshot.forEach((child)=>{
       li.push({
        key: child.key,
        orderid: child.val().orderid,
        date: child.val().date,
        totalprice: child.val().totalprice,
        status: child.val().status
      })
    })
   this.setState({list:li})
  })
 }
 componentWillUnmount() {
  // fix Warning: Can't perform a React state update on an unmounted component
  this.setState = (state,callback)=>{
      return;
  };
  }
 clearHistory = () => {
    Alert.alert(
        'Clear all history',
        'are you sure you want to clear all history ?',
        [
          {text: 'Cancel', onPress: () => console.log('cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => firebase.database().ref('history/' + firebase.auth().currentUser.uid).remove()},
        ],
        {cancelable: false}
      )
  };

 deleteItem = (orderid,key) =>{
  Alert.alert(
    'Delete selected history',
    'delete order' + orderid + ' from history ?',
    [
       {text: 'Cancel', onPress: () => console.log('cancel Pressed'), style: 'cancel'},
       {text: 'OK', onPress: () => firebase.database().ref('history/' + firebase.auth().currentUser.uid + '/' + key).remove()},
    ],
    {cancelable: false}
  )
 };

 listofItem = (orderid,key) => {
    this.setState({ItemKey: key});    
    this.setState({CurrentOrder: orderid});    
    this.setState({modalVisible:true});
    firebase.database().ref('history/' + firebase.auth().currentUser.uid  +'/'+ key + '/itemlist').on('value', (snapshot) =>{
      var liitem = []
      snapshot.forEach((child)=>{
       liitem.push({
           key: child.key,
           name: child.val().name,
           brand: child.val().brand,
           color: child.val().color,
           price: child.val().price,
           quantity: child.val().quantity,
           totalprice: child.val().totalprice
       })
      })
      this.setState({listitem:liitem})
     })
  };

 render(){
  return(
    <View style={styles.container}>
        <View style={styles.containerlogo}>
          <Image source={require('../assets/history.png')} />
        </View>

        <TouchableHighlight
                    style={{ ...styles.ClearButton, backgroundColor: "red" }}
                    onPress={() => {
                      this.clearHistory();
                    }}
        >
        <Text style={styles.ClearText}>
          Clear all history
        </Text>  
        </TouchableHighlight>
       <FlatList
          data={this.state.list}
          keyExtractor={(item)=>item.key}
          renderItem={({item})=>{
             return(
                <View style={styles.listcontainer}>
                    <Text style={styles.itemcontainer} onPress={() => this.listofItem(item.orderid,item.key)}>
                    <Text style={{...styles.itemcontainer, fontWeight:'bold'}}>OrderID:</Text> {item.orderid} {"\n"}
                    <Text style={{...styles.itemcontainer, fontWeight:'bold'}}>Date:</Text> {item.date} {"\n"}
                    <Text style={{...styles.itemcontainer, fontWeight:'bold'}}>TotalPrice:</Text> {item.totalprice} Baht{"\n"} 
                    <Text style={{...styles.itemcontainer, fontWeight:'bold'}}>Status:</Text><Text style={{...styles.itemcontainer, color: "green"}}> {item.status}</Text> {"\n"}
                                </Text>
                    <Text style={styles.deleteText}
                    onPress={() => this.deleteItem(item.orderid,item.key)}>
                    Delete
                    </Text>

                    <Modal
                    isVisible={this.state.modalVisible}
                    >
                    <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                    <Text style={styles.modalHeader}>OrderID: {this.state.CurrentOrder} {"\n"} Item list</Text>
                    <FlatList
                        data={this.state.listitem}
                        keyExtractor={(item)=>item.key}
                        renderItem={({item})=>{
                        return(
                            <View style={styles.listmodalcontainer}>
                            <Text style={styles.modalcontainer}>
                            <Text style={{...styles.itemcontainer, fontWeight:'bold'}}>Name:</Text> {item.name} {"\n"}
                            <Text style={{...styles.itemcontainer, fontWeight:'bold'}}>Brand:</Text> {item.brand} {"\n"}
                            <Text style={{...styles.itemcontainer, fontWeight:'bold'}}>Color:</Text> {item.color} {"\n"} 
                            <Text style={{...styles.itemcontainer, fontWeight:'bold'}}>Price:</Text> {item.price} Baht {"\n"}
                            <Text style={{...styles.itemcontainer, fontWeight:'bold'}}>Quantity:</Text> {item.quantity} {"\n"}
                            <Text style={{...styles.itemcontainer, fontWeight:'bold'}}>Total:</Text> {item.totalprice} Baht 

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
                )
             }}/>
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
      justifyContent: "center",
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
      padding: 15,
      marginBottom: 15
    },
    listmodalcontainer: {
      flex:1,
      justifyContent:'center',
      backgroundColor: '#D8D8D6',
      borderRadius: 20,
      padding: 5,
      marginBottom: 15
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
      paddingLeft:55,
      paddingRight:55,
      flexDirection: 'row', 
      alignSelf: 'center', 
      justifyContent:'center',
      fontFamily: 'Verdana',
      fontSize: 14,
      backgroundColor: '#D8D8D6'
    },
    deleteText: {
        flex: 1,
        alignSelf: 'center', 
        justifyContent:'center',
        color: 'red',
        fontFamily: 'Verdana-Bold',
        textAlign: 'center'
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
    ClearButton: {
      backgroundColor: '#2F5D8C',
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      width:'70%',
      height: '8%',
      marginTop: 10,
      marginBottom: 15,
      padding: 8,
      borderWidth: 4,
      justifyContent:'center',
      alignSelf: 'center', 
      borderColor: '#D8D8D6'
    },
    ClearText: {
      fontSize: 15,
      textAlign: 'center',
      color : '#F9F9F9',
      fontFamily: 'Verdana-Bold',
      alignItems: "center"
    },
    modalHeader: {
      fontSize: 15,
      textAlign: 'center',
      fontFamily: 'Verdana-Bold',
      alignItems: "center"
    }
  });