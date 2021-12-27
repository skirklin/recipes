import _ from 'lodash';
import { useContext } from 'react';
import { RecipeBoxContext } from '../../context';
import RecipeCard from '../../RecipeCard/RecipeCard';
import { RecipePointer } from '../../types';
import { getRecipe } from '../../utils';
import { TabType } from '../types';

interface RecipeTabProps {
  recipePtr: RecipePointer
}

export function getRecipeTabKey(content: RecipePointer) {
  return `boxId=${content.boxId} recipeId=${content.recipeId}`
}

export function RecipeTabName(props: RecipeTabProps) {
  const { state } = useContext(RecipeBoxContext)
  const { recipePtr } = props;
  return <div>{state.boxes.get(recipePtr.boxId)!.recipes.get(recipePtr.recipeId)!.name}</div>
}

export function isRecipeTab(content: TabType) {
  return _.isEqual(new Set(_.keys(content)), new Set(["recipeId", "boxId"]))
}

export function RecipeTab(props: RecipeTabProps) {
  const { recipePtr } = props;
  let { state } = useContext(RecipeBoxContext)
  let recipe = getRecipe(state, recipePtr)
  if (recipe === undefined) {
    return <div>Unable to find recipe.</div>
  }
  return (
    <RecipeCard recipePtr={recipePtr} recipe={recipe} />
  )
}