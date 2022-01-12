import { DeleteOutlined } from '@ant-design/icons';
import { Menu, Popconfirm } from 'antd';
import { useContext } from 'react';
import { Context } from '../context';
import { useNavigate } from 'react-router-dom';
import { deleteBox, getBoxFromState } from '../utils';
import { ActionButton } from '../StyledComponents';
import { BoxId } from '../types';


interface DeleteProps {
  boxId: BoxId
  element: "button" | "menu"
}

function DeleteButton(props: DeleteProps) {
  const { state } = useContext(Context)
  const { writeable, user } = state;
  const navigate = useNavigate()

  const { boxId, element } = props;
  const box = getBoxFromState(state, boxId)

  if (box === undefined || user === null || !box.owners.includes(user.id)) {
    return null
  }

  async function del() {
    deleteBox(state, boxId)
    navigate(`/`)
  }

  let elt;
  switch (element) {
    case "button":
      elt = <ActionButton title="Delete this box?" icon={<DeleteOutlined />} >Delete</ActionButton>
      break;
    case "menu":
      elt = <Menu.Item title="Delete this box?" icon={<DeleteOutlined />} >Delete</Menu.Item>
      break;
  }

  if (writeable) {
    return (
      <Popconfirm
        title="Are you sure you want to delete this box?"
        onConfirm={del}
        okText="Yes"
        cancelText="No"
      >{elt}</Popconfirm>
    )
  } else {
    return null
  }
}

export default DeleteButton;