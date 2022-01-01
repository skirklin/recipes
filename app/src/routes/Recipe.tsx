import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../context';
import RecipeCard from '../RecipeCard/RecipeCard';
import { getRecipe } from '../utils';

interface RecipeProps {
  boxId: string
  recipeId: string
}


export function Recipe(props: RecipeProps) {
  let { recipeId, boxId } = props;
  let { state } = useContext(Context)
  let recipe = getRecipe(state, recipeId, boxId)
  if (recipe === undefined) {
    return <div>Unable to find recipe.</div>
  }
  return (
    <RecipeCard recipeId={recipeId!} boxId={boxId} recipe={recipe} />
  )
}

export function RoutedRecipe() {
  let params = useParams();
  return <Recipe recipeId={params.recipeId!} boxId={params.boxId!} />
}