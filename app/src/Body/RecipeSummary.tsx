import { useContext } from 'react';
import styled from 'styled-components';
import { Context } from '../context';
import { RecipeTabType } from '../types';
import { getRecipe } from '../utils';
import { getRecipeTabKey } from './Tabs/RecipeTab';


const RecipeItem = styled.li`
  list-style-type: none;
  cursor: pointer; 
`


const Container = styled.div`
  margin: 2px;
  padding: 2px;
`

const RecipeName = styled.div`
  display: inline;
  font-weight: bold;
  text-decoration: underline;
  margin-bottom: 2px;
`

const BoxName = styled.div`
  display: inline;
  text-decoration: underline;
  margin-bottom: 2px;
  margin-left: 5px;
`

const RecipeDescription = styled.p`
  font-style: italic;
  margin: 0px 5px;

`

function RecipeSummary(props: RecipeTabType) {
  const missing = <div>Recipe cannot be found</div>
  const { state, dispatch } = useContext(Context)
  const box = state.boxes.get(props.boxId!) || {name: 'Missing box'}
  const recipe = props.recipe || getRecipe(state, props);
  if (recipe === undefined) {
    return missing
  }

  const goToBox = () => {
    dispatch({ type: "APPEND_TAB", payload: {boxId: props.boxId} })
  }

  const goToRecipe = () => {
    dispatch({ type: "APPEND_TAB", payload: {...props, recipe} })
  }
  return (
    <RecipeItem key={getRecipeTabKey(props)}>
      <Container>
        <div>
          <RecipeName onClick={goToRecipe} >{recipe.name}</RecipeName>
          <BoxName onClick={goToBox}>({box.name})</BoxName>
        </div>
        <RecipeDescription>
          {recipe.description}
        </RecipeDescription>
      </Container >
    </RecipeItem>
  );
}

export default RecipeSummary;
