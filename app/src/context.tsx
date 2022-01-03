import { createContext } from 'react';
import { RecipeBoxActionType, BoxType, RecipeBoxStateType, RecipeType } from './types';
import { createNewBox } from './utils';


export type ContextType = {
  state: RecipeBoxStateType
  dispatch: React.Dispatch<RecipeBoxActionType>
}

export function initState(): RecipeBoxStateType {
  return (
    {
      boxes: new Map<string, BoxType>(),
      activeBox: undefined,
      writeable: true,
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

export function recipeBoxReducer(prevState: RecipeBoxStateType, action: RecipeBoxActionType): RecipeBoxStateType {
  console.log({ action, prevState })
  let newBox: BoxType, state: RecipeBoxStateType
  switch (action.type) {
    case "ADD_RECIPE":
      if (action.boxId === undefined || (action.recipeId === undefined)) {
        console.warn("ADD_RECIPE requires a boxId and recipeId.")
        return prevState
      }
      newBox = { ...(prevState.boxes.get(action.boxId) || createNewBox()) }
      if (action.payload === undefined) {
        console.warn("ADD_RECIPE requires a payload.")
        return prevState
      }
      newBox.data.recipes = new Map([...newBox.data.recipes, [action.recipeId, action.payload]])
      state = { ...prevState, boxes: new Map([...prevState.boxes, [action.boxId, newBox as BoxType]]) }
      return state
    case "ADD_BOX":
      if (action.boxId === undefined) {
        console.warn("ADD_BOX requires a boxId")
        return prevState
      }
      let oldBox = prevState.boxes.get(action.boxId)
      if (action.payload === undefined) {
        console.warn("ADD_BOX requires a payload.")
        return prevState
      }
      newBox = { ...action.payload } as BoxType
      newBox.data.recipes = (oldBox && oldBox.data.recipes) || new Map<string, RecipeType>()
      state = { ...prevState, boxes: new Map([...prevState.boxes, [action.boxId, newBox as BoxType]]) }
      return state
    case "REMOVE_BOX":
      if (action.boxId === undefined) {
        console.warn("REMOVE_BOX requires a boxId")
        return prevState
      }
      state = { ...prevState, boxes: new Map(prevState.boxes) }
      state.boxes.delete(action.boxId)
      return state
    case "REMOVE_RECIPE":
      if (action.boxId === undefined || action.recipeId === undefined) {
        console.warn("REMOVE_RECIPE requires a boxId and a recipeId")
        return prevState
      }
      state = { ...prevState, boxes: new Map(prevState.boxes) }
      let box = state.boxes.get(action.boxId)
      if (box === undefined) {
        return state
      }
      box.data.recipes = new Map(box.data.recipes)
      box.data.recipes.delete(action.recipeId)
      return state
    case "SET_BOXES":
      return { ...prevState, boxes: new Map([...prevState.boxes, ...action.payload]) }
    case "CLEAR_BOXES":
      return { ...prevState, boxes: new Map() }
    case 'SET_READONLY':
      return { ...prevState, writeable: action.payload as boolean }
    default:
      return prevState
  }
}