import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spin } from 'antd';
import { Context } from '../context';
import RecipeCard from '../RecipeCard/RecipeCard';
import { getRecipe } from '../firestore';
import { getRecipeFromState } from '../state';
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
  const [loading, setLoading] = useState(true);
  const [fetchAttempted, setFetchAttempted] = useState(false);

  const recipe = getRecipeFromState(state, boxId, recipeId)

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (recipe === undefined && !fetchAttempted) {
        setLoading(true);
        if (props.recipe === undefined) {
          const fetchedRecipe = await getRecipe(state, boxId, recipeId);
          if (!cancelled && fetchedRecipe !== undefined) {
            dispatch({ type: "ADD_RECIPE", payload: fetchedRecipe, recipeId, boxId })
          }
        } else {
          if (!cancelled) {
            dispatch({ type: "ADD_RECIPE", payload: props.recipe, recipeId, boxId })
          }
        }
        if (!cancelled) {
          setFetchAttempted(true);
          setLoading(false);
        }
      } else if (recipe !== undefined) {
        setLoading(false);
      }
    })()

    return () => { cancelled = true; }
  }, [recipeId, boxId, recipe, dispatch, state, props.recipe, fetchAttempted])

  if (loading && recipe === undefined) {
    return <Spin tip="Loading recipe..."><div style={{ minHeight: 200 }} /></Spin>
  }

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