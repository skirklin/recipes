import { useContext } from "react";
import { Context } from "../context";

import { getBoxFromState, setBoxVisiblity } from "../utils";
import { RecipeTable, RowType } from "../RecipeTable/RecipeTable"
import { IndexCardTopLine, RecipeActionGroup } from "../StyledComponents";
import { BoxId, Visibility } from "../types";
import DeleteBox from '../Buttons/DeleteBox';
import SubscribeButton from "../Buttons/Subscribe";
import VisibilityControl from "../Buttons/Visibility";
import Name from './Name';
import { addBoxOwner } from "../backend";
import SaveButton from "./Save";
import ClearButton from "./Clear";

export interface BoxProps {
  boxId: BoxId
}

export default function BoxView(props: BoxProps) {
  const { boxId } = props;
  const { state } = useContext(Context)
  const { writeable, authUser } = state

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
    data.push({ box, recipe, key: `recipeId=${recipeId}_boxId=${boxId}` })
  }

  function handleVisiblityChange(e: { key: string }) {
    setBoxVisiblity(boxId, e.key as Visibility)
  }

  function handleAddOwner(newOwnerEmail: string) {
    addBoxOwner({ boxId, newOwnerEmail })
  }


  return (
    <div>
      <div style={{ display: "flex" }}>
        <Name {...props} />
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
      <div style={{ width: "100%", paddingLeft: "5px" }}>
        <SaveButton {...props} />
        <ClearButton {...props} />
      </div>
      <IndexCardTopLine />
      <RecipeTable recipes={data} writeable={writeable && box.owners.includes(authUser.uid)} boxId={boxId} />
    </div>
  )
}
