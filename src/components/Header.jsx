import React, { useEffect, useState } from 'react';
import { auth, googleProvider } from './firebase'; // Ensure the correct path to firebase.js
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import Search from "./Search";

function Header({ onItemSelected }) {
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
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <nav id="navnav" className="navbar navbar-expand-lg navbar-dark bg-dark">
      <a className="navbar-brand" href="/">OSRS GE</a>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/about">About</a>
          </li>
          <li className="nav-item">
            {user ? (
              <span className="nav-link clickable" onClick={() => signOut(auth)}>Sign Out</span>
            ) : (
              <span className="nav-link clickable" id='loginButton' onClick={signInWithGoogle}>Log in</span>
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
