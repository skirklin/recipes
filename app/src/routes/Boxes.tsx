import { useContext } from "react"
import { Context } from "../context"
import { RowType, BoxTable } from '../BoxTable/BoxTable'
import { Title } from "../StyledComponents";
import { getUserFromState } from "../state";
import { UserEntry } from "../storage";
import { Visibility } from "../types";


function Boxes() {
  const { state } = useContext(Context)
  const { boxes } = state;

  const rows: RowType[] = Array.from(boxes).map(([key, value]) => ({
    name: value.data.name,
    owners: value.owners.map(uid => getUserFromState(state, uid) || new UserEntry("Anonymous", Visibility.private, [], new Date(), new Date(), uid)),
    numRecipes: value.recipes.size,
    boxId: key,
    key: key,
  } as RowType))

  return (
    <div>
      <Title>Saved Boxes</Title>
      <BoxTable rows={rows} />
    </div>
  )
}

export default Boxes