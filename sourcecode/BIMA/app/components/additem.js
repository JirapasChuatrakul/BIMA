import React, {Component} from 'react';
import {Alert ,ScrollView ,Keyboard ,StyleSheet ,Button ,TextInput ,Platform } from 'react-native';
import firebase from '../database/firebase';

Keyboard.dismiss()
export default class AddItem extends Component {
    constructor(props){
    super(props);
    this.state={
        name:'',
        brand:'',
        color:'',
        price:'',
        quantity:'',
        itemid:''
    }
}
componentWillUnmount() {
  // fix Warning: Can't perform a React state update on an unmounted component
  this.setState = (state,callback)=>{
      return;
  };
}
copyFirebaseObject = (oldRef, newRef) => {
    oldRef.once('value').then(snap => {
    newRef.set(snap.val());
  })
  }; 


copyItem = (name,brand,color,price) => {
    firebase.database().ref('inventory/' + firebase.auth().currentUser.uid).child('itemid'+ this.state.itemid).set({name:name,brand:brand,color:color,price:price,quantity:0});
    this.copyFirebaseObject(firebase.database().ref('inventory/' + firebase.auth().currentUser.uid + '/' + 'itemid' + this.state.itemid), 
                            firebase.database().ref('summary/' + firebase.auth().currentUser.uid + '/mostsellingitem' + '/itemid' + this.state.itemid))
    Alert.alert(
      'Successfully Added Item!',
      'add more item ?',
      [
        {text: 'Cancel', onPress: () => this.props.navigation.navigate('Inventory'), style: 'cancel'},
        {text: 'OK', onPress: () => console.log('cancel Pressed')},
      ],
      {cancelable: false}
    )
    this.setState({name:'',brand:'',color:'', price:''})
  }

  AddedItem = (name,brand,color,price) => {
    firebase.database().ref('inventory').child('itemidcount').set(firebase.database.ServerValue.increment(1));
    firebase.database().ref('inventory').child('itemidcount').on('value', snapshot => {
      this.setState({itemid:snapshot.val()});
    })

    Alert.alert(
      'Confirm',
      'Add item?',
      [
        {text: 'Cancel', onPress: () => console.log('cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => this.copyItem(name,brand,color,price)},
      ],
      {cancelable: false}
    )
  };

send = (name,brand,color,price) =>{
    firebase.database().ref('inventory/' + firebase.auth().currentUser.uid).push({name, brand, color, price ,quantity:0}); 
    this.setState({name:'',brand:'',color:'', price:''})
    this.props.navigation.navigate('Inventory')
    }

render(){
return(
<ScrollView style={{alignSelf:'center',keyboardShouldPersistTaps:'always',keyboardDismissMode:'on-drag'}}>
<TextInput style={{height:40,width:360, margin:20,marginTop:30, borderBottomWidth: StyleSheet.hairlineWidth}}
    placeholder="Name"
    placeholderTextColor="#8A8F9E"
    autoCorrect={false}
    onChangeText={name => this.setState({name})}
    value={this.state.name}
  />
  <TextInput style={{height:40, margin:20, borderBottomWidth: StyleSheet.hairlineWidth, }}
     placeholder="Brand"
     placeholderTextColor="#8A8F9E"
     autoCorrect={false}
     onChangeText={brand => this.setState({brand})}
     value={this.state.brand}
   />
   <TextInput style={{height:40, margin:20, borderBottomWidth: StyleSheet.hairlineWidth, }}
     placeholder="Color"
     placeholderTextColor="#8A8F9E"
     autoCorrect={false}
     onChangeText={color => this.setState({color})}
     value={this.state.color}
   />
   <TextInput style={{height:40, margin:20,marginBottom:50, borderBottomWidth: StyleSheet.hairlineWidth, }}
     placeholder="Price"
     placeholderTextColor="#8A8F9E"
     keyboardType='number-pad'
     autoCorrect={false}
     onChangeText={price => this.setState({price})}
     value={this.state.price}
   />
    <Button title='Submit' onPress={()=>this.AddedItem(this.state.name,this.state.brand,this.state.color,this.state.price)}/> 
    </ScrollView>
  )
 }
}