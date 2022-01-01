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

export type RecipeBoxStateType = {
  boxes: Map<string,BoxType>
  activeBox: string | undefined
  writeable: boolean
}

export type RecipeBoxActionType = {
  type: string
  recipeId?: string
  boxId?: string
  payload?: any
}