import React from 'react';
import { User } from "firebase/auth";
import { getDoc, onSnapshot, doc, setDoc, DocumentData, DocumentSnapshot, DocumentReference, collection, QuerySnapshot } from "firebase/firestore";
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

import { ActionType, UnsubMap } from './types';

import { db } from './backend'
import { addBox, subscribeToBox } from './utils';
import { boxConverter, BoxEntry, RecipeEntry } from './storage';

async function initializeUser(user: User) {
  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef)
  if (!userDoc.exists() && !user.isAnonymous) {
    await setDoc(userRef, { "new": false, "name": user.displayName });
    const userBoxRef = await addBox(user, `${user.displayName}'s box`, null);
    if (userBoxRef !== undefined) {
      await subscribeToBox(user, userBoxRef.id)
    }
  }
  return userRef
}

export async function subscribeToUser(user: User, dispatch: React.Dispatch<ActionType>, unsubMap: UnsubMap) {
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
  dispatch: React.Dispatch<ActionType>,
  unsubMap: UnsubMap,
) {
  const data = snapshot.data()
  if (data === undefined) {
    return
  }

  // oooooh, TODO, implement this :/
  // dispatch({ type: "SET_USER", payload: data as Map<string, BoxEntry> })
  const subs = new Map(unsubMap.boxMap)

  data.boxes.forEach(
    (boxRef: DocumentReference) => {
      if (!unsubMap.boxMap.has(boxRef.id)) {
        const boxUnsub = onSnapshot(
          boxRef.withConverter(boxConverter), (snapshot) => handleBoxSnapshot(snapshot, dispatch, unsubMap))

        const recipesRef = collection(db, "boxes", boxRef.id, "recipes")
        const recipesUnsub = onSnapshot(recipesRef, (snapshot) => handleRecipesSnapshot(snapshot, dispatch, boxRef.id))
        unsubMap.boxMap.set(boxRef.id, { recipesUnsub, boxUnsub })
      } else {
        subs.delete(boxRef.id)
      }
    }
  )
  for (const [boxId, sub] of subs.entries()) {
    dispatch({type: "REMOVE_BOX", boxId})
    sub.boxUnsub && sub.boxUnsub()
    sub.recipesUnsub && sub.recipesUnsub()
    unsubMap.boxMap.delete(boxId)
  }
}

async function handleRecipesSnapshot(snapshot: QuerySnapshot<DocumentData>, dispatch: React.Dispatch<ActionType>, boxId: string) {
  const changes = snapshot.docChanges()
  for (const change of changes) {
    const doc = change.doc;
    const data = doc.data()
    if (change.type === "added" || change.type === "modified") {
      dispatch({ type: "ADD_RECIPE", recipeId: doc.id, boxId, payload: data as RecipeEntry })
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
