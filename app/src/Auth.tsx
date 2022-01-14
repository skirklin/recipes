import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';

import { GoogleAuthProvider, EmailAuthProvider, onAuthStateChanged, getAuth } from "firebase/auth";

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Context } from './context';

const SignInCard = styled.div`
  margin: 40px auto;
  max-width: 300px;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
`


// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Google and Email+Password as auth providers.
  signInOptions: [
    GoogleAuthProvider.PROVIDER_ID,
    // FacebookAuthProvider.PROVIDER_ID,
    EmailAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

function Auth(props: { children: JSX.Element }) {
  const { dispatch, state } = useContext(Context)
  const { authUser } = state;

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = onAuthStateChanged(getAuth(), authUser => {
      dispatch({ type: "SET_AUTH_USER", authUser })
    });
    return () => {
      dispatch({ type: "SET_AUTH_USER", authUser: null });
      unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
    }
  }, [dispatch]);

  if (authUser === null) {
    return (
      <SignInCard>
        <h1>Recipe book</h1>
        <p>Please sign-in:</p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={getAuth()} />
      </SignInCard>
    );
  } else {
    return props.children
  }
}

export default Auth;
