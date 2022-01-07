import React, { useContext, useState } from 'react';
import { RecipeContext } from './context';
import styled from 'styled-components';
import { LinkOutlined } from '@ant-design/icons';
import { Context } from '../context';
import { getAuth } from 'firebase/auth';
import { Title } from '../StyledComponents';

const EditableTitle = styled.input`
  font-size: 2em;
  font-weight: bold;
  font-family: sans-serif;
  display: inline;
  padding: 5px   padding: 20px 0px 0px 20px;
  outline: none;
`

function RecipeName() {
  const [editable, setEditablePrimitive] = useState(false);
  const { state, dispatch } = useContext(RecipeContext);
  const rbState = useContext(Context).state;
  const recipe = state.recipe
  if (recipe === undefined)  { return null }

  const setEditable = (value: boolean) => {
    let user = getAuth().currentUser
    if (rbState.writeable && user && recipe.owners.includes(user.uid)  ) {
      setEditablePrimitive(value)
    }
  }

  const rd = recipe.data
  let name = rd.name!.toString()
  let box = rbState.boxes.get(state.boxId!);
  let boxName = box === undefined ? "" : box.data.name
  let handleChange = (e: any) => {
    if (name !== e.target.value) {
      dispatch({ type: "SET_NAME", payload: e.target.value });
    }
    setEditable(false);
  }
  let link = null;
  if (rd.url) {
    link = <a href={rd.url.toString()}><LinkOutlined /></a>
  }
  if (editable) {
    return (
      <EditableTitle type="text"
        size={name.length}
        defaultValue={name}
        autoFocus
        onKeyUp={(e) => { if (e.code === "Escape" || e.code === "Enter") { handleChange(e) } }}
        onBlur={handleChange} />
    )
  } else {
    return (
      <Title onDoubleClick={() => setEditable(true)} style={{width: '90%'}}>
        {name} <span style={{fontStyle: 'italic', marginLeft: "3px"}}>({boxName})</span>
        {link}
      </Title>
    )
  }
}

export default RecipeName;