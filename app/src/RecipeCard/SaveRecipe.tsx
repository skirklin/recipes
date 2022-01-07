import { SaveOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useContext } from 'react';
import styled from 'styled-components';
import { db } from '../backend';
import { Context } from '../context';
import { addRecipe } from '../utils';

import { RecipeContext } from './context';

const StyledButton = styled(Button)`
  background-color: green;
  display: inline;
`

function SaveButton() {
  const { state, dispatch } = useContext(RecipeContext);
  const { recipe } = state;
  const { state: rbState, dispatch: rbDispatch} = useContext(Context)

  if (recipe === undefined) {
    return null
  }

  async function save() {
    let docRef;
    if (state.recipeId === undefined || state.recipeId.startsWith("uniqueId=")) {
      const docRef = await addRecipe(state.boxId, state.recipe!, rbDispatch)
      dispatch({ type: "SET_RECIPE", payload: state.recipe, recipeId: docRef.id })
    } else {
      docRef = doc(db, "boxes", state.boxId, "recipes", state.recipeId);
      await setDoc(docRef, state.recipe)
      dispatch({ type: "SET_RECIPE", payload: state.recipe, recipeId: docRef.id })
    }
  }

  let writeable = false;
  const user = getAuth().currentUser
  if (rbState.writeable && user && recipe.owners.includes(user.uid) && recipe !== undefined) {
    writeable = true;
  }

  if (state.changed) {
    return <StyledButton icon={<SaveOutlined />} disabled={!writeable} onClick={save}>Save</StyledButton>
  } else {
    return null
  }
}

export default SaveButton;