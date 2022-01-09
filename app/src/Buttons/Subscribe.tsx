import { useContext } from 'react';
import { Context } from '../context';
import { getBoxFromState, subscribeToBox, unsubscribeFromBox } from '../utils';
import { ActionButton } from '../StyledComponents';
import { BoxId } from '../types';
import { getAuth } from 'firebase/auth';


interface DeleteProps {
  boxId: BoxId
}

function SubscribeButton(props: DeleteProps) {
  const { state } = useContext(Context)
  const { writeable } = state;

  const { boxId } = props;
  const box = getBoxFromState(state, boxId)
  const user = getAuth().currentUser

  if (box === undefined || user === null) {
    return null
  }

  if (!state.boxes.has(boxId)) {
    return <ActionButton
      style={{ marginLeft: "5px" }}
      onClick={() => subscribeToBox(getAuth().currentUser, boxId)}
      disabled={!writeable}
    >Add to collection</ActionButton>
  } else {
    return <ActionButton
      style={{ marginLeft: "5px" }}
      onClick={() => unsubscribeFromBox(getAuth().currentUser, boxId)}
      disabled={!writeable}
    >Remove from collection</ActionButton>
  }
}

export default SubscribeButton;