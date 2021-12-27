/* helper functions for converting between structured data and text. */
import _ from 'lodash';
import { Recipe } from "schema-dts"
import { RecipeBoxStateType, RecipePointer } from './types';


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

export function getRecipe(state: RecipeBoxStateType, recipePtr: RecipePointer): Recipe | undefined {
    console.log({state, recipePtr})
    let box = state.boxes.get(recipePtr.boxId);
    if (box === undefined) {
        return undefined
    }
    let recipe = box.recipes.get(recipePtr.recipeId)
    if (recipe === undefined) {
        return undefined
    }
    return recipe
}