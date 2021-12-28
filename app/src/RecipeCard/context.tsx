import _ from 'lodash';
import { createContext } from 'react';
import { Recipe } from 'schema-dts';


export type RecipeStateType = {
  recipeId?: string,
  boxId: string,
  recipe: Recipe,
  changed: boolean,
}

export type RecipeActionType = {
  type: string,
  payload?: any,
  recipeId?: string,
}


export function initState(): RecipeStateType {
  let r: Recipe = { "@type": "Recipe" };
  return {
    recipeId: "",
    boxId: "",
    recipe: r,
    changed: false,
  }
}
const initialState = initState()

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
  let newState = { ...state }
  switch (action.type) {
    case 'SET_NAME':
      newState.recipe.name = action.payload;
      newState.changed = true;
      return newState
    case 'SET_INGREDIENTS':
      newState.recipe.recipeIngredient = action.payload
      newState.changed = true;
      return newState
    case 'SET_INSTRUCTIONS':
      newState.recipe.recipeInstructions = action.payload;
      newState.changed = true;
      return newState
    case 'SET_DESCRIPTION':
      newState.recipe.description = action.payload;
      newState.changed = true;
      return newState
    case 'SET_RECIPE':
      newState.recipe = _.cloneDeep(action.payload);
      newState.changed = false;
      if (action.recipeId !== undefined) {
        newState.recipeId = action.recipeId
      }
      return newState
  }
  return newState;
}