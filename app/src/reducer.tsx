import { RecipeBoxStateType, RecipeBoxActionType, BoxType } from './types'

export function recipeBoxReducer(state: RecipeBoxStateType, action: RecipeBoxActionType): RecipeBoxStateType {
    switch (action.type) {
        case "ADD_RECIPE":
            let newBox = { ...state.boxes.get(action.boxId!) } as BoxType
            newBox.recipes = new Map([...newBox.recipes!, [action.recipeId!, action.payload]])
            return { ...state, boxes: new Map([...state.boxes, [action.boxId!, newBox]]) }
        case "SET_BOXES":
            return { ...state, boxes: new Map([...state.boxes, ...action.payload]) }
        default:
            return state
    }
}