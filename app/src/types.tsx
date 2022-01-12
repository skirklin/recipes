import { DocumentReference, Unsubscribe } from 'firebase/firestore';
import { Comment, Recipe } from 'schema-dts';
import { BoxEntry, RecipeEntry, UserEntry } from './storage';

export type BoxId = string
export type RecipeId = string
export type UserId = string

export type BoxType = {
  name: string,
  description?: string,
}

export type BoxStoreType = {
  creator: string,
  owners: string[], // user ids
  visibility: Visibility,
  data: BoxType
}

export type RecipeStoreType = {
  creator: string,
  data: Recipe,
  visibility: Visibility,
  owners: string[], // user ids
}

export type UserStoreType = {
  name: string,
  visibility: Visibility,
  boxes: DocumentReference<BoxEntry>[],
}

export type AppState = {
  boxes: Map<string, BoxEntry>
  user: UserEntry | null
  writeable: boolean
}

export type ActionType = {
  type: string
  recipeId?: RecipeId
  recipe?: RecipeEntry
  boxId?: BoxId
  box?: BoxEntry
  userId?: UserId
  user?: UserEntry
  payload?: RecipeEntry 
  | BoxEntry 
  | Map<string, BoxEntry> 
  | Map<string, RecipeEntry> 
  | boolean 
  | string 
  | Recipe["recipeIngredient"] 
  | Recipe["recipeInstructions"]
  | Recipe["recipeCategory"]
  | Comment
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
  // linkable = "linkable", // anyone with link can read
  public = "public", // discoverable
}