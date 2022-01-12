import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../context';
import RecipeCard from '../RecipeCard/RecipeCard';
import { getRecipe, getRecipeFromState } from '../utils';
import { RecipeEntry } from '../storage';
import { BoxId, RecipeId } from '../types';

interface RecipeProps {
  boxId: BoxId
  recipeId: RecipeId
  recipe?: RecipeEntry
}


export function Recipe(props: RecipeProps) {
  const { recipeId, boxId } = props;
  const { state, dispatch } = useContext(Context)

  const recipe = getRecipeFromState(state, boxId, recipeId)
  useEffect(() => {
    (async () => {
      if (recipe === undefined) {
        if (props.recipe === undefined) {
          const recipe = await getRecipe(state, boxId, recipeId);
          dispatch({ type: "ADD_RECIPE", payload: recipe, recipeId, boxId })
        } else {
          const recipe = props.recipe
          dispatch({ type: "ADD_RECIPE", payload: recipe, recipeId, boxId })
        }
      }
    })()
  }, [recipeId, boxId, recipe, dispatch, state, props.recipe]
  )
  if (recipe === undefined) {
    return <div>Unable to find recipe.</div>
  }
  return (
    <>
      <RecipeCard {...props} />
    </>
  )
}

export default function RoutedRecipe() {
  const params = useParams();
  if (params.boxId === undefined || params.recipeId === undefined) {
    throw new Error("Must have a boxId and recipeId.")
  }

  return <Recipe recipeId={params.recipeId} boxId={params.boxId} />
}