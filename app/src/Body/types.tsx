import { BoxType, SearchResultType, AllType, RecipePointer } from '../types'


export type TabType = RecipePointer | BoxType | SearchResultType | AllType;

export type ViewerStateType = {
  tabs: Map<string,TabType>
  activeTab: string
}

export type ViewerActionType = {
  type: string
  payload: TabType | string
}