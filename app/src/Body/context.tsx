import { createContext } from 'react';
import { AllType } from '../types';
import { getAllRecipesTabKey } from './Tabs/AllRecipesTab';
import { ViewerActionType, ViewerStateType } from './types';


export type ContextType = {
  state: ViewerStateType
  dispatch: React.Dispatch<ViewerActionType>
}

export function initState(): ViewerStateType {
  let allRecipesTab: AllType = {}
  let key = getAllRecipesTabKey(allRecipesTab)!
  console.log(key)
  return (
    {
      tabs: new Map([[key, allRecipesTab]]),
      activeTab: key,
    }
  )
}

const initialState = initState()
const defaultDispatch: React.Dispatch<ViewerActionType> = () => initialState

export const ViewerContext = createContext<ContextType>(
  {
    state: initialState,
    dispatch: defaultDispatch,
  }
)