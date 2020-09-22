import firebase from 'firebase';
require('@firebase/firestore')
var firebaseConfig = {
  apiKey: "AIzaSyBuzRC2kPCnuTgkjpDe-N3JAI2U-8_J3Xs",
  authDomain: "book-santa-77f89.firebaseapp.com",
  databaseURL: "https://book-santa-77f89.firebaseio.com",
  projectId: "book-santa-77f89",
  storageBucket: "book-santa-77f89.appspot.com",
  messagingSenderId: "591460714793",
  appId: "1:591460714793:web:785b1081b5fdf21e5acf38"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
