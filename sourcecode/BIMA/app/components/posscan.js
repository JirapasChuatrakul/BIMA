import React, {Component} from 'react';
import { View ,Button ,StyleSheet ,Alert} from 'react-native';
import {Camera as Camera} from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import firebase from '../database/firebase';

export default class POSScan extends Component {
  constructor(props) {
      super(props);
      this.handleTourch = this.handleTourch.bind(this);
      this.state = {
      quantityvalue: 0,
      list: [],
      torchOn: false,
      setScanned: false
      }
  }
  state = {
    hasPermission: null,
    type: Camera.Constants.Type.back
  }
  
  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasPermission: status === 'granted' });
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
    newRef.child('quantity').set(null);
    newRef.child('quantity').set(firebase.database.ServerValue.increment(1));
    newRef.child('quantity').set(firebase.database.ServerValue.increment(-1));
    newRef.child('totalprice').set('0');

   })
  };

  render() {
    const handleBarCodeScanned = ({ type, data }) => {
      this.setState({setScanned: true})
      this.setState({quantityvalue: firebase.database().ref('inventory/' + firebase.auth().currentUser.uid + '/' + data).child('quantity')})
      this.copyFirebaseObject(firebase.database().ref('inventory/' + firebase.auth().currentUser.uid + '/' + data), 
                              firebase.database().ref('cart/' + firebase.auth().currentUser.uid + '/' + data) )

      Alert.alert(
      'Successfully added to cart!',
      'add more item ?',
       [
          {text: 'Cancel', onPress: () => this.props.navigation.navigate('POS'), style: 'cancel'},
          {text: 'OK', onPress: () => console.log('cancel Pressed')},
       ],
      {cancelable: false}
      )
    };

    return (
    <View style={styles.container}>
    <BarCodeScanner
        onBarCodeScanned={this.state.setScanned === true ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
    />
    { this.state.setScanned === true && <Button style={styles.buttonScan} title={'Tap to Scan Again'} onPress={() => this.setState({setScanned: false})} />}
    <View style={styles.bottomOverlay}>
    </View>
    </View>
    )
    }
    
  handleTourch(value) {
    if (value === true) {
        this.setState({ torchOn: false });
    } else {
        this.setState({ torchOn: true });
    }
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column-reverse',
    display: "flex"
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
    fontFamily: 'Verdana',
    padding: 10
    },
  });