import { useState, useContext } from 'react';
import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';
import { Recipe } from 'schema-dts';
import { ingredientsToStr, strToIngredients } from '../utils';
import { RecipeContext } from './context';


const Ingredient = styled.ul`
  padding-bottom: 3px;
`


function IngredientList() {
  const [editable, setEditable] = useState(false);
  const { state, dispatch } = useContext(RecipeContext);

  const ingredientsStyle = {
    outline: "none",
    padding: "5px",
    margin: "0px 0px 15px 25px",
    backgroundColor: "lightyellow",
    display: "inline-block",
    width: "50%",
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