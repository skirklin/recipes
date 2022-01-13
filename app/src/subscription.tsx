import React from 'react';
import { User } from "firebase/auth";
import { getDoc, onSnapshot, doc, setDoc, DocumentSnapshot, collection, QuerySnapshot } from "firebase/firestore";
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

import { ActionType, BoxId, UnsubMap, Visibility } from './types';

import { db } from './backend'
import { addBox, subscribeToBox } from './utils';
import { boxConverter, BoxEntry, recipeConverter, RecipeEntry, userConverter, UserEntry } from './storage';

async function initializeUser(user: User) {
  const userRef = doc(db, "users", user.uid).withConverter(userConverter);
  const userDoc = await getDoc(userRef)
  if (!userDoc.exists() && !user.isAnonymous) {
    await setDoc(userRef, new UserEntry(user.displayName || "Anonymous", Visibility.private, [], userRef.id));
    const newUser = await getDoc(userRef)
    if (newUser.exists()) {
      const userEntry = newUser.data()
      const userBoxRef = await addBox(userEntry, `${user.displayName}'s box`, null);
      if (userBoxRef !== undefined) {
        await subscribeToBox(newUser.data() || null, userBoxRef.id)
      }
    }
  }
  return userRef
}

export async function subscribeToUser(user: User, dispatch: React.Dispatch<ActionType>, unsubMap: UnsubMap) {
  console.log("subscribing to user", user)
  // fetch any boxes associated with this user
  if (user === null) {
    return
  }

  const userRef = await initializeUser(user)
  
  // subscription for changes to user
  unsubMap.userUnsub = onSnapshot(userRef.withConverter(userConverter),
    snapshot => (handleUserSnapshot(snapshot, dispatch, unsubMap))
  )
}

async function handleUserSnapshot(
  snapshot: DocumentSnapshot<UserEntry>,
  dispatch: React.Dispatch<ActionType>,
  unsubMap: UnsubMap,
) {
  const user = snapshot.data()
  if (user === undefined) {
    return
  }

  dispatch({ type: "ADD_USER", user })

  user.boxes.forEach(
    (bid: string) => {
      if (!unsubMap.boxMap.has(bid)) {
        const boxRef = doc(db, "boxes", bid).withConverter(boxConverter)
        const boxUnsub = onSnapshot(
          boxRef.withConverter(boxConverter), (snapshot) => handleBoxSnapshot(snapshot, dispatch, unsubMap))

        const recipesRef = collection(db, "boxes", boxRef.id, "recipes").withConverter(recipeConverter)
        const recipesUnsub = onSnapshot(recipesRef, (snapshot) => handleRecipesSnapshot(snapshot, dispatch, boxRef.id))
        unsubMap.boxMap.set(boxRef.id, { recipesUnsub, boxUnsub })
      }
    }
  )
}

async function handleRecipesSnapshot(snapshot: QuerySnapshot<RecipeEntry>, dispatch: React.Dispatch<ActionType>, boxId: BoxId) {
  const changes = snapshot.docChanges()
  for (const change of changes) {
    console.log({change})
    const doc = change.doc;
    const data = doc.data()
    if (change.type === "added" || change.type === "modified") {
      dispatch({ type: "ADD_RECIPE", recipeId: doc.id, boxId, payload: data })
    } else {
      dispatch({ type: "REMOVE_RECIPE", recipeId: doc.id, boxId })
    }
  }
}

async function handleBoxSnapshot(
  snapshot: DocumentSnapshot<BoxEntry>,
  dispatch: React.Dispatch<ActionType>,
  unsubMap: UnsubMap,
) {
  const box = snapshot.data()

  if (box === undefined) {
    dispatch({ type: "REMOVE_BOX", boxId: snapshot.id })
    return
  }

  dispatch({ type: "ADD_BOX", boxId: snapshot.id, payload: box })
}



export function unsubscribe(unsubMap: UnsubMap) {
  console.log("unsubscribing everything")
  unsubMap.userUnsub && unsubMap.userUnsub();
  unsubMap.boxesUnsub && unsubMap.boxesUnsub();
  for (const box of unsubMap.boxMap.values()) {
    box.boxUnsub && box.boxUnsub();
    box.recipesUnsub && box.recipesUnsub();
  }
  unsubMap.userUnsub = undefined;
  unsubMap.boxesUnsub = undefined;
  unsubMap.boxMap.clear();
}
