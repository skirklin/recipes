import { useContext, useState } from 'react';
import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';
import { Recipe } from 'schema-dts';
import { instructionsToStr, strToInstructions } from '../utils';
import { RecipeContext } from './context';
import { Context } from '../context';



const RecipeStepsList = styled.ol`
  margin: 20px;
  padding: 20px;
`

const RecipeStep = styled.li`
  padding-bottom: 10px;
`


function InstructionList() {
  const [editable, setEditablePrimitive] = useState(false);
  const { state, dispatch } = useContext(RecipeContext);
  const rbState = useContext(Context).state;

  const setEditable = (value: boolean) => {
    if (rbState.writeable) {
      setEditablePrimitive(value)
    }
  }

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
    if (listElts.length === 0) {
      return (
        <RecipeStepsList>
          {"Add instructions?"}
        </RecipeStepsList>
      )
    }
    return (
      <RecipeStepsList>
        {listElts}
      </RecipeStepsList>
    )
  }

  let instructions = state.recipe.data.recipeInstructions;

  const handleChange = (e: any) => {
    if (formatInstructionList(instructions) !== e.target.value) {
      dispatch({ type: "SET_INSTRUCTIONS", payload: strToInstructions(e.target.value) });
    }
    setEditable(false)
  }

  if (editable) {
    return (
      <TextareaAutosize
        defaultValue={instructionsToStr(instructions!)}
        autoFocus
        style={{ ...instructionsStyle }}
        onBlur={handleChange} />
    )
  } else {
    return (
      <div onDoubleClick={() => setEditable(true)}>
        {formatInstructionList(instructions) || "Add instructions?"}
      </div>
    )
  }
}

export default InstructionList;