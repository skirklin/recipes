import { useState } from 'react';
import { Recipe } from 'schema-dts';
import RecipeList from './RecipeList';
import { RecipeBoxContext } from './constants';
import TopBar from './TopBar';
import styled from 'styled-components';

const Layout = styled.div`
  padding: 20px
`

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [activeRecipes, setActiveRecipes] = useState<Recipe[]>([])

  let value = {
    recipes: recipes,
    setRecipes: setRecipes,
    activeRecipes: activeRecipes,
    setActiveRecipes: setActiveRecipes,
  }
  
  return (
    <Layout>
      <RecipeBoxContext.Provider value={value}>
        <TopBar />
        <RecipeList />
      </RecipeBoxContext.Provider>
    </Layout>
  );
}

export default App;
