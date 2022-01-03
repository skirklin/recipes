import { DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import { useContext } from 'react';
import styled from 'styled-components';
import { RecipeContext } from './context';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../backend';
import { Context } from '../context';
import { useNavigate } from 'react-router-dom';

const StyledButton = styled(Button)`
  display: inline;
  float: right;
`

function DeleteButton() {
  const { state } = useContext(RecipeContext);
  const rbCtx = useContext(Context)
  const navigate = useNavigate()
  const { writeable } = rbCtx.state;

  let { recipeId, boxId } = state;

  async function del() {
    deleteDoc(doc(db, "recipes", recipeId!))
    navigate(`/boxes/${boxId}`)
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