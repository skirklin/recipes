import React from 'react';
import { User } from "firebase/auth";
import { getDoc, onSnapshot, doc, setDoc, DocumentData, DocumentSnapshot, DocumentReference } from "firebase/firestore";
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

import { BoxStoreType, RecipeBoxActionType, UnsubMap, Visibility } from './types';

import { db } from './backend'
import { addBox, subscribeToBox } from './utils';

async function initializeUser(user: User) {
  let userRef = doc(db, "users", user.uid);
  let userDoc = await getDoc(userRef)
  if (!userDoc.exists()) {
    await setDoc(userRef, { "new": false, "name": user.displayName });
    const userBoxRef = await addBox(user, `${user.displayName}'s box`);
    if (userBoxRef !== undefined) {
      await subscribeToBox(user, userBoxRef.id)
    }
  }
  return userRef
}

export async function subscribeToUser(user: User, dispatch: React.Dispatch<RecipeBoxActionType>, unsubMap: UnsubMap) {
  // fetch any boxes associated with this user
  if (user === null) {
    return
  }

  const userRef = await initializeUser(user)

  // subscription for changes to user
  unsubMap.userUnsub = onSnapshot(userRef,
    snapshot => (handleUserSnapshot(snapshot, dispatch, unsubMap))
  )
}

async function handleUserSnapshot(
  snapshot: DocumentSnapshot<DocumentData>,
  dispatch: React.Dispatch<RecipeBoxActionType>,
  unsubMap: UnsubMap,
) {
  let data = snapshot.data()
  if (data === undefined) {
    return
  }

  dispatch({ type: "SET_USER", payload: data })
  let subs = new Map(unsubMap.boxMap)

  data.boxes.forEach(
    (boxRef: DocumentReference) => {
      if (!unsubMap.boxMap.has(boxRef.id)) {
        let boxUnsub = onSnapshot(boxRef, (snapshot) => handleBoxSnapshot(snapshot, dispatch, unsubMap))
        unsubMap.boxMap.set(boxRef.id, boxUnsub)
      } else {
        subs.delete(boxRef.id)
      }
    }
  )
  for (const [boxId, unsub] of subs.entries()) {
    // any unsubscribe functions not removed in the previous loop should be
    // called.
    console.log("unsubscribing:", unsub)
    dispatch({type: "REMOVE_BOX", boxId })
    unsub()
    unsubMap.boxMap.delete(boxId)
  }
}

async function handleBoxSnapshot(
  snapshot: DocumentSnapshot<DocumentData>,
  dispatch: React.Dispatch<RecipeBoxActionType>,
  unsubMap: UnsubMap,
) {
  let box = snapshot.data() as BoxStoreType

  if (box === undefined) {
    dispatch({ type: "REMOVE_BOX", boxId: snapshot.id})
    return
  }

  let owners = []
  for (let owner of box.owners) {
    let ownerDoc = await getDoc(doc(db, "users", owner))
    if (ownerDoc.exists() && ownerDoc.data().name) {
      owners.push(ownerDoc.data().name)
    }
  }

  let boxData = {
    owners: owners,
    visibility: Visibility.private,
    data: {
      name: box.data.name,
    },
  }
  dispatch({ type: "ADD_BOX", boxId: snapshot.id, payload: boxData })

  for (let recipeRef of box.data.recipes) {
    if (!unsubMap.recipeMap.has(recipeRef.id)) {
      let recipeUnsub = onSnapshot(recipeRef, (recipeSnapshot) => handleRecipeSnapshot(recipeSnapshot, dispatch, snapshot.id))
      unsubMap.recipeMap.set(recipeRef.id, recipeUnsub)
    }
  }
}



async function handleRecipeSnapshot(
  snapshot: DocumentSnapshot<DocumentData>,
  dispatch: React.Dispatch<RecipeBoxActionType>,
  boxId: string,
) {

  let data = snapshot.data()
  if (data === undefined) {
    dispatch({ type: "REMOVE_RECIPE", recipeId: snapshot.id, boxId })
  } else {
    dispatch({ type: "ADD_RECIPE", recipeId: snapshot.id, boxId, payload: data })
  }
}

export function unsubscribe(unsubMap: UnsubMap) {
  unsubMap.userUnsub && unsubMap.userUnsub();
  unsubMap.boxesUnsub && unsubMap.boxesUnsub();
  for (const boxUnsub of unsubMap.boxMap.values()) {
    boxUnsub();
  }
  for (const recipeUnsub of unsubMap.recipeMap.values()) {
    recipeUnsub()
  }
  unsubMap.userUnsub = undefined;
  unsubMap.boxesUnsub = undefined;
  unsubMap.boxMap.clear();
  unsubMap.recipeMap.clear();
}
