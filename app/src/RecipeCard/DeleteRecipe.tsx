import { DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import { useContext } from 'react';
import styled from 'styled-components';
import { RecipeContext } from './context';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../App';
import { Context } from '../context';
import { getKey } from '../Body/Tabs/Tab';

const StyledButton = styled(Button)`
  display: inline;
  float: right;
`

function DeleteButton() {
  const { state } = useContext(RecipeContext);
  const rbCtx = useContext(Context)
  const { dispatch } = rbCtx;
  const { writeable } = rbCtx.state;

  let { recipeId, boxId, recipe } = state;

  async function del() {
    dispatch({ type: "REMOVE_TAB", payload: getKey({ recipeId, boxId, recipe }) })
    await deleteDoc(doc(db, "boxes", boxId, "recipes", recipeId!))
  }

  if (writeable) {
    return (
      <Popconfirm
        title="Are you sure to delete this recipe?"
        onConfirm={del}
        okText="Yes"
        cancelText="No"
      >
        <StyledButton icon={<DeleteOutlined />} disabled={recipeId === undefined} />
      </Popconfirm>
    )
  } else {
    return null
  }
}

export default DeleteButton;