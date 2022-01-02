import { Unsubscribe } from 'firebase/firestore';
import { Recipe } from 'schema-dts';

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
  owners: string[], // user ids
  visibility: Visibility,
  data: {
    name: string,
    recipes: Map<string, RecipeType>,
  }
}

export type RecipeType = {
  data: Recipe,
  visibility: Visibility,
  owners: string[], // user ids
}

export type UserType = {
  boxes: Map<string, BoxType>,
  new: boolean,
  id: string,
}

export type RecipeBoxStateType = {
  boxes: Map<string, BoxType>
  activeBox: string | undefined
  writeable: boolean
}

export type RecipeBoxActionType = {
  type: string
  recipeId?: string
  boxId?: string
  payload?: any
}

export type BoxUnsub = {
  boxUnsub: Unsubscribe | undefined,
  recipeUnsub: Unsubscribe | undefined,
}

export type UnsubMap = {
  userUnsub: Unsubscribe | undefined,
  boxesUnsub: Unsubscribe | undefined,
  boxMap: Map<string, BoxUnsub>
}

export enum Visibility {
  private = "private", // only owner can read
  linkable = "linkable", // anyone with link can read
  public = "public", // discoverable
}