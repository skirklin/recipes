import { Recipe } from 'schema-dts';
import styled from 'styled-components';

interface RecipeProps {
    recipe: Recipe
}

const Card = styled.div`
  margin: 15px;
  font-family: sans-serif;
  outline: solid;
`

const RecipeBody = styled.div`
  margin: 5px
`

const IngredientList = styled.ul`
  outline: none;
  padding: 5px;
  margin: 0px 0px 15px 25px;
  background-color: lightyellow;
  display: inline-block;
  list-style-position: inside
`

const RecipeStepsList = styled.ol`
  margin: 15px;
  display: inline-block;
`

const RecipeStep = styled.li`
  padding-bottom: 10px
`

const RecipeName = styled.h2`
  padding: 20px;
  margin: 0px;
`

function RecipeCard(props: RecipeProps) {
    const { recipe } = props;

    let title;
    if (recipe.url !== undefined) {
        title = <RecipeName><a href={recipe.url.toString()}>{recipe.name}</a></RecipeName>
    } else {
        title = <RecipeName>{recipe.name}</RecipeName>
    }

    let image;
    if (recipe.image !== undefined) {
        if (recipe.image instanceof String) {
            image = <img src={recipe.image.toString()} alt="original" />
        } else {
            /* @ts-expect-error */
            if (recipe.image.url !== undefined) {
                /* @ts-expect-error */
                image = <img src={recipe.image.url.toString()} alt="original" style={{ width: "30%", padding: "15px", float: "left" }} />
            }
        }
    }

    return (
        <Card>
            {title} {image}
            <RecipeBody>
                <IngredientList>
                    {Array.prototype.map.call(recipe.recipeIngredient, (ri, id) => <li key={id}>{ri}</li>)}
                </IngredientList>
                <RecipeStepsList>
                    {Array.prototype.map.call(recipe.recipeInstructions, (ri, id) => <RecipeStep key={id}>{ri.text}</RecipeStep>)}
                </RecipeStepsList>
            </RecipeBody>
        </Card>
    );
}

export default RecipeCard;
