import { useContext, useState } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import { commentToStr, strToComment, getRecipeFromState } from '../utils';
import { Context } from '../context';
import { getAuth } from 'firebase/auth';
import { RecipeCardProps } from './RecipeCard';
import styled from 'styled-components';

const CommentBlock = styled.div`
  margin: 10px;
  padding: 10px;
  background-color: var(--mint-cream);
  outline: solid;
  display: block;
`


function Comment(props: RecipeCardProps) {
  const [editable, setEditablePrimitive] = useState(false);
  const { recipeId, boxId } = props;
  const { state, dispatch } = useContext(Context);
  const recipe = getRecipeFromState(state, boxId, recipeId)
  if (recipe === undefined) {
    return null
  }

  if (recipe === undefined) { return null }
  const setEditable = (value: boolean) => {
    const user = getAuth().currentUser
    if (state.writeable && user && recipe.owners.includes(user.uid)) {
      setEditablePrimitive(value)
    }
  }

  const rd = recipe.changed ? recipe.changed : recipe.data
  const comment = commentToStr(rd.comment)
  console.log({recipe, comment})

  const handleChange = (value: string) => {
    if (comment !== value) {
      dispatch({ type: "SET_COMMENT", recipeId, boxId, payload: strToComment(value) });
    }
    setEditable(false)
  }

  if (editable) {
    return (
      <CommentBlock>
        <TextareaAutosize
          autoFocus
          defaultValue={comment}
          placeholder='Add comment?'
          onKeyUp={(e) => { if (e.code === "Escape") { handleChange(e.currentTarget.value) } }}
          onBlur={e => handleChange(e.target.value)}
        />
      </CommentBlock>
    )
  } else {
    return (
      <CommentBlock>
        <div onDoubleClick={() => setEditable(true)}>
          {comment || "Add comment?"}
        </div>
      </CommentBlock>
    )
  }
}

export default Comment;