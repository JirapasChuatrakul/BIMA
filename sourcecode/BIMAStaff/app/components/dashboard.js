import React, { Component } from 'react';
import {StyleSheet ,View ,Text ,Button ,Image ,TouchableHighlight} from 'react-native';
import firebase from '../database/firebase';

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = { 
      uid: ''
    }
  }

  signOut = () => {
    firebase.auth().signOut().then(() => {
      this.props.navigation.navigate('Login')
    })
    .catch(error => this.setState({ errorMessage: error.message }))
  }  

  render() {
    this.state = { 
      displayName: firebase.auth().currentUser.displayName,
      uid: firebase.auth().currentUser.uid
    }    
    return (
      <View style={styles.container}>
        <View style={styles.containerlogo}>
          <Image source={require('../assets/icon.png')} />
        </View> 
        <Text style = {styles.textStyle}>
          Welcome, {this.state.displayName} !
        </Text>

        <TouchableHighlight
                    style={{ ...styles.featureButton, backgroundColor: "#2F5D8C" }}
                    onPress={() => {
                      this.props.navigation.navigate('Inventory');
                    }}
        >
        <Text style = {styles.featureText}>
          View Items
        </Text>
        </TouchableHighlight>
        
        
        <TouchableHighlight
                    style={{ ...styles.featureButton, backgroundColor: "#2F5D8C" }}
                    onPress={() => {
                      this.props.navigation.navigate('Alert Manager');
                    }}
        >
        <Text style = {styles.featureText}>
          Alert Manager
        </Text>
        </TouchableHighlight>

        <TouchableHighlight
                    style={{ ...styles.featureButton, backgroundColor: "#2F5D8C" }}
                    onPress={() => {
                      this.props.navigation.navigate('POS');
                    }}
        >
        <Text style = {styles.featureText}>
          POS
        </Text>
        </TouchableHighlight>

        <Button
          color="#3740FE"
          title="Logout"
          onPress={() => this.signOut()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
    backgroundColor: '#fff'
  },
  containertop: {
    flex: 0.5,
    display: "flex",
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  textStyle: {
    fontSize: 15,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Verdana-Bold',
    alignItems: "center"
  },  
  featureButton: {
    backgroundColor: '#2F5D8C',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width:'60%',
    height: '9%',
    marginBottom: 15,
    padding: 10,
    borderWidth: 4,
    justifyContent:'center',
    alignSelf: 'center', 
    borderColor: '#D8D8D6'
  },
  featureText: {
    fontSize: 15,
    textAlign: 'center',
    color : '#F9F9F9',
    fontFamily: 'Verdana-Bold',
    alignItems: "center",
  }
});