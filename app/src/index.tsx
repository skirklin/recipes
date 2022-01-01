import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import './index.css';
import reportWebVitals from './reportWebVitals';
import WrappedApp from './Auth';
import Contents from './routes/Contents'
import Box from './routes/Box';
import Boxes from './routes/Boxes';
import { RoutedRecipe } from './routes/Recipe';
import MissingPage from './routes/MissingPage'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WrappedApp />}>
          <Route index element={<Contents />} />
          <Route path="boxes" element={<Boxes />} />
          <Route path="boxes/:boxId" element={<Box />} />
          <Route path="boxes/:boxId/recipes" element={<Box />} />
          <Route path="boxes/:boxId/recipes/:recipeId" element={<RoutedRecipe />} />
          <Route path="*" element={<MissingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>,
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
