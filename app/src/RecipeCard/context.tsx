import { User } from 'firebase/auth';
import _ from 'lodash';
import { createContext } from 'react';
import { Recipe } from 'schema-dts';
import { RecipeType } from '../types';
import { createNewRecipe } from '../utils';


export type RecipeStateType = {
  recipeId?: string,
  boxId: string,
  recipe?: RecipeType,
  original?: RecipeType,
  changed: boolean,
}

export type RecipeActionType = {
  type: string,
  payload?: string | RecipeType | Recipe["recipeIngredient"] | Recipe["recipeInstructions"]
  recipeId?: string,
}


export function initState(user: User | null): RecipeStateType {
  const r = createNewRecipe(user)
  return {
    recipeId: "",
    boxId: "",
    recipe: r,
    original: r,
    changed: false,
  }
}
const initialState = initState(null)

const defaultDispatch: React.Dispatch<RecipeActionType> = () => initialState

type ContextType = {
  state: RecipeStateType
  dispatch: React.Dispatch<RecipeActionType>
}

export const RecipeContext = createContext<ContextType>(
  {
    state: initialState,
    dispatch: defaultDispatch,
  }
)

export function recipeReducer(state: RecipeStateType, action: RecipeActionType): RecipeStateType {
  const newState = { ...state }
  console.debug({ action })
  switch (action.type) {
    case 'SET_NAME':
      if (newState.recipe === undefined) return newState
      newState.recipe.data.name = action.payload as string;
      newState.changed = true;
      return newState
    case 'SET_INGREDIENTS':
      if (newState.recipe === undefined) return newState
      newState.recipe.data.recipeIngredient = action.payload as string
      newState.changed = true;
      return newState
    case 'SET_INSTRUCTIONS':
      if (newState.recipe === undefined) return newState
      newState.recipe.data.recipeInstructions = action.payload as string;
      newState.changed = true;
      return newState
    case 'SET_DESCRIPTION':
      if (newState.recipe === undefined) return newState
      newState.recipe.data.description = action.payload as string;
      newState.changed = true;
      return newState
    case 'SET_RECIPE':
      newState.recipe = _.cloneDeep(action.payload) as RecipeType;
      newState.original = _.cloneDeep(action.payload) as RecipeType;
      newState.changed = false;
      if (action.recipeId !== undefined) {
        newState.recipeId = action.recipeId
      }
      return newState
  }
  return newState;
}