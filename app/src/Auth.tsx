import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { GoogleAuthProvider, EmailAuthProvider, onAuthStateChanged, getAuth, signOut } from "firebase/auth";

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const SignInCard = styled.div`
  margin: 40px auto;
  max-width: 200px;
  padding: 20px;
  border-radius: 5px; /* 5px rounded corners */
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
`

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Google and Email+Password as auth providers.
  signInOptions: [
    GoogleAuthProvider.PROVIDER_ID,
    EmailAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

interface AuthProps {
    Content: React.ReactNode
}

function SignInScreen(props: AuthProps) {
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.
  let { Content } = props;  

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = onAuthStateChanged(getAuth(), user => {
      setIsSignedIn(!!user);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  if (!isSignedIn) {
    return (
      <SignInCard>
        <h1>Recipe book</h1>
        <p>Please sign-in:</p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={getAuth()} />
      </SignInCard>
    );
  }
  return (
    <div>
      <button onClick={() => signOut(getAuth())} style={{ margin: "10px", display: "inline-block", float: "right" }}>Sign-out</button>
      {Content}
    </div>
  );
}

export default SignInScreen;