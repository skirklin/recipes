import { Recipe } from 'schema-dts';
import { createContext } from 'react';
import _ from 'lodash';

export type StateType = {
  recipes: Recipe[]
  activeRecipes: Recipe[]
  searchResult: Recipe[] | undefined
}

export type ActionType = {
  type: string
  recipe?: Recipe
}


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
    }
  )
}

export const RecipeBoxContext = createContext<ContextType>(

  {
    state: {
      recipes: [],
      activeRecipes: [],
      searchResult: undefined,
    },
    dispatch: (action: any) => initState()
  })

export function recipeBoxReducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case 'ADD_RECIPE':
      return { ...state, recipes: _.uniq([...state['recipes'], action.recipe!]) }
    case 'REMOVE_RECIPE':
      return { ...state, recipes: _.filter(state['recipes'], x => !Object.is(x, action.recipe)) }
    case 'ADD_ACTIVE_RECIPE':
      return { ...state, activeRecipes: _.uniq([...state['activeRecipes'], action.recipe!]) }
    case 'REMOVE_ACTIVE_RECIPE':
      return { ...state, activeRecipes: _.filter(state['activeRecipes'], x => !Object.is(x, action.recipe)) }
    case 'SET_SEARCH_RESULT':
      return { ...state }
  }
  return { ...state }
}