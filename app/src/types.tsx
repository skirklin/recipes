import { Unsubscribe } from 'firebase/firestore';
import { Recipe } from 'schema-dts';
import { BoxEntry, RecipeEntry } from './storage';

export type BoxDataType = {
  name: string,
  description?: string,
}

export type BoxStoreType = {
  creator: string,
  owners: string[], // user ids
  visibility: Visibility,
  data: BoxDataType
}

export type RecipeStoreType = {
  creator: string,
  data: Recipe,
  visibility: Visibility,
  owners: string[], // user ids
}

export type UserType = {
  boxes: Map<string, BoxEntry>,
  new: boolean,
  id: string,
}

export type AppState = {
  boxes: Map<string, BoxEntry>
  activeRecipe?: RecipeEntry
  activeBox?: BoxEntry
  activeRecipeId?: string
  activeBoxId?: string
  writeable: boolean
}

export type ActionType = {
  type: string
  recipeId?: string
  boxId?: string
  recipe?: RecipeEntry
  box?: BoxEntry
  payload?: RecipeEntry | BoxEntry | Map<string, BoxEntry> | Map<string, RecipeEntry> | boolean
}

export type UnsubMap = {
  userUnsub: Unsubscribe | undefined,
  boxesUnsub: Unsubscribe | undefined,
  boxMap: Map<string, {
    boxUnsub: Unsubscribe | undefined,
    recipesUnsub: Unsubscribe | undefined,
  }>
}

export enum Visibility {
  private = "private", // only owner can read
  linkable = "linkable", // anyone with link can read
  public = "public", // discoverable
}