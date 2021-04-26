import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBcRiYBswqRoEh_U7A3Qt2qaqfCJJxzwok",
    authDomain: "gestor-nominas-713c2.firebaseapp.com",
    projectId: "gestor-nominas-713c2",
    storageBucket: "gestor-nominas-713c2.appspot.com",
    messagingSenderId: "12766824650",
    appId: "1:12766824650:web:6e27d13f6d990ff230cc33"
  };
  
  firebase.initializeApp(firebaseConfig);

  //Utils
  const auth= firebase.auth();
  const storage= firebase.storage();
  const db= firebase.firestore();

  //Exports
  export {auth, storage, db};