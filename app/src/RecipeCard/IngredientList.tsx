import { useState, useContext, CSSProperties } from 'react';
import styled from 'styled-components';
import { Recipe } from 'schema-dts';
import { canUpdateRecipe, getAppUserFromState, getBoxFromState, getRecipeFromState, ingredientsToStr, strToIngredients } from '../utils';
import { Context } from '../context';
import { RecipeCardProps } from './RecipeCard';
import { StyledTextArea } from '../StyledComponents';
import { useMediaQuery } from 'react-responsive';


const Ingredient = styled.li`
  padding-bottom: 3px;
`


function IngredientList(props: RecipeCardProps) {
  const [editable, setEditablePrimitive] = useState(false);
  const { recipeId, boxId } = props;
  const { state, dispatch } = useContext(Context);
  const recipe = getRecipeFromState(state, boxId, recipeId)
  const box = getBoxFromState(state, boxId)
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

  if (recipe === undefined || box === undefined) {
    return null
  }

  const baseIngredientsStyle = {
    outline: "none",
    padding: "10px",
    margin: "0px 0px 0px 30px",
    backgroundColor: "var(--pale-spring-bud)",
    display: "inline-block",
  }
  let ingredientsStyle: CSSProperties
  if (isTabletOrMobile) {
    ingredientsStyle = {
      ...baseIngredientsStyle
      ,
      width: "fit-content",
      minWidth: "50%",
    }
  } else {
    ingredientsStyle = {
      ...baseIngredientsStyle,
      width: "100%"

    }
  }

  const setEditable = (value: boolean) => {
    const user = getAppUserFromState(state)
    if (state.writeable && canUpdateRecipe(recipe, box, user)) {
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
    const ingredientArray = Array.isArray(ingredients) ? ingredients : [];
    const listElts = ingredientArray.map((ri, id) => <Ingredient key={id}>{String(ri)}</Ingredient>);
    return (
      <ul style={{ ...ingredientsStyle, listStylePosition: "outside", listStyleType: "none" }}>
        {listElts.length > 0 ? listElts : "Add ingredients?"}
      </ul>
    )
  }

  if (editable || recipe.editing) {
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
