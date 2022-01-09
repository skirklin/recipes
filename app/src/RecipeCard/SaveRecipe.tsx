import styled from 'styled-components';
import { SaveOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { db } from '../backend';
import { Context } from '../context';
import { addRecipe, getRecipeFromState } from '../utils';
import { RecipeCardProps } from './RecipeCard';

const StyledButton = styled(Button)`
  background-color: green;
  display: inline;
`

function SaveButton(props: RecipeCardProps) {
  const { state, dispatch } = useContext(Context)
  const { recipeId, boxId } = props;
  const recipe = getRecipeFromState(state, boxId, recipeId)
  const navigate = useNavigate()

  if (recipe === undefined) {
    return null
  }

  const save = async () => {
    let docRef;
    if (recipeId.startsWith("uniqueId=")) {
      const docRef = await addRecipe(boxId, recipe, dispatch)
      navigate(`/boxes/${boxId}/recipes/${docRef.id}`)
    } else {
      docRef = doc(db, "boxes", boxId, "recipes", recipeId);
      await setDoc(docRef, recipe)
    }
  }

  let writeable = false;
  const user = getAuth().currentUser
  if (state.writeable && user && recipe.owners.includes(user.uid) && recipe !== undefined) {
    writeable = true;
  }

  if (recipe.changed) {
    return <StyledButton icon={<SaveOutlined />} disabled={!writeable} onClick={save}>Save</StyledButton>
  } else {
    return null
  }
}

export default SaveButton;