import { createContext } from 'react';
import { RecipeBoxActionType, BoxType, RecipeBoxStateType } from './types';


export type ContextType = {
  state: RecipeBoxStateType
  dispatch: React.Dispatch<RecipeBoxActionType>
}

export function initState() {
  return (
    {
      boxes: new Map<string, BoxType>(),
      activeBox: undefined,
    }
  )
}

const initialState = initState()
const defaultDispatch: React.Dispatch<RecipeBoxActionType> = () => initialState

export const RecipeBoxContext = createContext<ContextType>(

  {
    state: initialState,
    dispatch: defaultDispatch,
  })
