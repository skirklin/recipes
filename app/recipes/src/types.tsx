import { Recipe } from 'schema-dts';

export type StateType = {
  recipes: Recipe[]
  activeRecipes: Recipe[]
  searchResult: Recipe[] | undefined
  activeTab: number
}

export type ActionType = {
  type: string
  recipe?: Recipe
  activeTab?: number
}

export type ContextType = {
  state: StateType
  dispatch: React.Dispatch<ActionType>
}