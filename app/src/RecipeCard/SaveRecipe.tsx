import styled from 'styled-components';
import { SaveOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { doc, setDoc } from 'firebase/firestore';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { db } from '../backend';
import { Context } from '../context';
import { addRecipe, canUpdateRecipe, getAppUserFromState, getBoxFromState, getRecipeFromState } from '../utils';
import { RecipeCardProps } from './RecipeCard';
import _ from 'lodash';
import { recipeConverter } from '../storage';

const StyledButton = styled(Button)`
  background-color: lightgreen;
`

function SaveButton(props: RecipeCardProps) {
  const { state, dispatch } = useContext(Context);
  const { recipeId, boxId } = props;
  const recipe = getRecipeFromState(state, boxId, recipeId)
  const box = getBoxFromState(state, boxId)
  const user = getAppUserFromState(state)
  const navigate = useNavigate()

  if (recipe === undefined || box === undefined) {
    return null
  }

  const save = async () => {
    let docRef;
    if (recipe.changed === undefined) {
      return
    }
    const newRecipe = _.cloneDeep(recipe)
    newRecipe.data = recipe.changed
    newRecipe.changed = undefined
    newRecipe.editing = false
    if (recipeId.startsWith("uniqueId=")) {
      const docRef = await addRecipe(boxId, newRecipe, dispatch)
      dispatch({type: "REMOVE_RECIPE", recipeId, boxId}) // removes the local-only version of the recipe
      navigate(`/boxes/${boxId}/recipes/${docRef.id}`)
    } else {
      docRef = doc(db, "boxes", boxId, "recipes", recipeId).withConverter(recipeConverter)
      dispatch({type: "ADD_RECIPE", recipeId, boxId, payload: newRecipe})
      await setDoc(docRef, newRecipe)
    }
  }

  let writeable = false;
  if (state.writeable &&  canUpdateRecipe(recipe, box, user)) {
    writeable = true;
  }

  if (recipe.changed) {
    return <StyledButton icon={<SaveOutlined />} disabled={!writeable} onClick={save}>Save</StyledButton>
  } else {
    return null
  }
}

export default SaveButton;