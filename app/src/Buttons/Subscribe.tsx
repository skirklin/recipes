import { useContext } from 'react';
import { Context } from '../context';
import { getBoxFromState, subscribeToBox, unsubscribeFromBox } from '../utils';
import { ActionButton } from '../StyledComponents';
import { BoxId } from '../types';

interface DeleteProps {
  boxId: BoxId
}

function SubscribeButton(props: DeleteProps) {
  const { state } = useContext(Context)
  const { writeable } = state;

  const { boxId } = props;
  const box = getBoxFromState(state, boxId)

  console.log({box, state})

  if (box === undefined || state.user === null) {
    return null
  }

  if (!state.user.boxes.includes(boxId)) {
    return <ActionButton
      onClick={() => subscribeToBox(state.user, boxId)}
      disabled={!writeable}
    >Add to collection</ActionButton>
  } else {
    return <ActionButton
      onClick={() => unsubscribeFromBox(state.user, boxId)}
      disabled={!writeable}
    >Remove from collection</ActionButton>
  }
}

export default SubscribeButton;