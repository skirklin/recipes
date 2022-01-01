import { createContext } from 'react';
import { RecipeBoxActionType, BoxType, RecipeBoxStateType } from './types';


export type ContextType = {
  state: RecipeBoxStateType
  dispatch: React.Dispatch<RecipeBoxActionType>
}

export function initState(): RecipeBoxStateType {
  return (
    {
      boxes: new Map<string, BoxType>(),
      activeBox: undefined,
      writeable: false,
    }
  )
}

const initialState = initState()
const defaultDispatch: React.Dispatch<RecipeBoxActionType> = () => initialState

export const Context = createContext<ContextType>(
  {
    state: initialState,
    dispatch: defaultDispatch,
  }
)

export function recipeBoxReducer(state: RecipeBoxStateType, action: RecipeBoxActionType): RecipeBoxStateType {
  switch (action.type) {
    case "ADD_RECIPE":
      if (action.boxId === undefined || (action.recipeId === undefined)) {
        console.log("failed to add_recipe with action", action)
        return state
      }
      let newBox = { ...state.boxes.get(action.boxId) }
      if (newBox === undefined || newBox.recipes === undefined) {
        console.log("failed to add_recipe with payload:", {payload: action.payload, newBox})
        return state
      }
      newBox.recipes = new Map([...newBox.recipes, [action.recipeId, action.payload]])
      return { ...state, boxes: new Map([...state.boxes, [action.boxId, newBox as BoxType]]) }
    case "SET_BOXES":
      return { ...state, boxes: new Map([...state.boxes, ...action.payload]) }
    case "CLEAR_BOXES":
      return { ...state, boxes: new Map() }
    case 'SET_READONLY':
      return { ...state, writeable: action.payload as boolean }
    default:
      return state
  }
}