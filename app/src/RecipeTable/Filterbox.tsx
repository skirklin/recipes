import { Input } from "antd";
import _ from "lodash";
import { Recipe } from "schema-dts";
import { RowType } from "./RecipeTable";

interface FilterboxProps {
  setFilteredRows: (rows: RowType[]) => void,
  data: RowType[]
}

const getName = (name: Recipe["name"]) => name === undefined ? "" : name.toString()


function filterFunc(value: RowType, str: string): boolean {
  const recipe = value.recipe;
  const re = new RegExp(str.toLowerCase())
  if (getName(recipe.data.name).toLowerCase().match(re) !== null) {
    return true
  }

  let matches = Array.prototype.filter.call(recipe.data.recipeIngredient, ri => ri.toString().toLowerCase().match(re))
  if (matches.length > 0) {
    return true
  }

  matches = Array.prototype.filter.call(recipe.data.recipeInstructions, ri => (ri.text !== undefined && ri.text.toString().toLowerCase().match(re)))
  if (matches.length > 0) {
    return true
  }

  return false
}


function Filterbox(props: FilterboxProps) {
  const { data, setFilteredRows } = props;
  function filterRecipes(e: { target: { value: string; }; }) {
    setFilteredRows(_.filter(data, (row) => filterFunc(row, e.target.value)))
  }
  return <Input placeholder='Filter recipes' onChange={filterRecipes} style={{ width: "300px" }} />
}

export default Filterbox