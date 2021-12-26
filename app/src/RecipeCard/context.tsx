import { createContext } from 'react';
import { Recipe } from 'schema-dts';

export type RecipeStateType = {
  recipe: Recipe,
  changed: boolean,
}

export type RecipeActionType = {
  type: string,
  payload: any,
}


export function initState(): RecipeStateType {
  return { recipe: { "@type": "Recipe" }, changed: false }
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