import React, { useMemo, useReducer } from 'react';
import { recipeBoxReducer, initState, Context } from './context';
import { AppState, ActionType } from './types';
import Router from './Router';


function App() {
  const [state, dispatch] = useReducer<React.Reducer<AppState, ActionType>>(recipeBoxReducer, initState())

  const defaultState = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return (
    <Context.Provider value={defaultState}>
      <Router />
    </Context.Provider>
  )
}

export default App