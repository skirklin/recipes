import { Button, Space } from "antd";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../context";

import { subscribeToBox, unsubscribeFromBox, getBox } from "../utils";
import { RecipeTable, RowType } from "../RecipeTable/RecipeTable"
import { getAuth } from "firebase/auth";
import { BoxType } from "../types";

interface BoxRecipesProps {
  boxId: string,
  box: BoxType,
  writeable: boolean
}
function BoxRecipes(props: BoxRecipesProps) {
  const { box, boxId, writeable } = props;

  const recipes = box.data.recipes;
  let data: RowType[] = []
  for (let [recipeId, recipe] of recipes.entries()) {
    data.push({ boxName: box.data.name, recipeId, boxId: boxId, recipe: recipe.data, key: `recipeId=${recipeId}_boxId=${boxId}` })
  }
  return <RecipeTable recipes={data} writeable={writeable} boxId={boxId} />
}

function Box() {
  const [box, setBox] = useState<BoxType>()
  const { state } = useContext(Context)
  const { writeable } = state
  const params = useParams();
  if (params.boxId === undefined) { throw new Error("Must have a boxId.") }
  const boxId = params.boxId

  useEffect(() => {
    (async () => {
      let box = await getBox(state, boxId)
      if (box !== undefined) {
        setBox(box)
      }
    })()
  }, [state, boxId]
  )

  let toggleSub
  if (!state.boxes.has(boxId)) {
    toggleSub = <Button onClick={() => subscribeToBox(getAuth().currentUser, boxId)} disabled={!writeable}>Add to collection.</Button>
  } else {
    toggleSub = <Button onClick={() => unsubscribeFromBox(getAuth().currentUser, boxId)} disabled={!writeable}>Remove from collection</Button>
  }

  let modificationOptions;
  if (writeable) {
    modificationOptions = <div style={{ display: "inline-block" }}>
      <Space>
        {toggleSub}
      </Space>
    </div>
  } else {
    modificationOptions = <></>
  }

  if (box === undefined) {
    return <div>Unable to find boxId={boxId}</div>
  }

  return (
    <div>
      {modificationOptions}
      <BoxRecipes box={box} boxId={boxId} writeable={writeable} />
    </div>
  )
}

export default Box