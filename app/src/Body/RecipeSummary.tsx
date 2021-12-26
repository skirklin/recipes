import { useContext } from 'react';
import styled from 'styled-components';
import { RecipeBoxContext } from '../context';
import { RecipePointer } from '../types';
import { ViewerContext } from './context';
import { getRecipeTabKey } from './Tabs/RecipeTab';

interface RecipeProps {
  recipePointer: RecipePointer
}

const RecipeItem = styled.li`
  list-style-type: none;
  cursor: pointer; 
`


const Container = styled.div`
  margin: 2px;
  padding: 2px;
`

const RecipeName = styled.p`
  font-weight: bold;
  text-decoration: underline;
  margin-bottom: 2px;
`
const RecipeDescription = styled.p`
  font-style: italic;
  margin: 0px 5px;

`

function RecipeSummary(props: RecipeProps) {
  const { state } = useContext(RecipeBoxContext)
  const { dispatch } = useContext(ViewerContext)
  const { boxId, recipeId } = props.recipePointer;
  const recipe = state.boxes.get(boxId)?.recipes.get(recipeId)!

  const handleClick = () => {
    dispatch({ type: "APPEND_TAB", payload: props.recipePointer })
  }
  return (
    <RecipeItem onClick={handleClick} key={getRecipeTabKey(props.recipePointer)}>
      <Container>
        <RecipeName>
          {recipe.name}

        </RecipeName>
        <RecipeDescription>
          {recipe.description}
        </RecipeDescription>
    </Container >
    </RecipeItem>
  );
}

export default RecipeSummary;
