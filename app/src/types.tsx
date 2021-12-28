import { Person, Recipe } from 'schema-dts';

export type RecipePointer = {
  boxId: string,
  recipeId: string | undefined,
}

export type BoxPointer = {
  boxId: string,
}

export type AllType = {
}

export type BoxType = {
  name: string,
  recipes: Map<string,Recipe>,
  owners: Person[],
}

export type UserType = {
  boxes: Map<string,BoxType>,
  new: boolean,
}

export type RecipeTabType = {
  boxId: string,
  recipeId: string | undefined,
  recipe?: Recipe,
}

export type BoxTabType = {
  boxId: string
}

export type SearchResultTabType = {
  queryString: string,
  recipePtrs: RecipePointer[],
}

export type TabType = RecipeTabType | BoxTabType | SearchResultTabType | AllType;

export type RecipeBoxStateType = {
  boxes: Map<string,BoxType>
  tabs: Map<string,TabType>
  activeTab: string
  activeBox: string | undefined
  readonly: boolean
}

export type RecipeBoxActionType = {
  type: string
  recipeId?: string
  boxId?: string
  payload: any
}