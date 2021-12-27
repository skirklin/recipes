import { SaveOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { doc, setDoc } from 'firebase/firestore';
import { useContext } from 'react';
import styled from 'styled-components';
import { db } from '../App';
import { RecipeBoxContext } from '../context';
import { getRecipe } from '../utils';

import { RecipeContext } from './context';

const StyledButton = styled(Button)`
  background-color: green;
  display: inline;
`

function SaveButton() {
  const { state } = useContext(RecipeContext);
  const recipe = getRecipe(useContext(RecipeBoxContext).state, state.recipePtr)!

  function save() {
    setDoc(doc(db, "boxes", state.recipePtr.boxId, "recipes", state.recipePtr.recipeId), recipe)
  }

  if (state.changed) {
    return <StyledButton icon={<SaveOutlined />} onClick={save}>Save</StyledButton>
  } else {
    return null
  }
}

export default SaveButton;