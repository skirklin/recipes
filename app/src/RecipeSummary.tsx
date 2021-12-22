import { Recipe } from 'schema-dts';
import styled from 'styled-components';

interface RecipeProps {
    recipe: Recipe
}

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
    const { recipe } = props;
    return (
        <Container>
            <RecipeName>
                {recipe.name}
            </RecipeName>
            <RecipeDescription>
                {recipe.description}
            </RecipeDescription>
        </Container>
    );
}

export default RecipeSummary;
