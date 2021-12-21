import { useReducer } from 'react';
import RecipeList from './RecipeTable';
import { StateType, ActionType } from './types';
import { RecipeBoxContext, initState } from './context';
import { recipeBoxReducer } from './reducer';
import Header from './Header';
import styled from 'styled-components';

const Layout = styled.div`
  padding: 20px
`

function App() {

  const [state, dispatch] = useReducer<React.Reducer<StateType, ActionType>>(recipeBoxReducer, initState())

  return (
    <Layout>
      <RecipeBoxContext.Provider value={{ state, dispatch }}>
        <Header />
        <RecipeList />
      </RecipeBoxContext.Provider>
    </Layout>
  );
}

export default App;
