import { useReducer } from 'react';
import styled from 'styled-components';
import { Recipe } from 'schema-dts';
import _ from 'lodash';

import { RecipeActionType, RecipeContext, RecipeStateType } from './context';
import recipeReducer from './reducer';
import SaveButton from './SaveRecipe';
import DownloadButton from './DownloadRecipe';
import ClearButton from './ClearChanges';
import InstructionList from './InstructionList';
import IngredientList from './IngredientList';
import RecipeName from './RecipeName';
import RecipeDescription from './RecipeDescription';
import Image from './Image';
import { RecipePointer } from '../types';


interface RecipeProps {
  recipePtr: RecipePointer
  recipe: Recipe
}



const Card = styled.div`
  margin: 15px;
  font-family: sans-serif;
  outline: solid;
  padding: 5px 15px;
  border-radius: 5px; /* 5px rounded corners */
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
`

const RecipeBody = styled.div`
  margin: 5px
`

function RecipeCard(props: RecipeProps) {
  const [state, dispatch] = useReducer<React.Reducer<RecipeStateType, RecipeActionType>>(recipeReducer, {
    recipePtr: props.recipePtr,
    recipe: props.recipe,
    original: _.cloneDeep(props.recipe),
    changed: false
  });

  return (
    <RecipeContext.Provider value={{ state, dispatch }}>
      <Card>
        <Image />
        <div>
          <RecipeName />
          <DownloadButton />
        </div>
        <div>
          <SaveButton />
          <ClearButton />
        </div>
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