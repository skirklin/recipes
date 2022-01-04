import { useContext } from "react"
import { Context } from "../context"
import { RowType, BoxTable } from '../BoxTable/BoxTable'
import styled from "styled-components";
import NewBoxModal from "../Buttons/NewBoxModal";

const TableButtons = styled.div`
  float: right;
`

function Boxes() {
  const { state } = useContext(Context)

  const boxes: RowType[] = Array.from(state.boxes).map(([key, value]) => ({
    name: value.data.name,
    owners: value.owners,
    numRecipes: value.data.recipes.size,
    boxId: key,
    key: key,
  } as RowType))


  return (
    <div>
      <TableButtons>
        <NewBoxModal />
      </TableButtons>
      <BoxTable boxes={boxes} />
    </div>
  )
}

export default Boxes