import { SaveOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { doc, setDoc } from 'firebase/firestore';
import { useContext } from 'react';
import styled from 'styled-components';
import { db } from '../backend';
import { addRecipe } from '../utils';

import { RecipeContext } from './context';

const StyledButton = styled(Button)`
  background-color: green;
  display: inline;
`

function SaveButton() {
  const { state, dispatch } = useContext(RecipeContext);

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

  if (state.changed) {
    return <StyledButton icon={<SaveOutlined />} disabled={state.recipe === undefined} onClick={save}>Save</StyledButton>
  } else {
    return null
  }
}

export default SaveButton;