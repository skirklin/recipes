import { Person, Recipe } from 'schema-dts';

export type RecipePointer = {
  boxId: string,
  recipeId: string,
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

export type SearchResultType = {
  queryString: string,
  recipePtrs: RecipePointer[],
}

export type RecipeBoxStateType = {
  boxes: Map<string,BoxType>
}

export type RecipeBoxActionType = {
  /// TODO: prune this
  type: string
  key?: string
  recipe?: Recipe
  recipes?: Map<string,Recipe>
  recipeId?: string
  box?: BoxType
  boxes?: Map<string,BoxType>
  boxId?: string
}