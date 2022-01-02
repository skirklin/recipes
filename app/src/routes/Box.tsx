import { Button, Space } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../context";

import { subscribeToBox, unsubscribeFromBox, uploadRecipes, createNewRecipe, getBox } from "../utils";
import { RecipeTable, RowType } from "../RecipeTable/RecipeTable"
import { getAuth } from "firebase/auth";
import { Recipe } from "schema-dts";
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
  return <RecipeTable recipes={data} writeable={writeable} />
}

const objIdMap = new WeakMap();
var objectCount = 0;
function getUniqueId(rcp: Recipe) {
  if (!objIdMap.has(rcp)) objIdMap.set(rcp, ++objectCount);
  return objIdMap.get(rcp);
}

function Box() {
  const [box, setBox] = useState<BoxType>()
  const { state, dispatch } = useContext(Context)
  const { writeable } = state
  const navigate = useNavigate()
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

  const addNewRecipe = () => {
    let recipe = createNewRecipe();
    let recipeId = `uniqueId=${getUniqueId(recipe.data)}`
    dispatch({ type: "ADD_RECIPE", payload: recipe, boxId, recipeId })
    navigate(`/boxes/${boxId}/recipes/${recipeId}`)
  }

  let modificationOptions;
  if (writeable) {
    modificationOptions = <div style={{ display: "inline-block" }}>
      <Space>
        {toggleSub}
        <Button onClick={() => addNewRecipe()} disabled={!writeable}>Create new recipe</Button>
        <Button onClick={() => uploadRecipes(boxId)} disabled={!writeable}>Upload recipes</Button>
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
      <div>owners are: {box.owners.toString()}</div>
      <BoxRecipes box={box} boxId={boxId} writeable={writeable} />
    </div>
  )
}

export default Box