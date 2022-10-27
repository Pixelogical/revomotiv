import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { doc, onSnapshot } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyBcHKUAJLMSycCLCrM2dG8iSFV3Sy_ZTiY",
    authDomain: "iran-revomotiv-33174.firebaseapp.com",
    projectId: "iran-revomotiv-33174",
    storageBucket: "iran-revomotiv-33174.appspot.com",
    messagingSenderId: "1076281303985",
    appId: "1:1076281303985:web:2ef92647d62126d3215390",
    measurementId: "G-NEBGJGJ8Z1"
  };

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp)

export {firebaseApp, db, collection, getDocs,doc, onSnapshot};