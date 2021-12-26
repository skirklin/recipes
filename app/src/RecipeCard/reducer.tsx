import { RecipeActionType, RecipeStateType } from './context'

export default function recipeReducer(state: RecipeStateType, action: RecipeActionType): RecipeStateType {
    let newState = { ...state }
    switch (action.type) {
        case 'SET_NAME':
            newState.recipe.name = action.payload; 
            newState.changed = true
            return newState
        case 'SET_INGREDIENTS': 
            newState.recipe.recipeIngredient = action.payload
            newState.changed = true
            return newState
        case 'SET_INSTRUCTIONS':
            newState.recipe.recipeInstructions = action.payload;
            newState.changed = true
            return newState
        case 'SET_DESCRIPTION':
            newState.recipe.description = action.payload;
            newState.changed = true
            return newState
    }
    return newState;
}