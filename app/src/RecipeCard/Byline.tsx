import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { Context } from '../context';
import { getAuth } from 'firebase/auth';
import { getRecipeFromState, authorToStr } from '../utils';
import { RecipeCardProps } from './RecipeCard';

const EditableByline = styled.input`
  font-style: italic;
  display: inline-block;
  padding: 0px 0px 0px 30px;
  outline: none;
`

const StyledByline = styled.p`
  display: inline-block;
  font-style: italic;
  padding: 0px 0px 0px 30px;
  outline: none;
`

function Byline(props: RecipeCardProps) {
  const { recipeId, boxId } = props;
  const [editable, setEditablePrimitive] = useState(false);
  const [value, setValue] = useState<string>();
  const { state, dispatch } = useContext(Context);
  const recipe = getRecipeFromState(state, boxId, recipeId)
  if (recipe === undefined) { return null }

  const setEditable = (value: boolean) => {
    const user = getAuth().currentUser
    if (state.writeable && user && recipe.owners.includes(user.uid)) {
      setEditablePrimitive(value)
    }
  }

  const rd = recipe.changed ? recipe.changed : recipe.data
  const byline = authorToStr(rd.author)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: any) => {
    if (byline !== e.target.value) {
      dispatch({ type: "SET_BYLINE", payload: e.target.value });
    }
    setEditable(false);
  }
  if (!byline) {
    return null
  }
  if (editable) {
    return (
      <>
        <span> Author:</span>
        <EditableByline type="text"
          size={byline.length}
          value={byline}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          onKeyUp={(e) => { if (e.code === "Escape" || e.code === "Enter") { handleChange(value) } }}
          onBlur={() => handleChange(value)} />
      </>
    )
  } else {
    return (
      <StyledByline onDoubleClick={() => setEditable(true)}>
        Author: {byline}
      </StyledByline>
    )
  }
}

export default Byline;