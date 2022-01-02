/* helper functions for converting between structured data and text. */
import { getAuth, User } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import _ from 'lodash';
import { Recipe } from "schema-dts"
import { db } from './backend';
import { RecipeBoxStateType, RecipeType, Visibility } from './types';


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
  if (!boxDoc.exists()) {
    return undefined
  }
  return ({
    data: {
      recipes: await getRecipes(state, boxId),
      name: "whatever",
    },
    id: boxId,
    visibility: Visibility.private,
    owners: [],
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
  await setDoc(doc(db, "users", user.uid, "boxes", boxId), { box: boxRef })
}


export async function unsubscribeFromBox(user: User | null, boxId: string) {
  if (user === null) {
    return undefined
  }
  let docRef = doc(db, "users", user.uid, "boxes", boxId)
  await deleteDoc(docRef)
}

export async function uploadRecipes(boxId: string) {
  /* @ts-expect-error */
  let fileHandles: File[] = await window.showOpenFilePicker({
    multiple: true,
  })
  let recipeIds: string[] = [];
  fileHandles.forEach(fh => {
    /* @ts-expect-error */
    fh.getFile().then(
      async (f: File) => {
        let text = await f.text()
        let jsonobj = JSON.parse(text) as Recipe
        let recipesRef = collection(db, "boxes", boxId!, "recipes");
        let user = getAuth().currentUser
        if (user === null) {
          return
        }
        let fullRecipe: RecipeType = {
          data: jsonobj,
          owners: [user.uid],
          visibility: Visibility.private,
        }
        let recipeRef = await addDoc(recipesRef, fullRecipe)
        recipeIds.push(recipeRef.id)
      }
    )
  })
}

export async function addBox(user: User | null, name: string) {
  if (user === null) {
    return undefined
  }
  const boxesCol = collection(db, "users", user.uid, "boxes")
  const boxRef = await addDoc(collection(db, "boxes"), { name, owners: [user.uid], visibility: Visibility.private })
  await addDoc(boxesCol, { box: boxRef })
  return boxRef
}

export function createNewRecipe(): RecipeType {
  return {
    data: {
      "@type": "Recipe",
      "name": "New recipe",
      "recipeInstructions": [],
      "recipeIngredient": [],
      "description": "",
    },
    visibility: Visibility.private,
    owners: [],
  }
}
