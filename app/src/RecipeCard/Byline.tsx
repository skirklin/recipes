import { Input } from 'antd';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { Context } from '../context';
import { getRecipeFromState, authorToStr, getAppUserFromState } from '../utils';
import { RecipeCardProps } from './RecipeCard';

const EditableByline = styled(Input)`
  font-style: italic;
  padding: 0px 0px 0px 3px;
  outline: none;
  &:focus {
    border: none;
    box-shadow: none;
  }
  &:hover {
    border: none;
    box-shadow: none;
  }
`

const StyledByline = styled.div`
  display: flex;
  font-style: italic;
  padding: 0px 0px 0px 30px;
  outline: none;
`

function Byline(props: RecipeCardProps) {
  const { recipeId, boxId } = props;
  const [editable, setEditablePrimitive] = useState(false);
  const { state, dispatch } = useContext(Context);
  const recipe = getRecipeFromState(state, boxId, recipeId)
  if (recipe === undefined) { return null }

  const setEditable = (value: boolean) => {
    const user = getAppUserFromState(state)
    if (state.writeable && user && recipe.owners.includes(user.id)) {
      setEditablePrimitive(value)
    }
  }

  const rd = recipe.changed ? recipe.changed : recipe.data
  const byline = authorToStr(rd.author)
  const handleChange = (value: string) => {
    if (byline !== value) {
      dispatch({ type: "SET_BYLINE", payload: value });
    }
    setEditable(false);
  }
  if (editable) {
    return (
      <StyledByline>
        <span>Author:</span>
        <EditableByline type="text"
          defaultValue={byline}
          autoFocus
          placeholder='Add author?'
          onKeyUp={(e) => { if (e.code === "Escape" || e.code === "Enter") { handleChange(e.currentTarget.value) } }}
          onBlur={(e) => handleChange(e.target.value)}
        />
      </StyledByline>
    )
  } else {
    return (
      <StyledByline onDoubleClick={() => setEditable(true)}>
        Author: {byline || "Add author?"}
      </StyledByline>
    )
  }
}

export default Byline;