import { useState, useContext } from 'react';
import styled from 'styled-components';
import { Recipe } from 'schema-dts';
import { getAppUserFromState, getRecipeFromState, ingredientsToStr, strToIngredients } from '../utils';
import { Context } from '../context';
import { RecipeCardProps } from './RecipeCard';
import { StyledTextArea } from '../StyledComponents';


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
    margin: "0px 0px 0px 30px",
    backgroundColor: "var(--pale-spring-bud)",
    display: "inline-block",
    width: "fit-content",
    minWidth: "50%",
  }

  const setEditable = (value: boolean) => {
    const user = getAppUserFromState(state)
    if (state.writeable && user && recipe.owners.includes(user.id)) {
      setEditablePrimitive(value)
    }
  }

  const ingredients = recipe.changed ? recipe.changed.recipeIngredient : recipe.data.recipeIngredient || [];
  const handleChange = (value: string) => {
    if (ingredientsToStr(ingredients) !== value) {
      dispatch({ type: "SET_INGREDIENTS", recipeId, boxId, payload: strToIngredients(value) });
    }
    setEditable(false)
  }

  function formatIngredientList(ingredients: Recipe["recipeIngredient"]) {
    const listElts = Array.prototype.map.call(ingredients || [], (ri, id) => <Ingredient key={id}>{ri}</Ingredient>)
    return (
      <ul style={{ ...ingredientsStyle, listStylePosition: "outside", listStyleType: "none" }}>
        {listElts.length > 0 ? listElts : "Add ingredients?"}
      </ul>
    )
  }
  if (editable) {
    return (
      <StyledTextArea
        defaultValue={ingredientsToStr(ingredients)}
        autoFocus
        autoSize
        placeholder='Add ingredients?'
        onKeyUp={(e) => { if (e.code === "Escape") { handleChange(e.currentTarget.value) } }}
        style={{ ...ingredientsStyle }}
        onBlur={(e) => handleChange(e.target.value)} />
    )
  } else {
    return (
      <div onDoubleClick={() => setEditable(true)} >
        {formatIngredientList(ingredients)}
      </div>
    )
  }
}

export default IngredientList
