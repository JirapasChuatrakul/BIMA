import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import {View ,Button ,Platform ,Alert ,Image ,ScrollView ,Keyboard ,StyleSheet ,TextInput} from 'react-native';
import firebase from '../database/firebase';


Keyboard.dismiss()
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function AlertManager() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [topic, setTopic] = useState('');;
  const [detail, setDetail] = useState('');;
  const [alertid, setAlertid] = useState('');;
  const [managerid, setManagerid] = useState('');;


  ReportPush = (topic,detail) => {
    firebase.database().ref('alertmanager/' + managerid).child('alertid'+ alertid).set({staffid:firebase.auth().currentUser.displayName,topic,detail});
    Alert.alert(
      'Successfully Save Alert!',
      'alert is now registed in database',
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false}
    )
    setTopic('');
    setDetail('');
  }

  SendReport = (topic,detail) => {
    firebase.database().ref('account/' + firebase.auth().currentUser.uid).child('managerid').on('value', snapshot => {
      setManagerid(snapshot.val())});
    firebase.database().ref('alertmanager').child('alertcount').set(firebase.database.ServerValue.increment(1));
    firebase.database().ref('alertmanager').child('alertcount').on('value', snapshot => {
      setAlertid(snapshot.val());
    })

    Alert.alert(
      'Alert is send!',
      'Save alert to manager notification?',
      [
        {text: 'OK', onPress: () => ReportPush(topic,detail)},
      ],
      {cancelable: false}
    )
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  useEffect(() => {
    return () => {
      console.log("Unmounted");
    };
  }, []);

  return (
    <ScrollView style={{alignSelf:'center',keyboardShouldPersistTaps:'always',keyboardDismissMode:'on-drag'}}>
        <View style={styles.containerlogo}>
          <Image source={require('../assets/comment.png')} />
        </View>
        <TextInput style={{height:40, width:360, margin:20, paddingLeft:20, marginTop:20, alignSelf:'center', borderWidth: StyleSheet.hairlineWidth}}
            placeholder="Topic"
            placeholderTextColor="#8A8F9E"
            autoCorrect={false}
            onChangeText={topic => setTopic(topic)}
            value={topic}
        />
        <TextInput style={{height:120, padding:20, borderWidth: StyleSheet.hairlineWidth, width:360, marginBottom:15, alignSelf:'center' }}
             placeholder="Detail"
             placeholderTextColor="#8A8F9E"
            autoCorrect={false}
             onChangeText={detail => setDetail(detail)}
             value={detail}
         />
        <Button title='Send Alert to Manager' onPress={ async () => {
            await sendPushNotification(expoPushToken,topic,detail);
        }}/> 
    </ScrollView> 
  );
}

async function sendPushNotification(expoPushToken,topic,detail) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: topic,
    body: detail,
    data: { someData: 'goes here' },
  };

  SendReport(topic,detail)
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  return token;
}

const styles = StyleSheet.create({
    containerlogo: {
        marginTop: 10,
        alignItems: 'center',
        justifyContent: "center",
      },
    background: {
        backgroundColor: 'grey',
        paddingTop: Platform.OS === "android" ? 25:0,
        width: '100%',
        height: '100%',
        alignItems: 'center'
    },
    input: {
        marginTop:40,
        color:'white',
        fontSize:30,
        backgroundColor: "#2e2a2a",
        height: 50,
        width: '90%',
        textDecorationColor: "white",
        borderColor: 'black',
        borderWidth: 2
    },
    flatList:{
        width: "100%"
    },
    listItem: {
        width: "90%",
        height: 50,
        backgroundColor: "#2e2e2e",
        borderRadius: 25,
        marginVertical: 4,
        marginHorizontal: "5%",
        justifyContent: "center"
    },
    listItemTitle: {
        color: "white",
        textAlign: "center",
        fontSize: 18
    },
    redButton: {
        justifyContent: "center",
        width: "90%",
        height: 50,
        backgroundColor: "red",
        borderRadius: 25,
        marginHorizontal: 20,
        marginVertical: 10
    },
    greenButton: {
        justifyContent: "center",
        width: "90%",
        height: 50,
        backgroundColor: "green",
        borderRadius: 25,
        marginHorizontal: 20,
        marginVertical: 10
    },
    buttonText: {
        color: "white",
        textAlign: "center",
        fontSize: 16
    }
})