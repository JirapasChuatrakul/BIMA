import React, {Component} from 'react';
import {View ,Text ,FlatList ,StyleSheet ,Alert ,Image ,TouchableHighlight} from 'react-native';
import moment from 'moment';
import firebase from '../database/firebase';

export default class POSMain extends Component {
  constructor(props){
    super(props);
    this.state={
    totalprice: '0',
    allprice: 0,
    modalVisible:false,
    setModalVisible:false,
    managerid: '',
    QRkey:'',
    orderid: '',
    list:[],
    } }
    componentDidMount(){
      firebase.database().ref('cart/' + firebase.auth().currentUser.uid).on('value', (snapshot) =>{
        var li = []
        snapshot.forEach((child)=>{
         li.push({
          key: child.key,
          name: child.val().name,
          brand: child.val().brand,
          color: child.val().color,
          price: child.val().price,
          quantity: child.val().quantity,
          totalprice: child.val().totalprice
        })
      })
     this.setState({list:li})
    })
    firebase.database().ref('account/' + firebase.auth().currentUser.uid).child('managerid').on('value', snapshot => {
      this.setState({managerid:snapshot.val()})});
    }
    componentWillUnmount() {
      // fix Warning: Can't perform a React state update on an unmounted component
      this.setState = (state,callback)=>{
          return;
      };
    }
    plusTotalprice = (key) => {
      var newTotalprice = this.state.totalprice;
      firebase.database().ref('cart/' + firebase.auth().currentUser.uid + '/' + key).child('quantity')
                         .set(firebase.database.ServerValue.increment(1));
      firebase.database().ref('cart/' + firebase.auth().currentUser.uid + '/' + key).child('totalprice')
                         .set(newTotalprice);
    }

    minusTotalprice = (key) => {
      var newTotalprice = this.state.totalprice;
      firebase.database().ref('cart/' + firebase.auth().currentUser.uid + '/' + key).child('quantity')
                         .set(firebase.database.ServerValue.increment(-1));
      firebase.database().ref('cart/' + firebase.auth().currentUser.uid + '/' + key).child('totalprice')
                         .set(newTotalprice);
    }

    plusItem = (key,price,quantity) => {
      firebase.database().ref('inventory/' + this.state.managerid + '/' + key).child('quantity')
      .set(firebase.database.ServerValue.increment(-1));
      firebase.database().ref('summary/' + this.state.managerid).child('currentstock')
      .set(firebase.database.ServerValue.increment(-1));
      firebase.database().ref('summary/' + this.state.managerid + '/mostsellingitem' + '/' + key).child('quantity')
      .set(firebase.database.ServerValue.increment(1));
      this.setState({totalprice: price * (quantity+1)})
      this.setState({allprice:(this.state.allprice+price*1.00)})
      Alert.alert(
        'Notice',
        'successful plus 1 item',
        [
           {text: 'OK', onPress: () => this.plusTotalprice(key)},
        ],
        {cancelable: false}
      )
    };
    
    minusItem = (key,price,quantity) => {
      firebase.database().ref('inventory/' + this.state.managerid + '/' + key).child('quantity')
      .set(firebase.database.ServerValue.increment(1));
      firebase.database().ref('summary/' + this.state.managerid).child('currentstock')
      .set(firebase.database.ServerValue.increment(1));
      firebase.database().ref('summary/' + this.state.managerid + '/mostsellingitem' + '/' + key).child('quantity')
      .set(firebase.database.ServerValue.increment(-1));
      this.setState({totalprice: price * (quantity-1)})
      this.setState({allprice:(this.state.allprice-price*1.00)})
      Alert.alert(
        'Notice',
        'successful minus 1 item',
        [
           {text: 'OK', onPress: () => this.minusTotalprice(key)},
        ],
        {cancelable: false}
      )    
    };

    resetItem = (key,quantity) => {
      firebase.database().ref('cart/' + firebase.auth().currentUser.uid + '/' + key).child('quantity')
                         .set(firebase.database.ServerValue.increment(-quantity));
    };
      
    deleteItem = (name,key,quantity,price) =>{
      Alert.alert(
        'Delete Item',
        'delete ' + name + ' ?',
        [
           {text: 'Cancel', onPress: () => console.log('cancel Pressed'), style: 'cancel'},
           {text: 'OK', onPress: () => this.deleteItemDB(name,key,quantity,price)},
        ],
        {cancelable: false}
      )
     };
 
     deleteItemDB = (name,key,quantity,price) =>{
       firebase.database().ref('cart/' + firebase.auth().currentUser.uid + '/' + key).remove()
       firebase.database().ref('inventory/' + firebase.auth().currentUser.uid + '/' + key).child('quantity')
       .set(firebase.database.ServerValue.increment(quantity));
       firebase.database().ref('summary/' + firebase.auth().currentUser.uid).child('currentstock')
       .set(firebase.database.ServerValue.increment(quantity));
       firebase.database().ref('summary/' + firebase.auth().currentUser.uid + '/mostsellingitem' + '/' + key).child('quantity')
       .set(firebase.database.ServerValue.increment(-quantity));
       this.setState({allprice:(this.state.allprice - (price * (quantity) *1.00) )})
       Alert.alert(
         'Notice',
         'successful delete ' + name,
         [
            {text: 'OK', onPress: () => this.deleteTotalprice()},
         ],
         {cancelable: false}
       )    
      };
 
      deleteTotalprice = () => {
       console.log('Remove Item from Cart');
     }
    
    copyFirebaseObject = (oldRef, newRef) => {
      oldRef.once('value').then(snap => {
      newRef.set(snap.val());
    })
    }; 

    checkoutItem = () => {
      firebase.database().ref('account/' + firebase.auth().currentUser.uid).child('managerid').on('value', snapshot => {
        this.setState({managerid:snapshot.val()})});
      firebase.database().ref('cart').child('orderid').set(firebase.database.ServerValue.increment(1));
      firebase.database().ref('cart').child('orderid').on('value', snapshot => {
        this.setState({orderid:snapshot.val()});
      })

      Alert.alert(
        'Checkout Item',
        'checkout item?',
        [
          {text: 'Cancel', onPress: () => console.log('cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => this.copyItem()},
        ],
        {cancelable: false}
      )
    };

    copyItem = () => {
      var newDate = moment().format("DD/MM/YYYY hh:mm:ss a") 
      firebase.database().ref('history/' + this.state.managerid).child('transaction'+ this.state.orderid).set({orderid:this.state.orderid, date: newDate, status: 'Successfully', totalprice: this.state.allprice});
      this.copyFirebaseObject(firebase.database().ref('cart/' + firebase.auth().currentUser.uid), 
                              firebase.database().ref('history/' + this.state.managerid + '/' + 'transaction' + this.state.orderid + '/').child('itemlist'))
      firebase.database().ref('summary/' + this.state.managerid + '/recentselling').remove()
      this.copyFirebaseObject(firebase.database().ref('cart/' + firebase.auth().currentUser.uid), 
                              firebase.database().ref('summary/' + this.state.managerid).child('recentselling'))                        
      firebase.database().ref('cart/' + firebase.auth().currentUser.uid).remove()
      this.setState({totalprice:'0'});
      this.setState({allprice:0});
      Alert.alert(
        'Successfully Checkout Item!',
        'new transaction ?',
        [
          {text: 'Cancel', onPress: () => this.props.navigation.navigate('Main Menu'), style: 'cancel'},
          {text: 'OK', onPress: () => console.log('cancel Pressed')},
        ],
        {cancelable: false}
      )
    }
   
 render(){
  return(
    <View style={styles.container}>
        <View style={styles.containerlogo}>
          <Image source={require('../assets/cart.png')} />
        </View>
        <TouchableHighlight
                    style={{ ...styles.AddtoCartButton}}
                    onPress={() => {
                      this.props.navigation.navigate('Add To Cart');
                    }}
        >
        <Text style={styles.AddtoCartText}>
          Add item by list
        </Text>  
        </TouchableHighlight>

        <TouchableHighlight
                    style={{ ...styles.AddtoCartButton}}
                    onPress={() => {
                      this.props.navigation.navigate('POS Scan');
                    }}
        >
        <Text style={styles.AddtoCartText}>
          Add item by scan qrcode
        </Text>  
        </TouchableHighlight>
       <FlatList
          data={this.state.list}
          keyExtractor={(item)=>item.key}
          renderItem={({item})=>{
             return(
                <View style={styles.listcontainer}>
                   <Text style={styles.itemcontainer}>
                                Name: {item.name} {"\n"}Brand: {item.brand} {"\n"}Color: {item.color} {"\n"} 
                                Price: {item.price} Baht {"\n"}Quantity: {item.quantity} {"\n"}Total Price: {item.totalprice}</Text>
                   <Text style={styles.plusText}
                    onPress={() => this.plusItem(item.key,item.price,item.quantity)}>
                    +
                    </Text>
                    <Text style={styles.minusText}
                    onPress={() => this.minusItem(item.key,item.price,item.quantity)}>
                    -
                    </Text>
                    <Text style={styles.deleteText}
                    onPress={() => this.deleteItem(item.name,item.key,item.quantity,item.price)}>
                    Delete
                    </Text>
                    
                </View>
                )
             }}/>
          <Text style={styles.totalpriceText}>
          Total Price is {this.state.allprice} 
          </Text>
          <TouchableHighlight
                    style={{ ...styles.CheckoutButton}}
                    onPress={() => {
                      this.checkoutItem();
                    }}
          >
          <Text style={styles.CheckoutText}>
             Checkout!
          </Text>  
          </TouchableHighlight>
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
  inputStyle: {
    width: '100%',
    marginBottom: 15,
    paddingBottom: 15,
    alignSelf: "center",
    borderColor: "#ccc",
    borderBottomWidth: 1
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
  resetText: {
    flex: 1,
    alignSelf: 'center', 
    justifyContent:'center',
    color: 'orange',
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
  linkText: {
    marginBottom: 20,
    color: '#3740FE',
    textAlign: 'center'
  },
  totalpriceText: {
    marginTop: 10,
    fontWeight: 'bold',
    fontFamily: 'Verdana',
    textAlign: 'center'
  },
  CheckoutButton: {
    backgroundColor: '#ff8b3d',
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
  CheckoutText: {
    fontSize: 15,
    textAlign: 'center',
    color : '#F9F9F9',
    fontFamily: 'Verdana-Bold',
    alignItems: "center"
  },
  AddtoCartButton: {
    backgroundColor: '#00AB66',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width:'70%',
    height: '8%',
    marginTop: 5,
    marginBottom: 5,
    padding: 8,
    borderWidth: 4,
    justifyContent:'center',
    alignSelf: 'center', 
    borderColor: '#D8D8D6'
  },
  AddtoCartText: {
    fontSize: 15,
    textAlign: 'center',
    color : '#F9F9F9',
    fontFamily: 'Verdana-Bold',
    alignItems: "center"
  },


  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },

  cameraIcon: {
    margin: 5,
    height: 40,
    width: 40
  },

  bottomOverlay: {
    position: "absolute",
    flex: 1,
    flexDirection: "column-reverse",
    justifyContent: "space-between",
  },

  buttonScan: {
    position: "absolute",
    flex:1,
    flexDirection: "row",
    top: 0, left: 0, right: 0, bottom: 0,
    padding: 10
  },
  });