import { useMemo, useReducer, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, getDoc, onSnapshot, Unsubscribe, doc, setDoc, DocumentReference } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import Modal from 'react-modal';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

import Body from './Body/Body';
import { RecipeBoxStateType, RecipeBoxActionType, BoxType } from './types';
import { RecipeBoxContext, initState } from './context';
import { recipeBoxReducer } from './reducer';
import Header from './Header/Header';
import { Recipe } from 'schema-dts';


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

Modal.setAppElement('#root'); // for accessibility. See: https://reactcommunity.org/react-modal/accessibility/

function App() {

  const [state, dispatch] = useReducer<React.Reducer<RecipeBoxStateType, RecipeBoxActionType>>(recipeBoxReducer, initState())

  const recipesValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  const user = getAuth().currentUser;

  useEffect(
    () => {
      // fetch any boxes associated with this user
      if (user === null) {
        return
      }

      let userRef = doc(db, "users", user.uid);
      getDoc(userRef).then(
        u => {
          if (!u.exists()) {
            let userBoxRef = doc(db, "boxes", user.uid);
            getDoc(userBoxRef).then(
              ub => {
                if (!ub.exists()) {
                  setDoc(userBoxRef, { owners: [userRef], name: `${user.displayName}'s box` })
                } else {
                  alert(`${user.displayName}'s box existed even though the user didn't?`)
                }
              }
            )
            setDoc(userRef, { "new": false, "boxes": [userBoxRef] })
          }
        }
      )

      let unsubscribes: Unsubscribe[] = [];
      // subscription for changes to user
      let unsub = onSnapshot(userRef, (snapshot) => {
        console.log("got snapshot:", { userRef, snapshot })
        let d = snapshot.data()
        if (d === undefined) {
          return
        }
        let boxes = d!.boxes as DocumentReference[]

        boxes.forEach(b => {
          // subscription for changes to boxes
          let boxRef = doc(db, "boxes", b.id)
          let boxRecipesRef = collection(db, "boxes", b.id, "recipes")
          getDoc(boxRef)
            .then(boxData => {
              // subscription for changes to recipes within boxes
              unsub = onSnapshot(boxRecipesRef, (snapshot) => {
                console.log("got snapshot:", { boxRecipesRef, snapshot })
                getDocs(collection(db, "boxes", b.id, "recipes")).then(querySnap => {
                  let recipes = new Map(snapshot.docs.map(r => [r.id, r.data() as Recipe]))
                  let box = { recipes, name: boxData.data.name, owners: [] }
                  dispatch({ type: "SET_BOXES", payload: new Map([[b.id, box as BoxType]]) })
                })
              })
              unsubscribes.push(unsub)
            })
        })
      })
      unsubscribes.push(unsub)
      return () => { console.log("did unsubscribe"); unsubscribes.forEach(unsub => unsub()) }
    }
    , [user]
  )

  return (
    <RecipeBoxContext.Provider value={recipesValue}>
      <Header />
      <Body />
    </RecipeBoxContext.Provider>
  );
}


export default App;
