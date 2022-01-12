import { DeleteOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useContext } from 'react';
import { Context } from '../context';
import { useNavigate } from 'react-router-dom';
import { deleteRecipe } from '../utils';
import { ActionButton } from '../StyledComponents';
import { BoxId, RecipeId } from '../types';


interface DeleteProps {
  recipeId: RecipeId
  boxId: BoxId
}

function DeleteButton(props: DeleteProps) {
  const { state } = useContext(Context)
  const { writeable } = state;
  const navigate = useNavigate()

  const { recipeId, boxId } = props;

  async function del() {
    deleteRecipe(state, boxId, recipeId)
    navigate(`/boxes/${boxId}`)
  }

  if (writeable) {
    return (
      <Popconfirm
        title="Are you sure you want to delete this recipe?"
        onConfirm={del}
        okText="Yes"
        cancelText="No"
      >
        <ActionButton title="Delete this recipe" icon={<DeleteOutlined />} disabled={recipeId === undefined} >Delete</ActionButton>
      </Popconfirm>
    )
  } else {
    return null
  }
}

export default DeleteButton;