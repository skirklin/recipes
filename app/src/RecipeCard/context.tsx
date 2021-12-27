import _ from 'lodash';
import { createContext } from 'react';
import { Recipe } from 'schema-dts';
import { RecipePointer } from '../types';

export type RecipeStateType = {
  recipePtr: RecipePointer,
  recipe: Recipe,
  original: Recipe,
  changed: boolean,
}

export type RecipeActionType = {
  type: string,
  payload?: any,
}


export function initState(): RecipeStateType {
  let r: Recipe = { "@type": "Recipe" };
  return { 
    recipePtr: {recipeId: "", boxId: ""},
    recipe: r, 
    original: _.cloneDeep(r), 
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