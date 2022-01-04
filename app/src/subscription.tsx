import React from 'react';
import { User } from "firebase/auth";
import { getDoc, onSnapshot, doc, setDoc, DocumentData, DocumentSnapshot, DocumentReference, collection, QuerySnapshot } from "firebase/firestore";
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

import { BoxStoreType, RecipeBoxActionType, UnsubMap, Visibility } from './types';

import { db } from './backend'
import { addBox, subscribeToBox } from './utils';

async function initializeUser(user: User) {
  console.log(user)
  let userRef = doc(db, "users", user.uid);
  let userDoc = await getDoc(userRef)
  if (!userDoc.exists() && !user.isAnonymous) {
    await setDoc(userRef, { "new": false, "name": user.displayName });
    const userBoxRef = await addBox(user, `${user.displayName}'s box`, null);
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

        let recipesRef = collection(db, "boxes", boxRef.id, "recipes")
        let recipesUnsub = onSnapshot(recipesRef, (snapshot) => handleRecipesSnapshot(snapshot, dispatch, boxRef.id))
        unsubMap.boxMap.set(boxRef.id, { recipesUnsub, boxUnsub })
      } else {
        subs.delete(boxRef.id)
      }
    }
  )
  for (let [boxId, sub] of subs.entries()) {
    dispatch({type: "REMOVE_BOX", boxId})
    sub.boxUnsub && sub.boxUnsub()
    sub.recipesUnsub && sub.recipesUnsub()
    unsubMap.boxMap.delete(boxId)
  }
}

async function handleRecipesSnapshot(snapshot: QuerySnapshot<DocumentData>, dispatch: React.Dispatch<RecipeBoxActionType>, boxId: string) {
  let changes = snapshot.docChanges()
  for (let change of changes) {
    let doc = change.doc;
    let data = doc.data()
    if (change.type === "added" || change.type === "modified") {
      dispatch({ type: "ADD_RECIPE", recipeId: doc.id, boxId, payload: data })
    } else {
      dispatch({ type: "REMOVE_RECIPE", recipeId: doc.id, boxId })
    }
  }
}

async function handleBoxSnapshot(
  snapshot: DocumentSnapshot<DocumentData>,
  dispatch: React.Dispatch<RecipeBoxActionType>,
  unsubMap: UnsubMap,
) {
  let box = snapshot.data() as BoxStoreType

  if (box === undefined) {
    dispatch({ type: "REMOVE_BOX", boxId: snapshot.id })
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
}



export function unsubscribe(unsubMap: UnsubMap) {
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
