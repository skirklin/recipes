import { createContext } from 'react';
import { ActionType, StateType } from './types';


export type ContextType = {
  state: StateType
  dispatch: React.Dispatch<ActionType>
}

export function initState() {
  return (

    {
      recipes: [],
      activeRecipes: [],
      searchResult: undefined,
      activeTab: 0,
    }
  )
}

const initialState = initState()
const defaultDispatch: React.Dispatch<ActionType> = () => initialState

export const RecipeBoxContext = createContext<ContextType>(

  {
    state: initialState,
    dispatch: defaultDispatch,
  })
