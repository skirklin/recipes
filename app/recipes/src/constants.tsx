import { Recipe } from 'schema-dts';
import { createContext } from 'react';

export interface IRecipeBoxContext {
  recipes: Recipe[]
  activeRecipes: Recipe[]
  setRecipes: (recipes: Recipe[]) => void
  setActiveRecipes: (recipes: Recipe[]) => void
}

export const RecipeBoxContext = createContext<IRecipeBoxContext>({
  recipes: [],
  activeRecipes: [],
  setRecipes: (recipes: Recipe[]) => {},
  setActiveRecipes: (recipes: Recipe[]) => {},
})