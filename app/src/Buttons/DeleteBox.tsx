import { DeleteOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useContext } from 'react';
import { Context } from '../context';
import { useNavigate } from 'react-router-dom';
import { deleteBox, getBoxFromState } from '../utils';
import { ActionButton } from '../StyledComponents';
import { BoxId } from '../types';
import { getAuth } from 'firebase/auth';


interface DeleteProps {
  boxId: BoxId
}

function DeleteButton(props: DeleteProps) {
  const { state } = useContext(Context)
  const { writeable } = state;
  const navigate = useNavigate()

  const { boxId } = props;
  const box = getBoxFromState(state, boxId)
  const user = getAuth().currentUser

  if (box === undefined || user === null || !box.owners.includes(user.uid) ) {
    return null
  }

  async function del() {
    deleteBox(state, boxId)
    navigate(`/`)
  }

  if (writeable) {
    return (
      <Popconfirm
        title="Are you sure you want to delete this box?"
        onConfirm={del}
        okText="Yes"
        cancelText="No"
      >
        <ActionButton title="Delete this box?" icon={<DeleteOutlined />} >Delete</ActionButton>
      </Popconfirm>
    )
  } else {
    return null
  }
}

export default DeleteButton;