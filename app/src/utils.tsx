/* helper functions for converting between structured data and text. */
import { getAuth, User } from 'firebase/auth';
import { addDoc, arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import _ from 'lodash';
import { Recipe } from "schema-dts"
import { db } from './backend';
import { BoxStoreType, BoxType, RecipeBoxStateType, RecipeType, Visibility } from './types';


export function strToIngredients(str: string): Recipe["recipeIngredient"] {
  /* convert text with one ingredient per line to a list of ingredients.

  ingredient blah blah
  ingredient 2 blah blah blah

   ->

  ["ingredient blah blah", "ingredient 2 blah blah blah"]
  */
  let lines = str.split("\n")
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
  let lines = _.filter(str.split("\n"))
  return lines.map(s => ({ "@type": "HowToStep", text: s }))
}

export function instructionsToStr(instructions: Recipe["recipeInstructions"]): string {
  if (instructions === undefined) {
    return ""
  }
  if (typeof instructions === "string") {
    return instructions.toString()
  }
  let steps = Array.prototype.map.call(instructions, (x: any) => x.text);
  return steps.join("\n\n")
}

export function ingredientsToStr(ingredients: Recipe["recipeIngredient"]): string {
  let steps = Array.prototype.map.call(ingredients, x => x.toString());
  return steps.join("\n")
}

export async function getRecipe(state: RecipeBoxStateType, recipeId: string | undefined, boxId: string | undefined) {
  let recipe: RecipeType | undefined
  if (boxId === undefined || recipeId === undefined) {
    return undefined
  }
  let box = state.boxes.get(boxId);
  if (box !== undefined) {
    recipe = box.data.recipes.get(recipeId)
  } else {
    recipe = (await getDoc(doc(db, "boxes", boxId, "recipes", recipeId))).data() as RecipeType
  }
  return recipe
}

export async function getRecipes(state: RecipeBoxStateType, boxId: string) {
  let box = state.boxes.get(boxId)
  let recipes = new Map<string, RecipeType>()
  if (box === undefined) {
    let querySnapshot = await getDocs(collection(db, "boxes", boxId, "recipes"))
    let pairs: [string, RecipeType][] = querySnapshot.docs.map(doc => [doc.id, doc.data() as RecipeType])
    recipes = new Map<string, RecipeType>(pairs)
  } else {
    recipes = box.data.recipes
  }
  return recipes
}

export async function getBox(state: RecipeBoxStateType, boxId: string) {
  const boxRef = doc(db, "boxes", boxId)
  const boxDoc = await getDoc(boxRef)
  if (!boxDoc.exists() || boxDoc.data() === undefined) {
    return undefined
  }
  let box = boxDoc.data() as BoxType
  return ({
    data: {
      recipes: await getRecipes(state, boxId),
      name: box.data.name,
    },
    visibility: box.visibility,
    owners: box.owners,
  })
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
  /* @ts-expect-error */
  let fileHandles: File[] = await window.showOpenFilePicker({
    multiple: true,
  })
  for (let fh of fileHandles) {
    /* @ts-expect-error */
    fh.getFile().then(f => {
      f.text().then(
        (text: string) => {
          let jsonobj = JSON.parse(text) as Recipe
          let user = getAuth().currentUser
          if (user === null) {
            return
          }
          let fullRecipe: RecipeType = {
            data: jsonobj,
            owners: [user.uid],
            visibility: Visibility.private,
          }
          addRecipe(boxId, fullRecipe)
        })
    })
  }
}

export async function addRecipe(boxId: string, recipe: RecipeType) {
  let colRef = collection(db, "boxes", boxId, "recipes")
  let recipeRef = await addDoc(colRef, recipe)
  return recipeRef
}

export async function addBox(user: User | null, name: string) {
  if (user === null) {
    return undefined
  }
  const boxesCol = collection(db, "boxes")
  const boxData: BoxStoreType = {
    owners: [user.uid],
    visibility: Visibility.private,
    data: {
      name,
      recipes: [],
    }
  }
  const userRef = doc(db, "users", user.uid)
  const boxRef = await addDoc(boxesCol, boxData)
  await updateDoc(userRef, { boxes: arrayUnion(boxRef) })
  return boxRef
}

export function createNewRecipe(): RecipeType {
  return {
    visibility: Visibility.private,
    owners: [],
    data: {
      "@type": "Recipe",
      "name": "New recipe",
      "recipeInstructions": [],
      "recipeIngredient": [],
      "description": "",
    },
  }
}


export function createNewBox(): BoxType {
  return {
    data: {
      recipes: new Map<string, RecipeType>(),
      name: "New box",
    },
    visibility: Visibility.private,
    owners: [],
  }
}

const objIdMap = new WeakMap();
var objectCount = 0;
export function getUniqueId(rcp: Recipe) {
  if (!objIdMap.has(rcp)) objIdMap.set(rcp, ++objectCount);
  return objIdMap.get(rcp);
}