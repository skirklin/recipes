import { useContext } from 'react';
import styled from 'styled-components';
import { RecipeBoxContext } from './constants';

const Container = styled.div`
  background-color: transparent;
  border-bottom: solid;
  padding: 10px;
`

const Title = styled.h1`
  margin: 0px;
  margin-bottom: 20px;
`

function TopBar() {
    const { setRecipes, recipes } = useContext(RecipeBoxContext)

    function readRecipes(event: any) {
        let files = Array.prototype.filter.call(event.target.files, f => f.type === "application/json")
        let newRecipes = Promise.all(
            files.map(
                (f: any) => {
                    return (
                        f.text()
                            .then(JSON.parse)
                    )
                }
            )
        ).then(
            setRecipes
        ).then(
            (value) => console.log("setting new recipes", value)
        )
        console.log("maybe setting new recipes", newRecipes)
    }
    let title = <Title>Recipe box</Title>
    if (recipes.length > 0) {
        return title
    }

    return (
        <Container>
            <label>Select directory containing recipes: </label>
            <input
                type="file"
                id="recipeBoxRootPicker"
                name="recipeBoxRoot"
                accept="application/json"
                /* @ts-expect-error */
                multiple webkitdirectory="true" directory="true"
                onChange={readRecipes}
            />
            {title}
        </Container>
    );
}

export default TopBar;
