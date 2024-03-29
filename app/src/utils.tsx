import { getAuth, signOut } from 'firebase/auth';
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import _ from 'lodash';
import React from 'react';
import { Comment, Recipe } from "schema-dts"
import { db } from './backend';
import { boxConverter, BoxEntry, recipeConverter, RecipeEntry, userConverter, UserEntry } from './storage';
import { ActionType, AppState, BoxId, RecipeId, UserId, Visibility } from './types';


/* helper functions for converting between structured data and text. */
export function strToIngredients(str: string): Recipe["recipeIngredient"] {
  /* convert text with one ingredient per line to a list of ingredients.

  ingredient blah blah
  ingredient 2 blah blah blah

   ->

  ["ingredient blah blah", "ingredient 2 blah blah blah"]
  */
  const lines = str.split("\n")
  return lines
}


export function strToInstructions(str: string): Recipe["recipeInstructions"] {
  /* convert text with one ingredient per line to a list of ingredients.

  step 1 blah blah
  step 2 blah blah blah

   ->

  [
      {"@type": "HowToStep", "text": "ingredient blah blah"},
      {"@type": "HowToStep", "text": "ingredient 2 blah blah blah"}
  ]
  */
  const lines = _.filter(str.trim().split("\n"))
  return lines.map(s => ({ "@type": "HowToStep", text: s }))
}

export function instructionsToStr(instructions: Recipe["recipeInstructions"]): string {
  if (instructions === undefined) {
    return ""
  }
  if (typeof instructions === "string") {
    return instructions.toString()
  }
  const steps = Array.prototype.map.call(instructions, (x) => x.text !== undefined ? x.text.trim() : "");
  return steps.join("\n\n")
}

export function ingredientsToStr(ingredients: Recipe["recipeIngredient"]): string {
  const steps = Array.prototype.map.call(ingredients, x => x.toString());
  return steps.join("\n")
}

export function authorToStr(author: Recipe["author"]): string | undefined {
  if (author === undefined) {
    return undefined
  } else if (typeof author === "object") {
    if (Object.prototype.hasOwnProperty.call(author, "name")) {
      // this is hacky, but typescript was making this brutally unpleasant and I didn't want to spend more time on it.
      return (author as { name: string }).name
    } else {

      const names = Array.prototype.map.call(author,
        (x) => {
          if (x['@type'] === "Person") {
            return x['name']
          } else {
            return ""
          }
        })
      const nonEmptyNames = _.filter(names, (x: string) => x.length > 0)
      return nonEmptyNames.join(", ")
    }
  }
  return undefined
}


export function strToAuthor(author: string): Recipe["author"] {
  return { "@type": "Person", name: author }
}


export function commentToStr(comment: Recipe["comment"]): string | undefined {
  if (comment === undefined) {
    return undefined
  } else if (typeof comment === "object") {
    if (Object.prototype.hasOwnProperty.call(comment, "text")) {
      // this is hacky, but typescript was making this brutally unpleasant and I didn't want to spend more time on it.
      return (comment as { text: string }).text
    } else {
      alert("Unfamiliar comment format, please report")
    }
  }
  return undefined
}


export function strToComment(text: string): Comment {
  return { "@type": "Comment", text }
}

export function parseCategories(categories: Recipe["recipeCategory"]): string[] {
  if (categories === undefined) {
    return []
  } else if (typeof categories === "string") {
    return [categories]
  } else {
    return Array.prototype.filter.call(categories, x => true)
  }
}

export function formatCategories(tags: string[]): Recipe["recipeCategory"] {
  return tags
}

export function getRecipeFromState(state: AppState, boxId: BoxId, recipeId: RecipeId) {
  const box = state.boxes.get(boxId);
  if (box === undefined) {
    return
  }
  return box.recipes.get(recipeId)
}

export function setRecipeInState(state: AppState, boxId: BoxId, recipeId: RecipeId, recipe: RecipeEntry) {
  const box = state.boxes.get(boxId);
  if (box === undefined) {
    return
  }
  return box.recipes.set(recipeId, recipe)

}

export async function getRecipe(state: AppState, boxId: BoxId | undefined, recipeId: RecipeId | undefined) {
  let recipe: RecipeEntry | undefined
  if (boxId === undefined || recipeId === undefined) {
    return undefined
  }
  const box = state.boxes.get(boxId);
  if (box !== undefined) {
    recipe = box.recipes.get(recipeId)
  } else {
    const ref = doc(db, "boxes", boxId, "recipes", recipeId).withConverter(recipeConverter)
    recipe = (await getDoc(ref)).data()
  }
  return recipe
}

export async function getRecipes(state: AppState, box: BoxEntry) {
  const user = state.authUser;
  const recipes = new Map<string, RecipeEntry>()
  if (user === null) {
    return recipes
  }
  const colRef = collection(db, "boxes", box.id as string, "recipes").withConverter(recipeConverter)
  if (box.visibility === "public" || box.owners.includes(user.uid)) {
    (await getDocs(colRef))
      .docs.forEach(doc => recipes.set(doc.id, doc.data()));
  } else {
    (await getDocs(query(colRef, where("owners", "array-contains", user.uid))))
      .docs.forEach(doc => recipes.set(doc.id, doc.data()));
    (await getDocs(query(colRef, where("visibility", "==", "public"))))
      .docs.forEach(doc => recipes.set(doc.id, doc.data()));
  }
  return recipes
}

export async function getBox(state: AppState, boxId: BoxId) {
  const boxRef = doc(db, "boxes", boxId).withConverter(boxConverter)
  const boxDoc = await getDoc(boxRef)
  if (!boxDoc.exists() || boxDoc.data() === undefined) {
    return undefined
  }
  const box = boxDoc.data()
  box.recipes = await getRecipes(state, box)
  return box
}

export function getBoxFromState(state: AppState, boxId: BoxId) {
  return state.boxes.get(boxId);
}

export async function getUser(state: AppState, userId: UserId) {
  const userRef = doc(db, "users", userId).withConverter(userConverter)
  const userDoc = await getDoc(userRef)
  if (!userDoc.exists() || userDoc.data() === undefined) {
    return undefined
  }
  const user = userDoc.data()
  return user

}

export function getAppUserFromState(state: AppState) {
  if (state.authUser === null) {
    return undefined
  }
  return state.users.get(state.authUser.uid)
}

export function getUserFromState(state: AppState, userId: UserId) {
  return state.users.get(userId)
}

export function setBoxInState(state: AppState, boxId: BoxId, box: BoxEntry) {
  state.boxes.set(boxId, box);
}

export async function subscribeToBox(user: UserEntry | null, boxId: BoxId) {
  if (user === null) {
    return undefined
  }
  const boxRef = doc(db, "boxes", boxId)
  const boxDoc = await getDoc(boxRef)
  if (!boxDoc.exists()) {
    return undefined
  }
  await updateDoc(doc(db, "users", user.id), { boxes: arrayUnion(boxRef) })
}


export async function unsubscribeFromBox(user: UserEntry | null, boxId: BoxId) {
  if (user === null) {
    return undefined
  }
  const boxRef = doc(db, "boxes", boxId)
  await updateDoc(doc(db, "users", user.id), { boxes: arrayRemove(boxRef) })
}

export async function uploadRecipes(boxId: BoxId, user: UserEntry) {
  const fileHandles = await window.showOpenFilePicker({
    multiple: true,
  })
  if (user === null) {
    return
  }
  for (const fh of fileHandles) {
    fh.getFile().then(f => {
      f.text().then(
        (text: string) => {
          const jsonobj = JSON.parse(text) as Recipe
          const recipe = new RecipeEntry(
            jsonobj,
            [user.id],
            Visibility.private,
            user.id,
            "placeholder",
            new Date(),
            new Date(),
            user.id,
          )
          addRecipe(boxId, recipe, null)
        })
    })
  }
}

export async function addRecipe(boxId: BoxId, recipe: RecipeEntry, dispatch: React.Dispatch<ActionType> | null) {
  const colRef = collection(db, "boxes", boxId, "recipes").withConverter(recipeConverter)
  const recipeRef = await addDoc(colRef, recipe)
  return recipeRef
}

export async function addBox(user: UserEntry, name: string, dispatch: React.Dispatch<ActionType> | null) {
  if (user === null) {
    return undefined
  }
  const boxesCol = collection(db, "boxes").withConverter(boxConverter)
  const boxData = { name }
  const box = new BoxEntry(boxData, [user.id], Visibility.private, user.id, "placeholder", new Date(), new Date(), user.id)
  const userRef = doc(db, "users", user.id)
  const boxRef = await addDoc(boxesCol, box)
  await updateDoc(userRef, { boxes: arrayUnion(boxRef) })
  return boxRef
}

export function createNewRecipe(user: UserEntry) {
  const owners = [user.id];
  const data: Recipe = {
    "@type": "Recipe",
    "name": "New recipe",
    "recipeInstructions": [],
    "recipeIngredient": [],
    "description": "",
  }
  return new RecipeEntry(
    data,
    owners,
    Visibility.private,
    user.id,
    "placeholder",
    new Date(),
    new Date(),
    user.id
  )
}


export function createNewBox(user: UserEntry) {
  const name = "New box"
  return new BoxEntry({ name }, [user.id], Visibility.private, user.id, "placeholder", new Date(), new Date(), user.id)
}

export async function deleteRecipe(state: AppState, boxId: BoxId, recipeId: RecipeId, dispatch: React.Dispatch<ActionType>) {
  if (recipeId.startsWith("uniqueId=")) {
    const box = state.boxes.get(boxId)
    if (box !== undefined) {
      box.recipes.delete(recipeId)
    }
  } else {
    dispatch({ type: "REMOVE_RECIPE", boxId, recipeId })
    deleteDoc(doc(db, "boxes", boxId, "recipes", recipeId))
  }
}


export async function saveRecipe(boxId: BoxId, recipeId: RecipeId, recipe: RecipeEntry, dispatch: React.Dispatch<ActionType>) {
  const docRef = doc(db, "boxes", boxId, "recipes", recipeId).withConverter(recipeConverter)
  setDoc(docRef, recipe)
  return docRef
}

export async function deleteBox(state: AppState, boxId: BoxId, dispatch: React.Dispatch<ActionType>) {
  dispatch({ type: "REMOVE_BOX", boxId })
  deleteDoc(doc(db, "boxes", boxId))
}

const objIdMap = new WeakMap();
let objectCount = 0;
export function getUniqueId(rcp: RecipeEntry) {
  if (!objIdMap.has(rcp)) objIdMap.set(rcp, ++objectCount);
  return objIdMap.get(rcp);
}

export function download(recipe: RecipeEntry) {
  const downloadLink = document.createElement("a");
  downloadLink.download = recipe.data.name + ".json"
  downloadLink.innerHTML = "Download File";

  // Create a "file" to download
  downloadLink.href = makeTextFile(JSON.stringify(recipe, null, 2))
  document.body.appendChild(downloadLink);

  // wait for the link to be added to the document
  window.requestAnimationFrame(function () {
    const event = new MouseEvent('click');
    downloadLink.dispatchEvent(event); // synthetically click on it
    document.body.removeChild(downloadLink);
  });
}


let textFile: string | null;

function makeTextFile(text: string) {
  const data = new Blob([text], { type: 'application/ld+json' });

  // If we are replacing a previously generated file we need to
  // manually revoke the object URL to avoid memory leaks.
  if (textFile !== null) {
    window.URL.revokeObjectURL(textFile);
  }

  textFile = window.URL.createObjectURL(data);

  // returns a URL you can use as a href
  return textFile;
}

export function userSignOut(dispatch: React.Dispatch<ActionType>) {
  signOut(getAuth());
  dispatch({ type: "SET_AUTH_USER", authUser: null })
}

export async function setBoxVisiblity(boxId: BoxId, visibility: Visibility) {
  updateDoc(doc(db, "boxes", boxId), { visibility })
}

export async function setRecipeVisiblity(boxId: BoxId, recipeId: RecipeId, visibility: Visibility) {
  updateDoc(doc(db, "boxes", boxId, "recipes", recipeId), { visibility })
}

export function canUpdateRecipe(recipe: RecipeEntry | undefined, box: BoxEntry | undefined, user: UserEntry | undefined) {
  if (user === undefined || recipe === undefined || box === undefined) return false
  const owner = recipe.owners.includes(user.id) || box.owners.includes(user.id)
  return owner
}

export function decodeStr(s: string | undefined) {
  if (s === undefined) {
    return undefined
  }
  return s.replace("&#39;", "'")
}