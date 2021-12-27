import { useContext, useEffect, useReducer } from 'react';
import styled from 'styled-components';

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
import { RecipeBoxContext } from '../context';
import { getRecipe } from '../utils';
import _ from 'lodash';


interface RecipeProps {
  recipePtr: RecipePointer
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
  let recipe = _.cloneDeep(getRecipe(useContext(RecipeBoxContext).state, props.recipePtr)!)
  const [state, dispatch] = useReducer<React.Reducer<RecipeStateType, RecipeActionType>>(recipeReducer, {
    recipePtr: props.recipePtr,
    recipe: recipe,
    changed: false
  });

  useEffect(
    () => {console.log("recipe card saw recipe change")},
    [recipe]
  )

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