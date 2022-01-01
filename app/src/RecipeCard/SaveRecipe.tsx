import { SaveOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { useContext } from 'react';
import styled from 'styled-components';
import { db } from '../App';

import { RecipeContext } from './context';

const StyledButton = styled(Button)`
  background-color: green;
  display: inline;
`

function SaveButton() {
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
    }

  }

  if (state.changed) {
    return <StyledButton icon={<SaveOutlined />} onClick={save}>Save</StyledButton>
  } else {
    return null
  }
}

export default SaveButton;