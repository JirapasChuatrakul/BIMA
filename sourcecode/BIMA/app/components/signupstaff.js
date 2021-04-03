import React, { Component } from 'react';
import {StyleSheet ,View ,ScrollView ,TextInput ,Button ,Alert ,ActivityIndicator ,Image} from 'react-native';
import firebase from '../database/firebase';


export default class SignupStaff extends Component {
  
  constructor() {
    super();
    this.state = { 
      displayName: '',
      email: '', 
      password: '',
      staffid:'',
      managerid: firebase.auth().currentUser.uid,
      isLoading: false
    }
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  registerUser = () => {
    if(this.state.email === '' && this.state.password === '') {
      Alert.alert('Fill all details to sign up!')
    } else {
      this.setState({
        isLoading: true,
      })
      firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((res) => {
        res.user.updateProfile({
          displayName: this.state.displayName
        })
        Alert.alert(
            'Successfully Create Staff Account!',
            'successful',
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false}
        )
        firebase.database().ref('account/' + firebase.auth().currentUser.uid).child('managerid').set(this.state.managerid);
        
        console.log('User registered successfully!')
        this.setState({
          isLoading: false,
          displayName: '',
          email: '', 
          password: ''
        })
        this.props.navigation.navigate('Login')
      })
      .catch(error => this.setState({ errorMessage: error.message }))      
    }
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E"/>
        </View>
      )
    }    
    return (
      <ScrollView style={{alignSelf:'center',keyboardShouldPersistTaps:'always',keyboardDismissMode:'on-drag'}}>
        <View style={styles.containerlogo}>
          <Image source={require('../assets/icon.png')} />
        </View>  
        <TextInput
          style={styles.inputStyle}
          placeholder="Name"
          value={this.state.displayName}
          onChangeText={(val) => this.updateInputVal(val, 'displayName')}
        />      
        <TextInput
          style={styles.inputStyle}
          placeholder="Email"
          value={this.state.email}
          onChangeText={(val) => this.updateInputVal(val, 'email')}
        />
        <TextInput
          style={styles.inputStyle}
          placeholder="Password"
          value={this.state.password}
          onChangeText={(val) => this.updateInputVal(val, 'password')}
          maxLength={15}
          secureTextEntry={true}
        />   
        <Button
          color="#3740FE"
          title="Sign up Staff"
          onPress={() => this.registerUser()}
        />                          
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  containerlogo: {
    alignItems: 'center',
    justifyContent: "center",
  },
  inputStyle: {
    width: '100%',
    marginBottom: 15,
    paddingBottom: 15,
    alignSelf: "center",
    borderColor: "#ccc",
    borderBottomWidth: 1
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  }
});