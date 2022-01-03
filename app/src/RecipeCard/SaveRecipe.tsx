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
  const rbState = useContext(Context).state

  if (recipe === undefined) {
    return null
  }

  async function save() {
    let docRef;
    if (state.recipeId === undefined || state.recipeId.startsWith("uniqueId=")) {
      let docRef = await addRecipe(state.boxId, state.recipe!)
      dispatch({ type: "SET_RECIPE", payload: state.recipe, recipeId: docRef.id })
    } else {
      docRef = doc(db, "recipes", state.recipeId);
      await setDoc(docRef, state.recipe)
      dispatch({ type: "SET_RECIPE", payload: state.recipe, recipeId: docRef.id })
    }
  }

  let writeable = false;
  let user = getAuth().currentUser
  if (rbState.writeable && user && user.uid in recipe.owners && state.recipe !== undefined) {
    writeable = true;
  }

  if (state.changed) {
    return <StyledButton icon={<SaveOutlined />} disabled={!writeable} onClick={save}>Save</StyledButton>
  } else {
    return null
  }
}

export default SaveButton;