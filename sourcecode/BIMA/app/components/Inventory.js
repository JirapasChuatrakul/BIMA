import React, {Component} from 'react';
import {Alert ,TouchableHighlight ,StyleSheet ,Image ,View ,Text ,FlatList} from 'react-native';
import Modal from 'react-native-modal';
import QRCode from 'react-native-qrcode-svg';
import firebase from '../database/firebase';

export default class Inventory extends Component{
 constructor(props){
 super(props);
 this.state={
 modalVisible:false,
 setModalVisible:false,
 QRkey:'',
 CurrentName:'',
 list:[],
 } }
  componentDidMount(){
    firebase.database().ref('inventory/' + firebase.auth().currentUser.uid).on('value', (snapshot) =>{
      var li = []
      snapshot.forEach((child)=>{
       li.push({
        key: child.key,
        name: child.val().name,
        brand: child.val().brand,
        color: child.val().color,
        price: child.val().price,
        quantity: child.val().quantity
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
 plusItem = (key) => {
  firebase.database().ref('inventory/' + firebase.auth().currentUser.uid + '/' + key).child('quantity')
  .set(firebase.database.ServerValue.increment(1));
  firebase.database().ref('summary/' + firebase.auth().currentUser.uid).child('currentstock')
  .set(firebase.database.ServerValue.increment(1));
};
 
 minusItem = (key) => {
  firebase.database().ref('inventory/' + firebase.auth().currentUser.uid + '/' + key).child('quantity')
  .set(firebase.database.ServerValue.increment(-1));
  firebase.database().ref('summary/' + firebase.auth().currentUser.uid).child('currentstock')
  .set(firebase.database.ServerValue.increment(-1));
 };

 changePrice = (name,key) => {
  Alert.prompt(
    'Change Price',
    'Current item is ' + name + ' ,insert price you would like to change',
    [
      {text: 'Cancel', onPress: () => console.log('cancel Pressed'), style: 'cancel'},
      {text: 'OK', onPress: (price) => firebase.database().ref('inventory/' + firebase.auth().currentUser.uid + '/' + key).update({'price' : price})},
    ],
    'plain-text'
 );
 };

 deleteItem = (name,key,quantity) =>{
  Alert.alert(
    'Delete Item',
    'delete ' + name + ' ?',
    [
       {text: 'Cancel', onPress: () => console.log('cancel Pressed'), style: 'cancel'},
       {text: 'OK', onPress: () => this.deleteItemDB(name,key,quantity)},
    ],
    {cancelable: false}
  )
 };

 deleteItemDB = (name,key,quantity) =>{
   firebase.database().ref('inventory/' + firebase.auth().currentUser.uid + '/' + key).remove()
   firebase.database().ref('summary/' + firebase.auth().currentUser.uid).child('currentstock')
   .set(firebase.database.ServerValue.increment(-quantity));
   Alert.alert(
     'Notice',
     'successful delete ' + name,
     [
        {text: 'OK', onPress: () => this.deleteLog()},
     ],
     {cancelable: false}
   )    
  };

  deleteLog = () => {
   console.log('Remove Item from Cart');
 }

 readQRcode = (name,key) => {
  this.setState({modalVisible:true});
  this.setState({QRkey: key});    
  this.setState({CurrentName: name});    
};


 render(){
  return(
    <View style={styles.container}>
        <View style={styles.containerlogo}>
          <Image source={require('../assets/inventory.png')} />
        </View>
        <TouchableHighlight
                    style={{ ...styles.addedItemButton, backgroundColor: "#00AB66" }}
                    onPress={() => {
                      this.props.navigation.navigate('Add Item');
                    }}
        >
        <Text style={styles.addedItemText}>
          Click here to Add Item
        </Text>  
        </TouchableHighlight>
        
       <FlatList
          data={this.state.list}
          keyExtractor={(item)=>item.key}
          renderItem={({item})=>{
             return(
                <View style={styles.listcontainer}>
                   <Text style={styles.itemcontainer} onPress={() => this.readQRcode(item.name,item.key)}>
                   <Text style={{...styles.itemcontainer, fontWeight:'bold'}}>Name:</Text> {item.name} {"\n"}
                   <Text style={{...styles.itemcontainer, fontWeight:'bold'}}>Brand:</Text> {item.brand} {"\n"}
                   <Text style={{...styles.itemcontainer, fontWeight:'bold'}}>Color:</Text> {item.color} {"\n"} 
                   <Text style={{...styles.itemcontainer, fontWeight:'bold'}}>Price:</Text> {item.price} Baht {"\n"}
                   <Text style={{...styles.itemcontainer, fontWeight:'bold'}}>Quantity:</Text> {item.quantity} {"\n"}
                   </Text>

                   <Text style={styles.plusText}
                    onPress={() => this.plusItem(item.key)}>
                    +
                    </Text>
                    <Text style={styles.minusText}
                    onPress={() => this.minusItem(item.key)}>
                    -
                    </Text>
                    <Text style={styles.changePrice}
                    onPress={() => this.changePrice(item.name,item.key)}>
                    Price
                    </Text>
                    <Text style={styles.deleteText}
                    onPress={() => this.deleteItem(item.name,item.key,item.quantity)}>
                    Delete
                    </Text>
                    
                    <Modal
                    isVisible={this.state.modalVisible}
                    >
                    <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                    <Text style={styles.QRText}>{this.state.CurrentName}</Text>
                    <QRCode
                    value={this.state.QRkey}
                    logo={require('../assets/icon.png')}
                    logoSize={30}
                    logoBackgroundColor='transparent'/>
                    <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                    onPress={() => {
                    this.setState({modalVisible:false});
                    }}
                    >
                    <Text style={styles.textStyle}>Close QRcode</Text>
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
      marginBottom: 5,
      padding: 15
    },
    itemcontainer: {
      flex:2.5, 
      flexDirection: 'row', 
      alignSelf: 'center', 
      justifyContent:'center',
      fontFamily: 'Verdana',
      fontSize: 14,
      backgroundColor: '#D8D8D6'
    },
    plusText: {
      flex: 0.75,
      alignSelf: 'center', 
      justifyContent:'center',
      color: 'green',
      fontFamily: 'Verdana-Bold',
      textAlign: 'center'
    },
    minusText: {
      flex: 0.75,
      alignSelf: 'center', 
      justifyContent:'center',
      color: 'red',
      fontFamily: 'Verdana-Bold',
      textAlign: 'center'
    },
    deleteText: {
      flex: 1,
      alignSelf: 'center', 
      justifyContent:'center',
      color: 'red',
      fontFamily: 'Verdana-Bold',
      textAlign: 'center'
    },
    changePrice: {
      flex: 1,
      alignSelf: 'center', 
      justifyContent:'center',
      color: 'orange',
      fontFamily: 'Verdana-Bold',
      textAlign: 'center'
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
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
      marginTop: 20,
      borderRadius: 20,
      padding: 10,
      fontFamily: 'Verdana-Bold',
      fontSize: 20,
      elevation: 2
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    addedItemButton: {
      backgroundColor: '#2F5D8C',
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      width:'70%',
      height: '8%',
      marginBottom: 15,
      padding: 8,
      borderWidth: 4,
      justifyContent:'center',
      alignSelf: 'center', 
      borderColor: '#D8D8D6'
    },
    addedItemText: {
      fontSize: 15,
      textAlign: 'center',
      color : '#F9F9F9',
      fontFamily: 'Verdana-Bold',
      alignItems: "center"
    },
    QRText: {
      fontSize: 20,
      textAlign: 'center',
      fontFamily: 'Verdana-Bold',
      marginBottom: 20,
      alignItems: "center"
    }
  });