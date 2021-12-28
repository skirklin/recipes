import { useContext, useState } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import styled from 'styled-components';
import { Context } from '../context';

import { RecipeContext } from './context';


const Description = styled.p`
  font-style: italic;
  display: inline-flex;
  font-family: sans-serif;
  font-size: 16px;
  padding: 0px;
  margin: 0px;
  width: 60%;
`

function RecipeDescription() {
  const [editable, setEditablePrimitive] = useState(false);
  const { state, dispatch } = useContext(RecipeContext);
  const rbState = useContext(Context).state;

  const setEditable = (value: boolean) => {
    if (!rbState.readonly) {
      setEditablePrimitive(value)
    }
  }


  let description = (state.recipe.description || "Add a description?").toString();
  const handleChange = (e: any) => {
    if (e.target.value !== description) {
      dispatch({ type: "SET_DESCRIPTION", payload: e.target.value });
    }
    setEditable(false)
  }

  if (editable) {
    return (
      <TextareaAutosize
        defaultValue={description}
        autoFocus
        style={{ display: "inline-flex", fontStyle: "italic", width: "60%", fontFamily: "sans-serif", fontSize: "16px" }}
        onBlur={handleChange}
      />
    )
  } else {
    return (
      <Description onDoubleClick={() => setEditable(true)}>
        {description}
      </Description>
    )
  }
}

export default RecipeDescription;