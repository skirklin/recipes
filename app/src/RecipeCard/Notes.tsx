import { useContext, useState } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import { commentToStr, strToComment, getRecipeFromState, getAppUserFromState } from '../utils';
import { Context } from '../context';
import { RecipeCardProps } from './RecipeCard';
import styled from 'styled-components';

const NotesArea = styled.div`
  margin: 10px;
  padding: 10px;
  display: block;
`


function Notes(props: RecipeCardProps) {
  const [editable, setEditablePrimitive] = useState(false);
  const { recipeId, boxId } = props;
  const { state, dispatch } = useContext(Context);
  const recipe = getRecipeFromState(state, boxId, recipeId)
  if (recipe === undefined) {
    return null
  }

  if (recipe === undefined) { return null }
  const setEditable = (value: boolean) => {
    const user = getAppUserFromState(state)
    if (state.writeable && user && recipe.owners.includes(user.id)) {
      setEditablePrimitive(value)
    }
  }

  const rd = recipe.changed ? recipe.changed : recipe.data
  const comment = commentToStr(rd.comment)

  const handleChange = (value: string) => {
    if (comment !== value) {
      dispatch({ type: "SET_COMMENT", recipeId, boxId, payload: strToComment(value) });
    }
    setEditable(false)
  }

  if (editable) {
    return (
      <NotesArea>
        <TextareaAutosize
          autoFocus
          defaultValue={comment}
          placeholder='Add a note?'
          onKeyUp={(e) => { if (e.code === "Escape") { handleChange(e.currentTarget.value) } }}
          onBlur={e => handleChange(e.target.value)}
        />
      </NotesArea>
    )
  } else {
    return (
      <NotesArea>
        <div onDoubleClick={() => setEditable(true)}>
          {comment || "Add a note?"}
        </div>
      </NotesArea>
    )
  }
}

export default Notes;