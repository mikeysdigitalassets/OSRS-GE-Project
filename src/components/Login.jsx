import React from 'react';
import { auth, googleProvider, facebookProvider } from './firebase';

const Login = () => {
  const signInWithGoogle = () => {
    auth.signInWithPopup(googleProvider)
      .then((result) => {
        console.log(result.user);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  

  return (
    <div>
      <h2>Login</h2>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
      
    </div>
  );
};

export default Login;
