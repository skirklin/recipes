import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../context";

import { getBox } from "../firestore";
import { getBoxFromState } from "../state";
import { BoxId } from "../types";
import BoxView from '../BoxView/BoxView'

interface BoxProps {
  boxId: BoxId
}

function Box(props: BoxProps) {
  const { boxId } = props;
  const { state, dispatch } = useContext(Context)

  useEffect(() => {
    (async () => {
      /* if the box is not present in the app cache, fetch it and add it to 
      state. This will trigger a re-render, but only once 
      since subsequent changes shouldn't trigger a new fetch. */
      let box = getBoxFromState(state, boxId)
      if (box === undefined) {
        box = await getBox(state, boxId)
        if (box !== undefined) {
          dispatch({ type: "ADD_BOX", payload: box, boxId })
        }
      }
    })()
  }, [state, boxId, dispatch]
  )
  const box = getBoxFromState(state, boxId)

  if (box === undefined) {
    return <div>Unable to find box.</div>
  }
  return (
    <>
      <BoxView {...props} />
    </>
  )

}

export default function RoutedBox() {
  const params = useParams();
  if (params.boxId === undefined) { throw new Error("Must have a boxId.") }

  return <Box boxId={params.boxId} />
}