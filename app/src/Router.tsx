import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Main from './Main';
import Contents from './routes/Contents'
import Box from './routes/Box';
import Boxes from './routes/Boxes';
import RoutedRecipe from './routes/Recipe';
import MissingPage from './routes/MissingPage'
import Login from "./routes/Login";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />}>
          <Route index element={<Contents />} />
          <Route path="login" element={<Login />} />
          <Route path="boxes" element={<Boxes />} />
          <Route path="boxes/:boxId" element={<Box />} />
          <Route path="boxes/:boxId/recipes" element={<Box />} />
          <Route path="boxes/:boxId/recipes/:recipeId" element={<RoutedRecipe />} />
          <Route path="*" element={<MissingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}


export default Router