import { useEffect, useContext } from 'react';
import { Unsubscribe } from "firebase/auth";
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

import { UnsubMap } from './types';
import { Context } from './context';
import Header from './Header/Header';
import { Outlet } from 'react-router-dom';

import { subscribeToUser, unsubscribe } from './subscription';
import { Spin } from 'antd';

function Main() {

  const { dispatch, state } = useContext(Context)
  const { authUser } = state;

  useEffect(
    () => {
      if (authUser === null) {
        return
      }

      const unsubMap: UnsubMap = {
        userUnsub: undefined,
        boxesUnsub: undefined,
        boxMap: new Map<string, {
          boxUnsub: Unsubscribe,
          recipesUnsub: Unsubscribe
        }>(),
      }

      subscribeToUser(authUser, dispatch, unsubMap)
      return () => { console.debug("Unsubscring from all."); unsubscribe(unsubMap) }
    }, [authUser, dispatch]
  )

  return (
    <>
      <Header />
      <Spin spinning={state.loading > 0}>
        <Outlet />
      </Spin>
    </>
  );
}


export default Main;
