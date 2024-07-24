import React, { useEffect, useState } from 'react';
import { auth, googleProvider } from './firebase'; 
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import Search from "./Search";
import axios from 'axios';



function Header({ onItemSelected, handleLogin }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
    .then((result) => {
      console.log(result.user);
      axios.post('http://my-backend-env.eba-tqzpmtwd.us-east-1.elasticbeanstalk.com/auth/google/callback', { 
        email: result.user.email,
        oauthProvider: 'google',
        oauthId: result.user.uid
      }).then(response => {
        console.log('User saved to backend:', response.data);
      }).catch(error => {
        console.error('Error saving user to backend:', error);
      });
    })
    .catch((error) => {
      console.error(error);
    });
  };

  return (
    <nav id="navnav" className="navbar navbar-expand-lg navbar-dark bg-dark">
      <a className="navbar-brand" href="/">OSRS GE <img style={{ height: '30px', width: '30px' }} src={`${process.env.PUBLIC_URL}/images/gnome.png`}/> </a>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <a style={{ marginLeft: '15px' }} className="nav-link" href="/">Home </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/about">About</a>
          </li>
          <li className="nav-item">
            {user ? (
              <span className="nav-link clickable" redirect="/" onClick={() => signOut(auth)}>Sign Out</span>
            ) : (
              <span className="nav-link clickable" id='loginButton' href="/login" onClick={signInWithGoogle}>Log in</span>
            )}
          </li>
          
        </ul>
        <form className="form-inline my-2 my-lg-0">
          <Search onItemSelected={onItemSelected} />
        </form>
      </div>
    </nav>
  );
}

export default Header;
