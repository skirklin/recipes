import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";


// Configure Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyDedu30sRQT4qerzEdts_meMkCM8164sHQ",
  authDomain: "recipe-box-335721.firebaseapp.com",
  projectId: "recipe-box-335721",
  storageBucket: "recipe-box-335721.appspot.com",
  messagingSenderId: "779965064363",
  appId: "1:779965064363:web:78d754d6591b130cdb83ee",
  // measurementId: "G-ZWWFPLHJHE"
};

export const app = initializeApp(firebaseConfig);

// setup auth emulator
const auth = getAuth();
connectAuthEmulator(auth, "http://localhost:9099");

// setup firestore emulator
export const db = getFirestore();
connectFirestoreEmulator(db, 'localhost', 8080);