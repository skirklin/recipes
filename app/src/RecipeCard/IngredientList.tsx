import { useState, useContext } from 'react';
import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';
import { Recipe } from 'schema-dts';
import { ingredientsToStr, strToIngredients } from '../utils';
import { RecipeContext } from './context';
import { Context } from '../context';


const Ingredient = styled.li`
  padding-bottom: 3px;
`


function IngredientList() {
  const [editable, setEditablePrimitive] = useState(false);
  const { state, dispatch } = useContext(RecipeContext);
  const rbState = useContext(Context).state;

  const setEditable = (value: boolean) => {
    console.log("want to set editable")
    if (rbState.writeable) {
      console.log("actually setting editable")
      setEditablePrimitive(value)
    } else {
      console.log(`but couldn't because writeable ${rbState.writeable}`)
    }
  }

  const ingredientsStyle = {
    outline: "none",
    padding: "10px",
    margin: "0px 0px 0px 20px",
    backgroundColor: "lightyellow",
    display: "inline-block",
    width: "60%",
  }

  let ingredients = state.recipe.recipeIngredient;
  const handleChange = (e: any) => {
    if (formatIngredientList(ingredients) !== e.target.value) {
      dispatch({ type: "SET_INGREDIENTS", payload: strToIngredients(e.target.value) });
    }
    setEditable(false)
  }

  function formatIngredientList(ingredients: Recipe["recipeIngredient"]) {
    let listElts = Array.prototype.map.call(ingredients || [], (ri, id) => <Ingredient key={id}>{ri}</Ingredient>)
    return (
      <ul style={{ ...ingredientsStyle, listStylePosition: "outside", listStyleType: "unset" }}>
        {listElts}
      </ul>
    )
  }
  if (editable) {
    return (
      <TextareaAutosize
        defaultValue={ingredientsToStr(ingredients!)}
        autoFocus
        style={{ ...ingredientsStyle }}
        onBlur={handleChange} />
    )
  } else {
    return (
      <div onDoubleClick={() => setEditable(true)}>
        {formatIngredientList(ingredients!)}
      </div>
    )
  }
}

export default IngredientList