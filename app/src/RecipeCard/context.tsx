import { createContext } from 'react';
import { Recipe } from 'schema-dts';

export type StateType = {
  recipe: Recipe,
  changed: boolean,
}

export type ActionType = {
  type: string,
  payload: any,
}


export function initState(): StateType {
  return { recipe: { "@type": "Recipe" }, changed: false }
}
const initialState = initState()

const defaultDispatch: React.Dispatch<ActionType> = () => initialState

type ContextType = {
  state: StateType
  dispatch: React.Dispatch<ActionType>
}

export const RecipeContext = createContext<ContextType>(
  {
    state: initialState,
    dispatch: defaultDispatch,
  }
)