import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import "firebase/compat/auth";
import "firebase/compat/storage";
import "firebase/compat/messaging";
var firebaseConfig = {
  apiKey: "AIzaSyCiZTRKS9pi-j2avTGeTHtDkDIg_h6phA8",
  authDomain: "pazzypay.firebaseapp.com",
  databaseURL: "https://pazzypay-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pazzypay",
  storageBucket: "pazzypay.appspot.com",
  messagingSenderId: "365768663568",
  appId: "1:365768663568:web:29c927236cc7e13029a095",
  measurementId: "G-CQSVF6PPLY"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;