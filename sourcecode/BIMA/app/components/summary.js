import React, {Component} from 'react';
import {TouchableHighlight ,StyleSheet ,Image ,View ,Text ,FlatList} from 'react-native';
import Modal from 'react-native-modal';
import firebase from '../database/firebase';

export default class Fetch extends Component{
 constructor(props){
 super(props);
 this.state={
 modalVisible:false,
 setModalVisible:false,
 Itemkey:'',
 Itemname:'',
 cs: 0,
 list:[],
 listitem:[],
 mostlistitem:[],
 modaltitle: ''
 }}
  componentDidMount(){
    firebase.database().ref('summary/' + firebase.auth().currentUser.uid + '/mostsellingitem').on('value', (snapshot) =>{
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
  mostSellingItem = () => {           
    this.setState({modalVisible:true});
    firebase.database().ref('summary/' + firebase.auth().currentUser.uid  +'/mostsellingitem').orderByChild('quantity').limitToLast(1).on('value', (snapshot) =>{
      var liitem = []
      snapshot.forEach((child)=>{
       liitem.push({
          key: child.key,
          name: child.val().name,
          brand: child.val().brand,
          color: child.val().color,
          price: child.val().price,
          quantity: child.val().quantity,
       })
      })
      this.setState({listitem:liitem})
     }) 
    this.setState({modaltitle: 'Most Selling Item'});
  };

  recentSellingItem = () => {          
    this.setState({modalVisible:true});
    firebase.database().ref('summary/' + firebase.auth().currentUser.uid  +'/recentselling').on('value', (snapshot) =>{
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
    this.setState({modaltitle: 'Recent Selling Item'});
  };

  lowstockItem = () => {             
    this.setState({modalVisible:true});
    firebase.database().ref('inventory/' + firebase.auth().currentUser.uid).orderByChild('quantity').on('value', (snapshot) =>{
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
     firebase.database().ref('inventory/' + firebase.auth().currentUser.uid);
    this.setState({modaltitle: 'Low Stock Item'});
  };

 render(){
  return(
    <View style={styles.container}>
        <View style={styles.containerlogo}>
          <Image source={require('../assets/statistic.png')} />
        </View>

        <TouchableHighlight style={{ ...styles.currentButton}}>
        <Text style={styles.currentText}>Current Stock is {this.state.cs} {"\n"}</Text> 
        </TouchableHighlight>

        <TouchableHighlight style={{ ...styles.mostsellingButton}}
         onPress={() => {
          this.mostSellingItem();
        }}>
        <Text style={styles.mostsellingText}>Most Selling Item</Text> 
        </TouchableHighlight>

        <TouchableHighlight style={{ ...styles.recentsellingButton}}
         onPress={() => {
          this.recentSellingItem();
        }}>
        <Text style={styles.recentsellingText}>Recent Selling Item</Text> 
        </TouchableHighlight>

        <TouchableHighlight style={{ ...styles.lowstockButton}}
         onPress={() => {
          this.lowstockItem();
        }}>
        <Text style={styles.lowstockText}>Low Stock Item</Text> 
        </TouchableHighlight>

        <FlatList
          data={this.state.list}
          keyExtractor={(item)=>item.key}
          renderItem={({item})=>{
             return(
                <View style={styles.listcontainer}>
                    
                    <Text style={styles.itemcontainer} onPress={() => this.mostSellingItem(item.key)}>
                                
                    </Text>
                    
                </View>
                )
          }}/>
            <Modal
              isVisible={this.state.modalVisible}
              >
              <View style={styles.centeredView}>
              <View style={styles.modalView}>
              <Text style={styles.mostsellingText}>{this.state.modaltitle}</Text>
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
                      <Text style={{...styles.itemcontainer, fontWeight:'bold'}}>Quantity:</Text> {item.quantity}
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
    padding: 15
  },
  listmodalcontainer: {
    flex:1,
    width: '93%',
    justifyContent:'center',
    backgroundColor: '#D8D8D6',
    borderRadius: 20,
    padding: 5,
    marginTop: 15
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
    marginLeft:35,
    marginRight:35,
    width: '90%',
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
  ClearButton: {
    backgroundColor: '#2F5D8C',
    borderRadius: 20,
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
  mostsellingButton: {
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
  mostsellingText: {
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'Verdana-Bold',
    alignItems: "center"
  },
  recentsellingButton: {
    backgroundColor: '#fed8b1',
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
  recentsellingText: {
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'Verdana-Bold',
    alignItems: "center"
  },
  lowstockButton: {
    backgroundColor: '#ff7770',
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
  lowstockText: {
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'Verdana-Bold',
    alignItems: "center"
  }
});