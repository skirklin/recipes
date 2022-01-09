/* helper functions for converting between structured data and text. */
import { getAuth, User } from 'firebase/auth';
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import _ from 'lodash';
import { Recipe } from "schema-dts"
import { db } from './backend';
import { boxConverter, BoxEntry, recipeConverter, RecipeEntry } from './storage';
import { ActionType, AppState, Visibility } from './types';


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
  const lines = _.filter(str.split("\n"))
  return lines.map(s => ({ "@type": "HowToStep", text: s }))
}

export function instructionsToStr(instructions: Recipe["recipeInstructions"]): string {
  if (instructions === undefined) {
    return ""
  }
  if (typeof instructions === "string") {
    return instructions.toString()
  }
  const steps = Array.prototype.map.call(instructions, (x: Recipe) => x.text);
  return steps.join("\n\n")
}

export function ingredientsToStr(ingredients: Recipe["recipeIngredient"]): string {
  const steps = Array.prototype.map.call(ingredients, x => x.toString());
  return steps.join("\n")
}

export function getRecipeFromState(state: AppState, boxId: string, recipeId: string) {
  const box = state.boxes.get(boxId);
  if (box === undefined) {
    return
  }
  return box.recipes.get(recipeId)
}

export function setRecipeInState(state: AppState, boxId: string, recipeId: string, recipe: RecipeEntry) {
  const box = state.boxes.get(boxId);
  if (box === undefined) {
    return
  }
  return box.recipes.set(recipeId, recipe)

}

export async function getRecipe(state: AppState, boxId: string | undefined, recipeId: string | undefined) {
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

export async function getRecipes(state: AppState, boxId: string) {
  const box = state.boxes.get(boxId)
  let recipes: Map<string, RecipeEntry>
  if (box === undefined) {
    const querySnapshot = await getDocs(collection(db, "boxes", boxId, "recipes").withConverter(recipeConverter))
    const pairs: [string, RecipeEntry][] = querySnapshot.docs.map(doc => [doc.id, doc.data()])
    recipes = new Map<string, RecipeEntry>(pairs)
  } else {
    recipes = box.recipes
  }
  return recipes
}

export async function getBox(state: AppState, boxId: string) {
  const boxRef = doc(db, "boxes", boxId).withConverter(boxConverter)
  const boxDoc = await getDoc(boxRef)
  if (!boxDoc.exists() || boxDoc.data() === undefined) {
    return undefined
  }
  const box = boxDoc.data()
  box.recipes = await getRecipes(state, boxId)
  return box
}

export function getBoxFromState(state: AppState, boxId: string) {
  return state.boxes.get(boxId);
}

export function setBoxInState(state: AppState, boxId: string, box: BoxEntry) {
  state.boxes.set(boxId, box);
}

export async function subscribeToBox(user: User | null, boxId: string) {
  if (user === null) {
    return undefined
  }
  const boxRef = doc(db, "boxes", boxId)
  const boxDoc = await getDoc(boxRef)
  if (!boxDoc.exists()) {
    return undefined
  }
  await updateDoc(doc(db, "users", user.uid), { boxes: arrayUnion(boxRef) })
}


export async function unsubscribeFromBox(user: User | null, boxId: string) {
  if (user === null) {
    return undefined
  }
  const boxRef = doc(db, "boxes", boxId)
  await updateDoc(doc(db, "users", user.uid), { boxes: arrayRemove(boxRef) })
}

export async function uploadRecipes(boxId: string) {
  const fileHandles = await window.showOpenFilePicker({
    multiple: true,
  })
  for (const fh of fileHandles) {
    fh.getFile().then(f => {
      f.text().then(
        (text: string) => {
          const jsonobj = JSON.parse(text) as Recipe
          const user = getAuth().currentUser
          if (user === null) {
            return
          }
          const recipe = new RecipeEntry(jsonobj, [user.uid], Visibility.private, undefined)
          addRecipe(boxId, recipe, null)
        })
    })
  }
}

export async function addRecipe(boxId: string, recipe: RecipeEntry, dispatch: React.Dispatch<ActionType> | null) {
  const colRef = collection(db, "boxes", boxId, "recipes").withConverter(recipeConverter)
  const recipeRef = await addDoc(colRef, recipe)
  return recipeRef
}

export async function addBox(user: User | null, name: string, dispatch: React.Dispatch<ActionType> | null) {
  if (user === null) {
    return undefined
  }
  const boxesCol = collection(db, "boxes").withConverter(boxConverter)
  const boxData = { name }
  const box = new BoxEntry(boxData, [user.uid], Visibility.private, undefined)
  const userRef = doc(db, "users", user.uid)
  const boxRef = await addDoc(boxesCol, box)
  await updateDoc(userRef, { boxes: arrayUnion(boxRef) })
  return boxRef
}

export function createNewRecipe(user: User | null): RecipeEntry {
  let owners: string[]
  if (user === null) {
    owners = [];
  } else {
    owners = [user.uid];
  }
  const data: Recipe = {
    "@type": "Recipe",
    "name": "New recipe",
    "recipeInstructions": [],
    "recipeIngredient": [],
    "description": "",
  }
  return new RecipeEntry(data, owners, Visibility.private, undefined)
}


export function createNewBox(user: User) {
  const name = "New box"
  return new BoxEntry({ name }, [user.uid], Visibility.private, undefined)
}

export async function deleteRecipe(state: AppState, boxId: string, recipeId: string) {
  if (recipeId.startsWith("uniqueId=")) {
    const box = state.boxes.get(boxId)
    if (box !== undefined) {
      box.recipes.delete(recipeId)
    }
  } else {
    deleteDoc(doc(db, "boxes", boxId, "recipes", recipeId))
  }
}

export async function deleteBox(state: AppState, boxId: string) {
  deleteDoc(doc(db, "boxes", boxId))
}

const objIdMap = new WeakMap();
let objectCount = 0;
export function getUniqueId(rcp: Recipe) {
  if (!objIdMap.has(rcp)) objIdMap.set(rcp, ++objectCount);
  return objIdMap.get(rcp);
}