import { DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import { useContext } from 'react';
import styled from 'styled-components';
import { Context } from '../context';
import { useNavigate } from 'react-router-dom';
import { deleteRecipe } from '../utils';

const StyledButton = styled(Button)`
  display: inline;
  float: right;
`

interface DeleteProps {
  recipeId: string
  boxId: string
}

function DeleteButton(props: DeleteProps) {
  const { state } = useContext(Context)
  const { writeable } = state;
  const navigate = useNavigate()

  let { recipeId, boxId } = props;

  async function del() {
    deleteRecipe(state, boxId, recipeId)
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