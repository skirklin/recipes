import React from 'react';
import { User } from "firebase/auth";
import { getDoc, onSnapshot, doc, setDoc, DocumentData, QuerySnapshot, DocumentSnapshot, DocumentReference } from "firebase/firestore";
import { collection } from "firebase/firestore";
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

import { RecipeBoxActionType, UnsubMap, Visibility } from './types';

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

  console.log({ unsubMap });
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

  let userBoxesRef = collection(db, "users", snapshot.id, "boxes")
  dispatch({ type: "SET_USER", payload: data })
  unsubMap.boxesUnsub = onSnapshot(userBoxesRef, snapshot => handleBoxesSnapshot(snapshot, dispatch, unsubMap))
}

async function handleBoxesSnapshot(
  snapshot: QuerySnapshot<DocumentData>,
  dispatch: React.Dispatch<RecipeBoxActionType>,
  unsubMap: UnsubMap,
) {

  snapshot.docChanges().forEach(change => {
    let data = change.doc.data()
    let boxRef = data.box as DocumentReference
    if (change.type === "added") {
      let boxUnsub = onSnapshot(boxRef, (snapshot) => handleBoxSnapshot(snapshot, dispatch))

      // // subscription for changes to recipes within boxes
      let boxRecipesRef = collection(db, "boxes", boxRef.id, "recipes")
      let recipeUnsub = onSnapshot(boxRecipesRef, snapshot => handleRecipesSnapshot(snapshot, dispatch, boxRef.id))
      unsubMap.boxMap.set(change.doc.id, { boxUnsub, recipeUnsub })
    }
    if (change.type === "modified") {
      // this branch probably shouldn't ever happen, since the boxes
      // subcollection is just full of references to actual boxes. If I start
      // allowing storage of de-normalized boxes then this would become
      // reasonable to expect.
      console.warn("changes seen to", change.doc, ":", change.doc.data());
    }
    if (change.type === "removed") {
      dispatch({ type: "REMOVE_BOX", boxId: boxRef.id })
    }
  })

}

async function handleBoxSnapshot(
  snapshot: DocumentSnapshot<DocumentData>,
  dispatch: React.Dispatch<RecipeBoxActionType>
) {
  let data = snapshot.data()

  if (data === undefined) {
    return
  }

  let owners = []
  for (let owner of data.owners) {
    let ownerDoc = await getDoc(doc(db, "users", owner))
    if (ownerDoc.exists() && ownerDoc.data().name) {
      owners.push(ownerDoc.data().name)
    }
  }

  let boxData = {
    id: snapshot.id,
    owners: owners,
    visibility: Visibility.private,
    data: {
      name: data.name,
    },
  }
  dispatch({ type: "ADD_BOX", boxId: snapshot.id, payload: boxData })
}



async function handleRecipesSnapshot(
  snapshot: QuerySnapshot<DocumentData>,
  dispatch: React.Dispatch<RecipeBoxActionType>,
  boxId: string,
) {

  snapshot.docChanges().forEach(change => {
    const recipeId = change.doc.id
    if (change.type === "added" || change.type === "modified") {
      let data = change.doc.data()
      dispatch({ type: "ADD_RECIPE", recipeId, boxId, payload: data })
    }
    if (change.type === "removed") {
      dispatch({ type: "REMOVE_RECIPE", recipeId, boxId })
    }
  })
}

export function unsubscribe(unsubMap: UnsubMap) {
  unsubMap.userUnsub && unsubMap.userUnsub();
  unsubMap.boxesUnsub && unsubMap.boxesUnsub();
  for (const boxUnsub of unsubMap.boxMap.values()) {
    boxUnsub.boxUnsub && boxUnsub.boxUnsub();
    boxUnsub.recipeUnsub && boxUnsub.recipeUnsub();
  }
  unsubMap.userUnsub = undefined;
  unsubMap.boxesUnsub = undefined;
  unsubMap.boxMap.clear();
}
