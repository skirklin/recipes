import { Input } from "antd";
import _ from "lodash";
import { RowType } from "./RecipeTable";

interface FilterboxProps {
  setFilteredRows: (rows: RowType[]) => void,
  data: RowType[]
}

function filterFunc(value: RowType, str: string): boolean {
  let recipe = value.recipe;
  let re = new RegExp(str.toLowerCase())
  if (recipe.name && recipe.name!.toString().toLowerCase().match(re) !== null) {
    return true
  }

  let matches = Array.prototype.filter.call(recipe.recipeIngredient, ri => ri.toString().toLowerCase().match(re))
  if (matches.length > 0) {
    return true
  }

  matches = Array.prototype.filter.call(recipe.recipeInstructions, ri => (ri.text && ri.text!.toString().toLowerCase().match(re)))
  if (matches.length > 0) {
    return true
  }

  return false
}


function Filterbox(props: FilterboxProps) {
  const { data, setFilteredRows } = props;
  function filterRecipes(e: any) {
    setFilteredRows(_.filter(data, (row) => filterFunc(row, e.target.value)))
  }
  return <Input placeholder='Filter recipes' onChange={filterRecipes} style={{ width: "300px" }} />
}

export default Filterbox