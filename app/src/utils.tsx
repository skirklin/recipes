import { getAuth, User } from 'firebase/auth';
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import _ from 'lodash';
import { Recipe } from "schema-dts"
import { db } from './backend';
import { boxConverter, BoxEntry, recipeConverter, RecipeEntry } from './storage';
import { ActionType, AppState, BoxId, RecipeId, Visibility } from './types';


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
  const steps = Array.prototype.map.call(instructions, (x) => x.text.trim());
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
  return {"@type": "Person", name: author}
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

export async function getRecipes(state: AppState, boxId: BoxId) {
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

export async function getBox(state: AppState, boxId: BoxId) {
  const boxRef = doc(db, "boxes", boxId).withConverter(boxConverter)
  const boxDoc = await getDoc(boxRef)
  if (!boxDoc.exists() || boxDoc.data() === undefined) {
    return undefined
  }
  const box = boxDoc.data()
  box.recipes = await getRecipes(state, boxId)
  return box
}

export function getBoxFromState(state: AppState, boxId: BoxId) {
  return state.boxes.get(boxId);
}

export function setBoxInState(state: AppState, boxId: BoxId, box: BoxEntry) {
  state.boxes.set(boxId, box);
}

export async function subscribeToBox(user: User | null, boxId: BoxId) {
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


export async function unsubscribeFromBox(user: User | null, boxId: BoxId) {
  if (user === null) {
    return undefined
  }
  const boxRef = doc(db, "boxes", boxId)
  await updateDoc(doc(db, "users", user.uid), { boxes: arrayRemove(boxRef) })
}

export async function uploadRecipes(boxId: BoxId) {
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
          const recipe = new RecipeEntry(jsonobj, [user.uid], Visibility.private, user.uid, undefined)
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

export async function addBox(user: User | null, name: string, dispatch: React.Dispatch<ActionType> | null) {
  if (user === null) {
    return undefined
  }
  const boxesCol = collection(db, "boxes").withConverter(boxConverter)
  const boxData = { name }
  const box = new BoxEntry(boxData, [user.uid], Visibility.private, user.uid, undefined)
  const userRef = doc(db, "users", user.uid)
  const boxRef = await addDoc(boxesCol, box)
  await updateDoc(userRef, { boxes: arrayUnion(boxRef) })
  return boxRef
}

export function createNewRecipe(user: User) {
  const owners = [user.uid];
  const data: Recipe = {
    "@type": "Recipe",
    "name": "New recipe",
    "recipeInstructions": [],
    "recipeIngredient": [],
    "description": "",
  }
  return new RecipeEntry(data, owners, Visibility.private, user.uid, undefined)
}


export function createNewBox(user: User) {
  const name = "New box"
  return new BoxEntry({ name }, [user.uid], Visibility.private, user.uid, undefined)
}

export async function deleteRecipe(state: AppState, boxId: BoxId, recipeId: RecipeId) {
  if (recipeId.startsWith("uniqueId=")) {
    const box = state.boxes.get(boxId)
    if (box !== undefined) {
      box.recipes.delete(recipeId)
    }
  } else {
    deleteDoc(doc(db, "boxes", boxId, "recipes", recipeId))
  }
}

export async function deleteBox(state: AppState, boxId: BoxId) {
  deleteDoc(doc(db, "boxes", boxId))
}

const objIdMap = new WeakMap();
let objectCount = 0;
export function getUniqueId(rcp: RecipeEntry) {
  if (!objIdMap.has(rcp)) objIdMap.set(rcp, ++objectCount);
  return objIdMap.get(rcp);
}