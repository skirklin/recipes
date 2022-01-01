/* helper functions for converting between structured data and text. */
import { User } from 'firebase/auth';
import { addDoc, arrayRemove, arrayUnion, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import _ from 'lodash';
import { Recipe } from "schema-dts"
import { db } from './App';
import { RecipeBoxStateType } from './types';


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

export function getRecipe(state: RecipeBoxStateType, recipeId: string | undefined, boxId: string | undefined): Recipe | undefined {
  let recipe: Recipe | undefined
  if (boxId === undefined || recipeId === undefined) {
    return undefined
  }
  let box = state.boxes.get(boxId);
  if (box !== undefined) {
    recipe = box.recipes.get(recipeId)
  } else {
    recipe = undefined; // (await getDoc(doc(db, "boxes", boxId, "recipes", recipeId))).data() as Recipe
    return recipe
  }
}

export async function subscribeToBox(user: User | null, boxId: string) {
  const boxRef = doc(db, "boxes", boxId)
  const boxDoc = await getDoc(boxRef)
  if (!boxDoc.exists()) {
    return undefined
  }
  if (user === null) {
    return undefined
  }
  const userRef = doc(db, "users", user.uid)
  updateDoc(userRef, { boxes: arrayUnion(boxRef) })
}


export async function unsubscribeFromBox(user: User | null, boxId: string) {
  const boxRef = doc(db, "boxes", boxId)
  const boxDoc = await getDoc(boxRef)
  if (!boxDoc.exists()) {
    return undefined
  }
  if (user === null) {
    return undefined
  }
  const userRef = doc(db, "users", user.uid)
  updateDoc(userRef, { boxes: arrayRemove(boxRef) })
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
        let recipeRef = await addDoc(recipesRef, jsonobj)
        recipeIds.push(recipeRef.id)
      }
    )
  })
}

export async function addBox(user: User | null, name: string) {
  if (user === null) {
    return undefined
  }
  const userRef = doc(db, "users", user.uid)
  const boxRef = await addDoc(collection(db, "boxes"), { name, owners: [user.uid] })
  await updateDoc(userRef, { boxes: arrayUnion(boxRef) })
}

export function createNewRecipe(): Recipe {
  return {
    "@type": "Recipe",
    "name": "New recipe",
    "recipeInstructions": [],
    "recipeIngredient": [],
    "description": "",
  }
}
