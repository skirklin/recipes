import { useMemo, useReducer, useEffect } from 'react';
import { getAuth } from "firebase/auth";
import Modal from 'react-modal';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

import { RecipeBoxStateType, RecipeBoxActionType, UnsubMap, BoxUnsub } from './types';
import { Context, initState, recipeBoxReducer } from './context';
import Header from './Header/Header';
import { Outlet } from 'react-router-dom';

import { subscribeToUser, unsubscribe } from './subscription';

Modal.setAppElement('#root'); // for accessibility. See: https://reactcommunity.org/react-modal/accessibility/

function App() {
  const [state, dispatch] = useReducer<React.Reducer<RecipeBoxStateType, RecipeBoxActionType>>(recipeBoxReducer, initState())
  const { boxes } = state;

  const recipesValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  const user = getAuth().currentUser;

  useEffect(
    () => {
      // fetch any boxes associated with this user
      if (user === null) {
        return
      }

      let unsubMap: UnsubMap = {
        userUnsub: undefined,
        boxesUnsub: undefined,
        boxMap: new Map<string, BoxUnsub>(),
      }

      // useRef to let this async chain self-terminate if the component unmounts.
      // errr, okay, another problem is that a part of the tree can fall out of 
      // interest, but it doesn't get unsubscribed since that is all or nothing.
      // todo: track the full tree of thing => unsubscriber mappings, and when 
      // removing stuff also unsubscribe.
      subscribeToUser(user, dispatch, unsubMap)
      return () => { console.debug("Unsubscring from all."); unsubscribe(unsubMap) }
    }, [user]
  )

  useEffect(
    () => {

    }, [user, boxes],
  )



  return (
    <Context.Provider value={recipesValue}>
      <Header />
      <Outlet />
    </Context.Provider>
  );
}


export default App;
