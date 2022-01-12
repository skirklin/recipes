import { useContext, useState } from 'react';
import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';
import { Recipe } from 'schema-dts';
import { getRecipeFromState, instructionsToStr, strToInstructions } from '../utils';
import { Context } from '../context';
import { getAuth } from 'firebase/auth';
import { RecipeCardProps } from './RecipeCard';



const RecipeStepsArea = styled.div`
  margin-top: 10px;
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
  const setEditable = (value: boolean) => {
    const user = getAuth().currentUser
    if (state.writeable && user && recipe.owners.includes(user.uid)) {
      setEditablePrimitive(value)
    }
  }

  const instructions = recipe.changed ? recipe.changed.recipeInstructions : recipe.data.recipeInstructions;

  const handleChange = (value: string) => {
    if (instructionsToStr(instructions) !== value) {
      dispatch({ type: "SET_INSTRUCTIONS", boxId, recipeId, payload: strToInstructions(value) });
    }
    setEditable(false)
  }

  if (editable) {
    return (
      <RecipeStepsArea>
        <TextareaAutosize
          defaultValue={instructionsToStr(instructions)}
          autoFocus
          placeholder='Add instructions?'
          onKeyUp={(e) => { if (e.code === "Escape") { handleChange(e.currentTarget.value) } }}
          style={{paddingLeft: "20px"}}
          onBlur={e => handleChange(e.target.value)} />
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