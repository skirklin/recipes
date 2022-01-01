import { useContext } from 'react';
import styled from 'styled-components';

import { Button } from 'antd';
import { RecipeContext } from './context';
import { getRecipe } from '../utils';
import { Context } from '../context';
import _ from 'lodash';

const StyledButton = styled(Button)`
  display: inline;
`

function ClearButton() {
  const { state, dispatch } = useContext(RecipeContext);
  const ctx = useContext(Context)
  const {recipeId, boxId} = state;
  const original = state.recipe || _.cloneDeep(getRecipe(ctx.state, recipeId, boxId))

  function clear() {
    dispatch({type: "SET_RECIPE", payload: original})
  }

  if (state.changed) {
    return <StyledButton onClick={clear}>Clear changes</StyledButton>
  } else {
    return null
  }
}

export default ClearButton;