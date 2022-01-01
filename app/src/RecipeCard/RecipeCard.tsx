import { useContext, useReducer } from 'react';
import styled from 'styled-components';

import { recipeReducer, RecipeActionType, RecipeContext, RecipeStateType } from './context';
import SaveButton from './SaveRecipe';
import DownloadButton from './DownloadRecipe';
import ForkButton from './ForkRecipe';
import DeleteButton from './DeleteRecipe';
import ClearButton from './ClearChanges';
import InstructionList from './InstructionList';
import IngredientList from './IngredientList';
import RecipeName from './RecipeName';
import RecipeDescription from './RecipeDescription';
import Image from './Image';
import { Context } from '../context';
import { getRecipe } from '../utils';
import _ from 'lodash';
import { Recipe } from 'schema-dts';


interface RecipeProps {
  recipe?: Recipe
  recipeId?: string
  boxId: string
}

const Card = styled.div`
  margin: 15px;
  font-family: sans-serif;
  outline: solid;
  border-radius: 5px; /* 5px rounded corners */
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
`

const RecipeBody = styled.div`
  margin: 5px
`

const IndexCardLine = styled.hr`
  background-color: var(--cinnabar);
  border-width: 0px;
  height: 1px;
`

function RecipeCard(props: RecipeProps) {
  const ctx = useContext(Context)
  let { recipeId, boxId, recipe } = props;
  recipe = recipe || _.cloneDeep(getRecipe(ctx.state, recipeId, boxId)!)
  const [state, dispatch] = useReducer<React.Reducer<RecipeStateType, RecipeActionType>>(recipeReducer, {
    recipe, recipeId, boxId,
    changed: false
  });

  return (
    <RecipeContext.Provider value={{ state, dispatch }}>
      <Card>
        <div style={{padding: "2px"}}>
          <RecipeName />
          <DeleteButton />
          <DownloadButton />
          <ForkButton />
        </div>
        <IndexCardLine />
        <div>
          <SaveButton />
          <ClearButton />
        </div>
        <Image />
        <RecipeDescription />
        <RecipeBody>
          <IngredientList />
          <InstructionList />
        </RecipeBody>
      </Card>
    </RecipeContext.Provider>
  );
}

export default RecipeCard;