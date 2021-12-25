import { useContext, useState } from 'react';
import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';
import { Recipe } from 'schema-dts';
import { instructionsToStr, strToInstructions } from '../utils';
import { RecipeContext } from './context';



const RecipeStepsList = styled.ol`
  margin: 15px;
  display: inline-block;
`

const RecipeStep = styled.li`
  padding-bottom: 10px;
`


function InstructionList() {
  const [editable, setEditable] = useState(false);
  const { state, dispatch } = useContext(RecipeContext);

  const instructionsStyle = {
    outline: "none",
    margin: "15px",
    width: "90%",
  }

  function formatInstructionList(instructions: Recipe["recipeInstructions"]) {
    let listElts;
    if (typeof instructions === "string") {
      listElts = [<RecipeStep key={0}>{instructions}</RecipeStep>]
    } else {
      listElts = Array.prototype.map.call(instructions || [], (ri, id) => <RecipeStep key={id}>{ri.text}</RecipeStep>)
    }
    return (
      <RecipeStepsList>
        {listElts}
      </RecipeStepsList>
    )
  }

  let instructions = state.recipe.recipeInstructions;

  if (editable) {
    return (
      <TextareaAutosize
        defaultValue={instructionsToStr(instructions!)}
        autoFocus
        style={{ ...instructionsStyle }}
        onBlur={(e) => { dispatch({type: "SET_INSTRUCTIONS", payload: strToInstructions(e.target.value)}); setEditable(false) }} />
    )
  } else {
    return (
      <div onDoubleClick={() => setEditable(true)}>
        {formatInstructionList(instructions)}
      </div>
    )
  }
}

export default InstructionList;