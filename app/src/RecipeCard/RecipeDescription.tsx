import { getAuth } from 'firebase/auth';
import { useContext, useState } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import styled from 'styled-components';
import { Context } from '../context';
import { getRecipeFromState } from '../utils';
import { RecipeCardProps } from './RecipeCard';


const Description = styled.div`
  font-style: italic;
  display: inline-flex;
  font-family: sans-serif;
  font-size: 16px;
  padding: 0px;
  margin: 0px 20px;
  width: 60%;
`

function RecipeDescription(props: RecipeCardProps) {
  const { recipeId, boxId } = props;
  const [editable, setEditablePrimitive] = useState(false);
  const { state, dispatch } = useContext(Context);

  const recipe = getRecipeFromState(state, boxId, recipeId)
  if (recipe === undefined) { return null }
  const setEditable = (value: boolean) => {
    const user = getAuth().currentUser
    if (state.writeable && user && recipe.owners.includes(user.uid)) {
      setEditablePrimitive(value)
    }
  }

  const description = recipe.changed ? recipe.changed.description : recipe.data.description
  // eslint-disable-next-line @typescript-eslint/no-explicit-any 
  function handleChange(e: any) {
    if (e.target.value !== description) {
      dispatch({ type: "SET_DESCRIPTION", recipeId, boxId, payload: e.target.value });
    }
    setEditable(false);
  }

  let textAreaProps;
  if (description !== undefined) {
    textAreaProps = { defaultValue: description.toString() }
  } else {
    textAreaProps = {}
  }

  if (editable) {
    return (
      <TextareaAutosize
        placeholder="Add a description?"
        autoFocus
        onKeyUp={(e) => { if (e.code === "Escape") { handleChange(e) } }}
        style={{ display: "inline-flex", fontStyle: "italic", width: "60%", fontFamily: "sans-serif", fontSize: "16px" }}
        onBlur={handleChange}
        {...textAreaProps}
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