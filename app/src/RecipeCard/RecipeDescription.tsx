import { useContext, useState } from 'react';
import styled from 'styled-components';
import { Context } from '../context';
import { StyledTextArea } from '../StyledComponents';
import { getRecipeFromState } from '../state';
import { getEditableSetter, RecipeCardProps } from './RecipeCard';


const Description = styled.div`
  font-style: italic;
  display: inline-flex;
  font-family: sans-serif;
  font-size: 16px;
  padding: 0px;
  margin: 0px 20px;
  minWidth: 60%;
`

function RecipeDescription(props: RecipeCardProps) {
  const { recipeId, boxId } = props;
  const [editable, setEditablePrimitive] = useState(false);
  const { state, dispatch } = useContext(Context);

  const recipe = getRecipeFromState(state, boxId, recipeId)
  if (recipe === undefined) { return null }
  const setEditable = getEditableSetter(state, recipeId, boxId, setEditablePrimitive)

  const description = recipe.getDescription()
  function handleChange(value: string) {
    if (value !== description) {
      dispatch({ type: "SET_DESCRIPTION", recipeId, boxId, payload: value });
    }
    setEditable(false);
  }

  let textAreaProps;
  if (description !== undefined) {
    textAreaProps = { defaultValue: description }
  } else {
    textAreaProps = {}
  }

  if (editable || recipe.editing) {
    return (
      <StyledTextArea
        autoSize
        placeholder="Add a description?"
        autoFocus
        onKeyUp={(e) => { if (e.code === "Escape") { handleChange(e.currentTarget.value) } }}
        style={{ display: "inline-flex", fontStyle: "italic", minWidth: "60%", fontFamily: "sans-serif", fontSize: "16px" }}
        onBlur={e => handleChange(e.target.value)}
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