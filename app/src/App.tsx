import { useMemo, useReducer } from 'react';
import 'firebase/auth';
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import firebase from 'firebase/compat/app';

import RecipeTable from './RecipeTable';
import { StateType, ActionType } from './types';
import { RecipeBoxContext, initState } from './context';
import { recipeBoxReducer } from './reducer';
import Header from './Header';
import SignInScreen from './Auth';



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

export const app = firebase.initializeApp(firebaseConfig);

// setup auth emulator
const auth = getAuth();
connectAuthEmulator(auth, "http://localhost:9099");

// firebaseApps previously initialized using initializeApp()
export const db = getFirestore();
connectFirestoreEmulator(db, 'localhost', 8080);



function Content() {

  const [state, dispatch] = useReducer<React.Reducer<StateType, ActionType>>(recipeBoxReducer, initState())

  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  console.log(getAuth().currentUser)

  return (
    <RecipeBoxContext.Provider value={contextValue}>
      <Header />
      <RecipeTable />
    </RecipeBoxContext.Provider>
  );
}


function App() {
  return <SignInScreen Content={<Content />} />
}

export default App;
