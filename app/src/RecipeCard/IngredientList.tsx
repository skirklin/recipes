import { useState, useContext } from 'react';
import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';
import { Recipe } from 'schema-dts';
import { getRecipeFromState, ingredientsToStr, strToIngredients } from '../utils';
import { Context } from '../context';
import { getAuth } from 'firebase/auth';
import { RecipeCardProps } from './RecipeCard';


const Ingredient = styled.li`
  padding-bottom: 3px;
`


function IngredientList(props: RecipeCardProps) {
  const [editable, setEditablePrimitive] = useState(false);
  const { recipeId, boxId } = props;
  const { state, dispatch } = useContext(Context);
  const recipe = getRecipeFromState(state, boxId, recipeId)
  if (recipe === undefined) {
    return null
  }

  const ingredientsStyle = {
    outline: "none",
    padding: "10px",
    margin: "0px 0px 0px 20px",
    backgroundColor: "lightyellow",
    display: "inline-block",
    width: "60%",
  }

  const setEditable = (value: boolean) => {
    const user = getAuth().currentUser
    if (state.writeable && user && recipe.owners.includes(user.uid)) {
      setEditablePrimitive(value)
    }
  }

  const ingredients = recipe.changed ? recipe.changed.recipeIngredient : recipe.data.recipeIngredient || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: any) => {
    console.log(e)
    if (ingredientsToStr(ingredients) !== e.target.value) {
      dispatch({ type: "SET_INGREDIENTS", recipeId, boxId, payload: strToIngredients(e.target.value) });
    }
    setEditable(false)
  }

  function formatIngredientList(ingredients: Recipe["recipeIngredient"]) {
    const listElts = Array.prototype.map.call(ingredients || [], (ri, id) => <Ingredient key={id}>{ri}</Ingredient>)
    if (listElts.length === 0) {
      return (
        <ul style={{ ...ingredientsStyle, listStylePosition: "outside", listStyleType: "unset" }}>
          {"Add ingredients?"}
        </ul>
      )
    }
    return (
      <ul style={{ ...ingredientsStyle, listStylePosition: "outside", listStyleType: "unset" }}>
        {listElts}
      </ul>
    )
  }
  if (editable) {
    return (
      <TextareaAutosize
        defaultValue={ingredientsToStr(ingredients)}
        autoFocus
        onKeyUp={(e) => { if (e.code === "Escape") { handleChange(e) } }}
        style={{ ...ingredientsStyle }}
        onBlur={handleChange} />
    )
  } else {
    return (
      <div onDoubleClick={() => setEditable(true)}>
        {formatIngredientList(ingredients)}
      </div>
    )
  }
}

export default IngredientList
