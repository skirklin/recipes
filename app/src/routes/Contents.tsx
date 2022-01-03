import { useContext } from 'react';

import { RecipeTable, RowType } from '../RecipeTable/RecipeTable'
import { Context } from '../context';
import './Contents.css'

function Contents() {
  const { state } = useContext(Context)
  const { writeable } = state;
  
  let data: RowType[] = []
  for (let [boxId, box] of state.boxes.entries()) {
    for (let [recipeId, recipe] of box.data.recipes.entries()) {
      data.push({ boxName: box.data.name, recipeId, boxId, recipe: recipe.data, key: `recipeId=${recipeId}_boxId=${boxId}` })
    }
  }

  return (
    <div>
      <RecipeTable recipes={data} writeable={writeable}/>
    </div>
  )
}


export default Contents