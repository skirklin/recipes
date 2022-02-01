import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { LinkOutlined } from '@ant-design/icons';
import { Context } from '../context';
import { Title } from '../StyledComponents';
import { getRecipeFromState } from '../utils';
import { getEditableSetter, RecipeCardProps } from './RecipeCard';
import { Input } from 'antd';

const EditableTitle = styled(Input)`
  font-size: 2em;
  font-weight: bold;
  font-family: sans-serif;
  display: inline;
  outline: none;
  padding-left: 5px;
  margin-bottom: 0px;
  height: fit-content;
  width: fit-content;
`

function RecipeName(props: RecipeCardProps) {
  const { recipeId, boxId } = props;
  const { state, dispatch } = useContext(Context);
  const recipe = getRecipeFromState(state, boxId, recipeId)
  const [editable, setEditablePrimitive] = useState(false);

  const setEditable = getEditableSetter(state, recipeId, boxId, setEditablePrimitive)


  const rd = recipe ? (recipe.changed ? recipe.changed : recipe.data) : { name: "", url: "" }
  const name = rd.name as string
  const [value, setValue] = useState<string>(name);
  if (recipe === undefined) { return null }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e !== undefined) {
      setValue(e.target.value);
    }
  }

  function confirmChange() {
    if (name !== value) {
      dispatch({ type: "SET_RECIPE_NAME", recipeId, boxId, payload: value });
    }
    setEditable(false);
  }
  let link = null;
  if (rd.url) {
    link = <a href={rd.url.toString()} target="_blank" rel="noreferrer"><LinkOutlined /></a>
  }
  if (editable || recipe.editing) {
    return (
      <EditableTitle type="text"
        defaultValue={name}
        autoFocus
        onChange={(e) => handleChange(e)}
        onKeyUp={(e) => { if (e.code === "Escape" || e.code === "Enter") { confirmChange() } }}
        onBlur={() => confirmChange()}
      />
    )
  } else {
    return (
      <Title onDoubleClick={() => setEditable(true)}>
        {name} {link}
      </Title>
    )
  }
}

export default RecipeName;