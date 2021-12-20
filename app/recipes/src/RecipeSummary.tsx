import { Recipe } from 'schema-dts';
import styled from 'styled-components';

interface RecipeProps {
    recipe: Recipe
}

const Container = styled.div`
  margin: 2px;
  padding: 2px;
`

function RecipeSummary(props: RecipeProps) {
    const { recipe } = props;
    return (
        <Container>
            {recipe.name}
        </Container>
    );
}

export default RecipeSummary;
