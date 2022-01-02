import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../context';
import RecipeCard from '../RecipeCard/RecipeCard';
import { RecipeType } from '../types';
import { getRecipe } from '../utils';

interface RecipeProps {
  boxId: string
  recipeId: string
  recipe?: RecipeType
}


export function Recipe(props: RecipeProps) {
  const [recipe, setRecipe] = useState<RecipeType|undefined>(props.recipe)
  let { recipeId, boxId } = props;
  let { state } = useContext(Context)
  useEffect(() => {
    (async () => { 
      if (recipe !== undefined) {
        return
      }
      let newRecipe = await getRecipe(state, recipeId, boxId);
      if (newRecipe !== undefined) {
        setRecipe(newRecipe)
      }
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeId, boxId]
  )
  if (recipe === undefined) {
    return <div>Unable to find recipe.</div>
  }
  return (
    <RecipeCard recipeId={recipeId} boxId={boxId} recipe={recipe} />
  )
}

export function RoutedRecipe() {
  let params = useParams();
  return <Recipe recipeId={params.recipeId!} boxId={params.boxId!} />
}