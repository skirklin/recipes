import { useReducer } from 'react';
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
import _ from 'lodash';
import { RecipeType } from '../types';

interface RecipeProps {
  recipe: RecipeType
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
  let { recipeId, boxId, recipe } = props;
  const original = _.cloneDeep(recipe)
  const [state, dispatch] = useReducer<React.Reducer<RecipeStateType, RecipeActionType>>(recipeReducer, {
    recipe, original, recipeId, boxId,
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