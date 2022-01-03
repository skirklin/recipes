import { getAuth } from 'firebase/auth';
import { useContext, useState } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import styled from 'styled-components';
import { Context } from '../context';

import { RecipeContext } from './context';


const Description = styled.div`
  font-style: italic;
  display: inline-flex;
  font-family: sans-serif;
  font-size: 16px;
  padding: 0px;
  margin: 0px 20px;
  width: 60%;
`

function RecipeDescription() {
  const [editable, setEditablePrimitive] = useState(false);
  const { state, dispatch } = useContext(RecipeContext);
  const rbState = useContext(Context).state;

  const recipe = state.recipe
  if (recipe === undefined)  { return null }
  const setEditable = (value: boolean) => {
    let user = getAuth().currentUser
    if (rbState.writeable && user && recipe.owners.includes(user.uid)  ) {
      setEditablePrimitive(value)
    }
  }

  let description = recipe.data.description
  const handleChange = (e: any) => {
    if (e.target.value !== description) {
      dispatch({ type: "SET_DESCRIPTION", payload: e.target.value });
    }
    setEditable(false)
  }

  let props;
  if (description !== undefined) {
    props = {defaultValue: description.toString()}
  } else {
    props = {}
  }

  if (editable) {
    return (
      <TextareaAutosize
        placeholder="Add a description?"
        autoFocus
        style={{ display: "inline-flex", fontStyle: "italic", width: "60%", fontFamily: "sans-serif", fontSize: "16px" }}
        onBlur={handleChange}
        {...props}
      />
    )
  } else {
    return (
      <Description onDoubleClick={() => setEditable(true)}>
        {description || "Add a description?"}
      </Description>
    )
  }
}

export default RecipeDescription;