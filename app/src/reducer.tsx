import { RecipeBoxStateType, RecipeBoxActionType } from './types'

export function recipeBoxReducer(state: RecipeBoxStateType, action: RecipeBoxActionType): RecipeBoxStateType {
    switch (action.type) {
        case "ADD_RECIPE":
            let newBox = {...state.boxes.get(action.boxId!)}
            newBox.recipes = new Map([...newBox.recipes!, [action.key!, action.recipe!]])
            return {...state, boxes: new Map([...state.boxes, [action.key!, action.box!]])}
        case "SET_BOXES":
            return {...state, boxes: new Map([...state.boxes, ...action.boxes!])}
    }
    return { ...state }
}