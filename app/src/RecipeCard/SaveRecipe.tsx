import { SaveOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { doc, setDoc } from 'firebase/firestore';
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
    let docRef = doc(db, "boxes", state.recipePtr.boxId, "recipes", state.recipePtr.recipeId);
    dispatch({type: "SET_RECIPE", payload: state.recipe})
    await setDoc(docRef, state.recipe)
  }

  if (state.changed) {
    return <StyledButton icon={<SaveOutlined />} onClick={save}>Save</StyledButton>
  } else {
    return null
  }
}

export default SaveButton;