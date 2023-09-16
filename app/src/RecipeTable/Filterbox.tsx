import { Input } from "antd";
import _ from "lodash";
import { Recipe } from "schema-dts";
import { RowType } from "./RecipeTable";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Document } = require("flexsearch");

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

  const index = new Document({
    document: {
      id: "name",
      index: [
        "name",
        "instructions",
        "ingredients",
      ]
    }
  })
  data.forEach((row, idx) => {
    index.add(idx,
      {
        name: row.recipe.data.name,
        ingredients: row.recipe.data.recipeIngredient,
        instructions: row.recipe.data.recipeInstructions,
      }
    )
  }
  )
  function filterRecipes(e: { target: { value: string; }; }) {
    console.log("searched for:")
    console.log(e.target.value)
    if (e.target.value === "") {
      setFilteredRows(data)
    } else {
      const result = index.search(e.target.value)
      const idxs: number[] = [];
      const rows: RowType[] = [];
      result.forEach((obj: { result: any[] }) => obj.result.forEach(elt => {
        if (!idxs.includes(elt)) {
          idxs.push(elt);
          rows.push(data[elt])
        }
      }))
      console.log("found!")
      console.log(idxs)
      if (rows.length > 0) setFilteredRows(rows)
    }
  }
  return <Input placeholder='Filter recipes' onChange={filterRecipes} style={{ width: "300px" }} />
}

export default Filterbox