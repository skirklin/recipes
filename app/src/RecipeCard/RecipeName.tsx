import React, { useContext, useState } from 'react';
import { RecipeContext } from './context';
import styled from 'styled-components';
import { LinkOutlined } from '@ant-design/icons';


const Title = styled.h1`
  font-size: 2em;
  outline: none;
  display: inline-flex;
  `

const EditableTitle = styled.input`
  font-size: 2em;
  font-weight: bold;
  font-family: sans-serif;
  display: inline-flex;
  margin: 15px;
  padding: 5px 15px;
  outline: none;
`

function RecipeName() {
  const { state, dispatch } = useContext(RecipeContext);
  const [editable, setEditable] = useState(false);

  let name = state.recipe.name!.toString()
  let handleChange = (e: any) => { dispatch({ type: "SET_NAME", payload: e.target.value }); setEditable(false) }
  let link = null;
  if (state.recipe.url) {
    link = <a href={state.recipe.url.toString()}><LinkOutlined /></a>
  }
  if (editable) {
    return (
      <EditableTitle type="text"
        size={name.length}
        defaultValue={name}
        autoFocus
        onKeyUp={(e) => { if (e.code === "Escape") { handleChange(e) } }}
        onBlur={handleChange} />
    )
  } else {
    return (
      <Title onDoubleClick={() => setEditable(true)}>
        {name}
        {link}
      </Title>
    )
  }
}

export default RecipeName;