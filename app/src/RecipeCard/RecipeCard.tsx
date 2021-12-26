import { Recipe } from 'schema-dts';
import { RecipeContext } from './context';
import recipeReducer from './reducer';
import SaveButton from './SaveRecipe';
import InstructionList from './InstructionList';
import IngredientList from './IngredientList';
import RecipeName from './RecipeName';
import RecipeDescription from './RecipeDescription';
import Image from './Image';
import styled from 'styled-components';
import { useReducer } from 'react';


interface RecipeProps {
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
  // TODO: don't pass a whole recipe, just pass boxId + recipeId and get the data from context.
  const { recipe } = props;
  const [state, dispatch] = useReducer(recipeReducer, {recipe: recipe, changed: false});


  return (
    <RecipeContext.Provider value={{ state, dispatch }}>
      <Card>
        <Image />
        <RecipeName /> <SaveButton />
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