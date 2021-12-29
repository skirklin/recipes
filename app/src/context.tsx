import _ from 'lodash';
import { createContext } from 'react';
import { getContentsTabKey } from './Body/Tabs/Contents';
import { getKey } from './Body/Tabs/Tab';
import { RecipeBoxActionType, BoxType, RecipeBoxStateType, AllType } from './types';


export type ContextType = {
  state: RecipeBoxStateType
  dispatch: React.Dispatch<RecipeBoxActionType>
}

export function initState(): RecipeBoxStateType {
  let allRecipesTab: AllType = {}
  let key = getContentsTabKey(allRecipesTab)!
  return (
    {
      boxes: new Map<string, BoxType>(),
      activeBox: undefined,
      tabs: new Map([[key, allRecipesTab]]),
      activeTab: key,
      writeable: false,
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

export function recipeBoxReducer(state: RecipeBoxStateType, action: RecipeBoxActionType): RecipeBoxStateType {
  switch (action.type) {
    case "ADD_RECIPE":
      let newBox = { ...state.boxes.get(action.boxId!) } as BoxType
      newBox.recipes = new Map([...newBox.recipes!, [action.recipeId!, action.payload]])
      return { ...state, boxes: new Map([...state.boxes, [action.boxId!, newBox]]) }
    case "SET_BOXES":
      return { ...state, boxes: new Map([...state.boxes, ...action.payload]) }
    case 'APPEND_TAB':
      let key = getKey(action.payload)!
      let tabs = new Map([...state.tabs, [key, action.payload]])
      return { ...state, tabs, activeTab: key }
    case 'REMOVE_TAB': {
      let { activeTab } = state;
      let key = action.payload as string
      let tabs = new Map(state.tabs)
      if (key === activeTab) {
        let tabIdx = _.indexOf([...state.tabs.keys()], key)
        activeTab = [...state.tabs.keys()][tabIdx - 1]
      }
      tabs.delete(action.payload as string)
      return {
        ...state,
        activeTab,
        tabs,
      }
    }
    case 'CHANGE_TAB':
      // find the tab to be transformed and then simultaneously change the key and contents.
      let prevKey = getKey(action.payload.prevRecipePtr)!
      let newKey = getKey(action.payload.recipePtr)!
      let tabEntries: any = []
      state.tabs.forEach((value, key) => {
        if (key === prevKey) {
          tabEntries.push([newKey, { ...value, recipePtr: action.payload.recipePtr }])
        } else {
          tabEntries.push([key, value])
        }
      })
      let activeTab = state.activeTab
      if (activeTab === prevKey) {
        activeTab = newKey
      }
      return { ...state, tabs: new Map(tabEntries), activeTab }
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload as string }
    case 'SET_READONLY':
      return { ...state, writeable: action.payload as boolean }
    default:
      return state
  }
}