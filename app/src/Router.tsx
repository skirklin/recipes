import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Main from './Main';
import Contents from './routes/Contents'
import Box from './routes/Box';
import Boxes from './routes/Boxes';
import Settings from './routes/Settings';
import RoutedRecipe from './routes/Recipe';
import MissingPage from './routes/MissingPage'
import Auth from "./Auth";

function Router() {
  return (
    <Auth>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />}>
            <Route index element={<Contents />} />
            <Route path="settings" element={<Settings />} />
            <Route path="boxes" element={<Boxes />} />
            <Route path="boxes/:boxId" element={<Box />} />
            <Route path="boxes/:boxId/recipes" element={<Box />} />
            <Route path="boxes/:boxId/recipes/:recipeId" element={<RoutedRecipe />} />
            <Route path="*" element={<MissingPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Auth>
  )
}


export default Router