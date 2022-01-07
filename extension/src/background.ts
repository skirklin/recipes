import { getAuth, signInWithPopup, GoogleAuthProvider, connectAuthEmulator } from "firebase/auth";

import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";


// Configure Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyDnTpynPmWemzfi-AHzPEgu2TqZ0e-8UUA",
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
if (process.env.NODE_ENV === "development") {
  connectAuthEmulator(auth, "http://localhost:9099");
}

// setup firestore emulator
export const db = getFirestore();
if (process.env.NODE_ENV === "development") {
  connectFirestoreEmulator(db, 'localhost', 8080);
}

const provider = new GoogleAuthProvider();


signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential!.accessToken;
    // The signed-in user info.
    const user = result.user;
    // ...
    console.log({ user, token })
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
    console.log({ errorCode, errorMessage, email, credential })
  }
  );



chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
      "from the extension");
    if (request.greeting === "hello")
      sendResponse({ farewell: "goodbye" });
  }
);


console.log('Hello Background');

export { }