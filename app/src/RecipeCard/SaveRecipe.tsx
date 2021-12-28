import { SaveOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { useContext } from 'react';
import styled from 'styled-components';
import { db } from '../App';
import { Context } from '../context';

import { RecipeContext } from './context';

const StyledButton = styled(Button)`
  background-color: green;
  display: inline;
`

function SaveButton() {
  const rbCtx = useContext(Context)
  const { state, dispatch } = useContext(RecipeContext);

  async function save() {
    let docRef;
    if (state.recipeId !== undefined) {
      docRef = doc(db, "boxes", state.boxId, "recipes", state.recipeId);
      await setDoc(docRef, state.recipe)
      dispatch({ type: "SET_RECIPE", payload: state.recipe, recipeId: docRef.id })
    } else {
      let colRef = collection(db, "boxes", state.boxId, "recipes")
      docRef = await addDoc(colRef, state.recipe)
      dispatch({ type: "SET_RECIPE", payload: state.recipe, recipeId: docRef.id })
      rbCtx.dispatch({
        type: "CHANGE_TAB",
        payload: {
          prevRecipePtr: { recipeId: state.recipeId, boxId: state.boxId },
          recipePtr: { boxId: state.boxId, recipeId: docRef.id }
        }
      })
    }

  }

  if (state.changed) {
    return <StyledButton icon={<SaveOutlined />} onClick={save}>Save</StyledButton>
  } else {
    return null
  }
}

export default SaveButton;