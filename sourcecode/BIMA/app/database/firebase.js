// Connect to firebase

import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDY6yzPvAZX3LOgaWilmSuCWDOWw4MY77c",
    authDomain: "project-bima-by-jirapas.firebaseapp.com",
    databaseURL: "https://project-bima-by-jirapas.firebaseio.com",
    projectId: "project-bima-by-jirapas",
    storageBucket: "project-bima-by-jirapas.appspot.com",
    messagingSenderId: "721820261307",
    appId: "1:721820261307:web:95b6fae2652551091e429e"
 };

firebase.initializeApp(firebaseConfig);

export default firebase;

