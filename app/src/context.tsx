import { getAuth } from 'firebase/auth';
import _ from 'lodash';
import { createContext } from 'react';
import { BoxEntry, RecipeEntry } from './storage';
import { ActionType, AppState } from './types';
import { createNewBox, getRecipeFromState, setRecipeInState } from './utils';


export type ContextType = {
  state: AppState
  dispatch: React.Dispatch<ActionType>
}

export function initState(): AppState {
  return (
    {
      boxes: new Map<string, BoxEntry>(),
      writeable: true,
      user: null,
    }
  )
}

const initialState = initState()
const defaultDispatch: React.Dispatch<ActionType> = () => initialState

export const Context = createContext<ContextType>(
  {
    state: initialState,
    dispatch: defaultDispatch,
  }
)

function handleRecipeChange(key: string, prevState: AppState, action: ActionType) {
  console.log({key, action})
  if (action.recipeId === undefined || action.boxId === undefined) {
    console.warn("Can't change a recipe property without passing recipeId and boxId.")
    return prevState
  }
  const recipe = getRecipeFromState(prevState, action.boxId, action.recipeId)
  if (recipe === undefined) {
    return prevState
  }

  const newState = { ...prevState }
  if (recipe.changed === undefined) {
    recipe.changed = _.cloneDeep(recipe.data)
  }
  recipe.changed = { ...(recipe.changed), [key]: action.payload }
  return newState
}

export function recipeBoxReducer(prevState: AppState, action: ActionType): AppState {
  console.log("action", { action, prevState })
  const user = getAuth().currentUser
  if (user === null) {
    return prevState
  }
  let newBox: BoxEntry, state: AppState
  switch (action.type) {
    case "SET_USER": {
      if (action.user === undefined) {
        console.warn("SET_USER requires userId and user.")
        return prevState
      }
      state = { ...prevState, user: action.user }
      return state
    }
    case "ADD_RECIPE": {
      if (action.boxId === undefined || (action.recipeId === undefined)) {
        console.warn("ADD_RECIPE requires a boxId and recipeId.")
        return prevState
      }
      newBox = { ...(prevState.boxes.get(action.boxId) || createNewBox(user)) }
      if (action.payload === undefined) {
        console.warn("ADD_RECIPE requires a payload.")
        return prevState
      }
      newBox.recipes = new Map([...newBox.recipes, [action.recipeId, action.payload as RecipeEntry]])
      state = { ...prevState, boxes: new Map([...prevState.boxes, [action.boxId, newBox as BoxEntry]]) }
      return state
    }
    case "ADD_BOX": {
      if (action.boxId === undefined) {
        console.warn("ADD_BOX requires a boxId")
        return prevState
      }
      const oldBox = prevState.boxes.get(action.boxId)
      if (action.payload === undefined) {
        console.warn("ADD_BOX requires a payload.")
        return prevState
      }
      newBox = _.cloneDeep(action.payload as BoxEntry)
      newBox.recipes = newBox.recipes.size ? newBox.recipes : (oldBox && oldBox.recipes) || new Map<string, RecipeEntry>()
      state = { ...prevState, boxes: new Map([...prevState.boxes, [action.boxId, newBox]]) }
      return state
    }
    case "REMOVE_BOX": {
      if (action.boxId === undefined) {
        console.warn("REMOVE_BOX requires a boxId")
        return prevState
      }
      state = { ...prevState, boxes: new Map(prevState.boxes) }
      state.boxes.delete(action.boxId)
      return state
    }
    case "REMOVE_RECIPE": {
      if (action.boxId === undefined || action.recipeId === undefined) {
        console.warn("REMOVE_RECIPE requires a boxId and a recipeId")
        return prevState
      }
      state = { ...prevState, boxes: new Map(prevState.boxes) }
      const box = state.boxes.get(action.boxId)
      if (box === undefined) {
        return state
      }
      box.recipes = new Map(box.recipes)
      box.recipes.delete(action.recipeId)
      return state
    }
    case "SET_BOXES": {
      return { ...prevState, boxes: new Map([...prevState.boxes, ...action.payload as Map<string, BoxEntry>]) }
    }
    case "CLEAR_BOXES":
      return { ...prevState, boxes: new Map() }
    case 'SET_READONLY':
      return { ...prevState, writeable: action.payload as boolean }
    case 'SET_NAME': {
      return handleRecipeChange("name", prevState, action)
    }
    case 'SET_INGREDIENTS': {
      return handleRecipeChange("recipeIngredient", prevState, action)
    }
    case 'SET_CATEGORIES': {
      return handleRecipeChange("recipeCategory", prevState, action)
    }
    case 'SET_COMMENT': {
      return handleRecipeChange("comment", prevState, action)
    }
    case 'SET_DESCRIPTION': {
      return handleRecipeChange("description", prevState, action)
    }
    case 'SET_INSTRUCTIONS': {
      return handleRecipeChange("recipeInstructions", prevState, action)
    }
    case 'RESET_RECIPE': {
      if (action.recipeId === undefined || action.boxId === undefined) return prevState
      const recipe = getRecipeFromState(prevState, action.boxId, action.recipeId)
      if (recipe === undefined) return prevState
      const newState = { ...prevState }
      if (recipe.changed !== undefined) {
        recipe.changed = undefined
      }
      setRecipeInState(newState, action.boxId, action.recipeId, recipe)
      return newState
    }
    default:
      return prevState
  }
}