import { useContext, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../context';
import DeleteButton from '../Buttons/DeleteRecipe'
import DownloadButton from '../Buttons/DownloadRecipe';
import VisibilityControl from '../Buttons/Visibility';
import ForkButton from '../Buttons/ForkRecipe';
import RecipeCard from '../RecipeCard/RecipeCard';
import { RecipeType } from '../types';
import { getRecipe } from '../utils';
import { RecipeActionType, RecipeContext, recipeReducer, RecipeStateType } from '../RecipeCard/context';
import _ from 'lodash';
import { RecipeActionGroup } from '../StyledComponents';

interface RecipeProps {
  boxId: string
  recipeId: string
  recipe?: RecipeType
}


export function Recipe(props: RecipeProps) {
  let { recipeId, boxId } = props;
  let { state } = useContext(Context)
  let original = _.cloneDeep(props.recipe)

  const [rState, dispatch] = useReducer<React.Reducer<RecipeStateType, RecipeActionType>>(recipeReducer, {
    recipe: props.recipe, original, recipeId, boxId,
    changed: false
  });
  const { recipe } = rState;

  useEffect(() => {
    (async () => {
      if (props.recipe !== undefined) {
        return
      }
      let newRecipe = await getRecipe(state, boxId, recipeId);
      if (newRecipe !== undefined) {
        dispatch({ type: "SET_RECIPE", payload: newRecipe })
      }
    })()
  }, [recipeId, boxId, state, props.recipe]
  )

  if (recipe === undefined) {
    return <div>Unable to find recipe.</div>
  }
  return (
    <RecipeContext.Provider value={{ dispatch, state: rState }}>
      <RecipeActionGroup>
        <DeleteButton recipeId={recipeId} boxId={boxId} />
        <DownloadButton recipe={recipe} />
        <ForkButton recipe={recipe} />
        <VisibilityControl boxId={boxId} recipeId={recipeId} recipe={recipe} />
      </RecipeActionGroup>
      <RecipeCard />
    </RecipeContext.Provider>
  )
}

export default function RoutedRecipe() {
  let params = useParams();
  return <Recipe recipeId={params.recipeId!} boxId={params.boxId!} />
}