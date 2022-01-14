import styled from 'styled-components';

import { GoogleAuthProvider, EmailAuthProvider, getAuth, UserCredential } from "firebase/auth";

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '../context';

const SignInCard = styled.div`
  margin: 40px auto;
  max-width: 300px;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
`

function Auth() {
  const { dispatch } = useContext(Context)
  const navigate = useNavigate()

  // Configure FirebaseUI.
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Email+Password as auth providers.
    signInSuccessUrl: '/',

    signInOptions: [
      GoogleAuthProvider.PROVIDER_ID,
      // FacebookAuthProvider.PROVIDER_ID,
      EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: (authResult: UserCredential) => {
        dispatch({ type: "SET_AUTH_USER", authUser: authResult.user })
        navigate("/"); return false
      },
    }
  }

  return (
    <SignInCard>
      <h1>Recipe book</h1>
      <p>Please sign-in:</p>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={getAuth()} />
    </SignInCard>
  );
}

export default Auth;
