import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../context";

import { subscribeToBox, unsubscribeFromBox, getBox } from "../utils";
import { RecipeTable, RowType } from "../RecipeTable/RecipeTable"
import { getAuth } from "firebase/auth";
import { ActionButton, Title } from "../StyledComponents";
import { BoxEntry } from "../storage";

interface BoxRecipesProps {
  boxId: string,
  box: BoxEntry,
  writeable: boolean
}

function BoxRecipes(props: BoxRecipesProps) {
  const { box, boxId, writeable } = props;

  const recipes = box.recipes;
  const data: RowType[] = []
  for (const [recipeId, recipe] of recipes.entries()) {
    data.push({ boxName: box.data.name, recipeId, boxId, recipe, key: `recipeId=${recipeId}_boxId=${boxId}` })
  }
  return <RecipeTable recipes={data} writeable={writeable} boxId={boxId} />
}

function Box() {
  const [box, setBox] = useState<BoxEntry>()
  const { state } = useContext(Context)
  const { writeable } = state
  const params = useParams();
  if (params.boxId === undefined) { throw new Error("Must have a boxId.") }
  const boxId = params.boxId

  useEffect(() => {
    (async () => {
      const box = await getBox(state, boxId)
      if (box !== undefined) {
        setBox(box)
      }
    })()
  }, [state, boxId]
  )

  let toggleSub
  if (!state.boxes.has(boxId)) {
    toggleSub = <ActionButton
      style={{ marginLeft: "5px" }}
      onClick={() => subscribeToBox(getAuth().currentUser, boxId)}
      disabled={!writeable}
    >Add</ActionButton>
  } else {
    toggleSub = <ActionButton
      style={{ marginLeft: "5px" }}
      onClick={() => unsubscribeFromBox(getAuth().currentUser, boxId)}
      disabled={!writeable}
    >Remove</ActionButton>
  }

  if (box === undefined) {
    return <div>Unable to find boxId={boxId}</div>
  }

  return (
    <div>
      <Title>{box.data.name}</Title>
      {toggleSub}
      <BoxRecipes box={box} boxId={boxId} writeable={writeable} />
    </div>
  )
}

export default Box