import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../context";

import { getBox, getBoxFromState, setBoxVisiblity } from "../utils";
import { RecipeTable, RowType } from "../RecipeTable/RecipeTable"
import { IndexCardTopLine, RecipeActionGroup, Title } from "../StyledComponents";
import { BoxId, Visibility } from "../types";
import DeleteBox from '../Buttons/DeleteBox';
import SubscribeButton from "../Buttons/Subscribe";
import VisibilityControl from "../Buttons/Visibility";
import { addBoxOwner } from "../backend";

interface BoxProps {
  boxId: BoxId
}

function Box(props: BoxProps) {
  const { boxId } = props;
  const { state, dispatch } = useContext(Context)
  const { writeable, authUser } = state

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

  if (authUser === null) {
    return null
  }

  if (box === undefined) {
    return <div>Unable to find boxId={boxId}</div>
  }
  const recipes = box.recipes;
  const data: RowType[] = []
  for (const [recipeId, recipe] of recipes.entries()) {
    data.push({ boxName: box.data.name, recipeId, boxId, recipe, key: `recipeId=${recipeId}_boxId=${boxId}` })
  }

  function handleVisiblityChange(e: { key: string }) {
    setBoxVisiblity(boxId, e.key as Visibility)
  }

  function handleAddOwner(newOwnerEmail: string) {
    addBoxOwner({boxId, newOwnerEmail})
  }


  return (
    <div>
      <div style={{ display: "flex" }}>
        <Title>{box.data.name}</Title>
        <RecipeActionGroup>
          <SubscribeButton boxId={boxId} />
          <VisibilityControl
            value={box.visibility}
            element="button"
            handleChange={handleVisiblityChange}
            handleAddOwner={handleAddOwner}
            disabled={!(writeable && box.owners.includes(authUser.uid))}
          />
          <DeleteBox boxId={boxId} element="button" />
        </RecipeActionGroup>
      </div>
      <IndexCardTopLine />
      <RecipeTable recipes={data} writeable={writeable && box.owners.includes(authUser.uid)} boxId={boxId} />
    </div>
  )
}

export default function RoutedBox() {
  const params = useParams();
  if (params.boxId === undefined) { throw new Error("Must have a boxId.") }

  return <Box boxId={params.boxId} />
}