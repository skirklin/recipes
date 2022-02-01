import { useContext, useState } from 'react';
import styled from 'styled-components';
import { Recipe } from 'schema-dts';
import { getRecipeFromState, instructionsToStr, strToInstructions } from '../utils';
import { Context } from '../context';
import { getEditableSetter, RecipeCardProps } from './RecipeCard';
import { StyledTextArea } from '../StyledComponents';



const RecipeStepsArea = styled.div`
  margin-top: 10px;
  width: 100%;
`

const RecipeStep = styled.li`
  padding-bottom: 5px;
`


function InstructionList(props: RecipeCardProps) {
  const [editable, setEditablePrimitive] = useState(false);
  const { recipeId, boxId } = props;
  const { state, dispatch } = useContext(Context);
  const recipe = getRecipeFromState(state, boxId, recipeId)
  if (recipe === undefined) {
    return null
  }

  function formatInstructionList(instructions: Recipe["recipeInstructions"]) {
    let listElts;
    if (typeof instructions === "string") {
      listElts = [<RecipeStep key={0}>{instructions}</RecipeStep>]
    } else {
      listElts = Array.prototype.map.call(instructions || [], (ri, id) => <RecipeStep key={id}>{ri.text}</RecipeStep>)
    }
    if (listElts.length > 0) {
      return (
        <ol>
          {listElts}
        </ol>
      )
    } else {
      return (
        <div>Add instructions?</div>
      )
    }
  }

  if (recipe === undefined) { return null }
  const setEditable = getEditableSetter(state, recipeId, boxId, setEditablePrimitive)

  const instructions = recipe.changed ? recipe.changed.recipeInstructions : recipe.data.recipeInstructions;

  const handleChange = (value: string) => {
    if (instructionsToStr(instructions) !== value) {
      dispatch({ type: "SET_INSTRUCTIONS", boxId, recipeId, payload: strToInstructions(value) });
    }
    setEditable(false)
  }

  if (editable || recipe.editing) {
    return (
      <RecipeStepsArea>

        <StyledTextArea
          defaultValue={instructionsToStr(instructions)}
          autoFocus
          autoSize
          placeholder='Add instructions?'
          onKeyUp={(e) => { if (e.code === "Escape") { handleChange(e.currentTarget.value) } }}
          onBlur={e => handleChange(e.target.value)}
        />
      </RecipeStepsArea>
    )
  } else {
    return (
      <RecipeStepsArea onDoubleClick={() => setEditable(true)}>
        {formatInstructionList(instructions)}
      </RecipeStepsArea>
    )
  }
}

export default InstructionList;