import { Button, Space } from "antd";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../context";

import { subscribeToBox, unsubscribeFromBox, uploadRecipes, createNewRecipe } from "../utils";
import { RecipeTable, RowType } from "../RecipeTable/RecipeTable"
import { getAuth } from "firebase/auth";
import { Recipe } from "schema-dts";

interface BoxRecipesProps {
  boxId: string
  writeable: boolean
}
function BoxRecipes(props: BoxRecipesProps) {
  const { state } = useContext(Context)
  const { boxId, writeable } = props;

  const box = state.boxes.get(boxId)
  let data: RowType[] = []
  if (box !== undefined) {
    for (let [recipeId, recipe] of box.recipes.entries()) {
      data.push({ boxName: box.name, recipeId, boxId, recipe, key: `recipeId=${recipeId}_boxId=${boxId}` })
    }
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
  const { state, dispatch } = useContext(Context)
  const { writeable } = state
  const navigate = useNavigate()
  const params = useParams();
  if (params.boxId === undefined) { throw new Error("Must have a boxId.") }
  const boxId = params.boxId
  const box = state.boxes.get(boxId)

  let toggleSub
  if (!state.boxes.has(boxId)) {
    toggleSub = <Button onClick={() => subscribeToBox(getAuth().currentUser, boxId)} disabled={!writeable}>Add to collection.</Button>
  } else {
    toggleSub = <Button onClick={() => unsubscribeFromBox(getAuth().currentUser, boxId)} disabled={!writeable}>Remove from collection</Button>
  }

  const addNewRecipe = () => {
    let recipe = createNewRecipe();
    let recipeId = `uniqueId=${getUniqueId(recipe)}`
    dispatch({ type: "ADD_RECIPE", payload: recipe, boxId, recipeId })
    navigate(`/boxes/${boxId}/recipes/${recipeId}`)
  }
  console.log(box)

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

  return (
    <div>
      {modificationOptions}
      <div>owners are: {box !== undefined ? box.owners.toString() : ""}</div>
      <BoxRecipes boxId={boxId} writeable={writeable} />
    </div>
  )
}

export default Box