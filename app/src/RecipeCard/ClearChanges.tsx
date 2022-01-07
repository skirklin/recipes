import { useContext } from 'react';
import styled from 'styled-components';

import { Button } from 'antd';
import { RecipeContext } from './context';

const StyledButton = styled(Button)`
  display: inline;
`

function ClearButton() {
  const { state, dispatch } = useContext(RecipeContext);
  function clear() {
    dispatch({type: "SET_RECIPE", payload: state.original})
  }

  if (state.changed) {
    return <StyledButton onClick={clear}>Clear changes</StyledButton>
  } else {
    return null
  }
}

export default ClearButton;