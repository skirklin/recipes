import _ from 'lodash';
import { useContext } from 'react';
import { Context } from '../../context';
import RecipeCard from '../../RecipeCard/RecipeCard';
import { RecipeTabType } from '../../types';
import { getRecipe } from '../../utils';
import { TabType } from '../../types';
import { Recipe } from 'schema-dts';

interface RecipeTabProps {
  boxId: string
  recipeId?: string
  recipe?: Recipe
}

const objIdMap = new WeakMap();
var objectCount = 0;
function getUniqueId(rcp: Recipe) {
  if (!objIdMap.has(rcp)) objIdMap.set(rcp, ++objectCount);
  return objIdMap.get(rcp);
}


export function getRecipeTabKey(content: RecipeTabType) {
  if (content.recipe !== undefined) {
    let id = getUniqueId(content.recipe)
    return `uniqueId=${id.toString()}`
  }
  return `boxId=${content.boxId} recipeId=${content.recipeId}`
}

export function RecipeTabName(props: RecipeTabType) {
  const { state } = useContext(Context)
  const { recipeId, boxId, recipe } = props;
  if (recipe !== undefined) {
    return <div>{recipe.name}</div>
  }
  let box = state.boxes.get(boxId)
  if (box === undefined) {
    return <div>failed to find box</div>
  }
  let rcp = box.recipes.get(recipeId!);
  if (rcp === undefined) {
    return <div>failed to find recipe</div>
  }
  return <div>{rcp.name}</div>
}

export function isRecipeTab(content: TabType) {
  return (
    _.isEqual(new Set(_.keys(content)), new Set(["recipeId", "boxId", "recipe"])) ||
    _.isEqual(new Set(_.keys(content)), new Set(["recipeId", "boxId"])) ||
    _.isEqual(new Set(_.keys(content)), new Set(["recipe", "boxId"]))
  )
}

export function RecipeTab(props: RecipeTabProps) {
  let { recipeId, boxId, recipe } = props;
  let { state } = useContext(Context)
  if (recipe === undefined) {
    recipe = getRecipe(state, { recipeId: recipeId!, boxId })
  }
  if (recipe === undefined) {
    return <div>Unable to find recipe.</div>
  }
  return (
    <RecipeCard recipeId={recipeId!} boxId={boxId} recipe={recipe} />
  )
}