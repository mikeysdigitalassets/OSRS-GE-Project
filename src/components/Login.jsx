// import React from 'react';
// import { auth, googleProvider } from './firebase';
// import axios from 'axios';

// const Login = () => {
//   const signInWithGoogle = () => {
//     auth.signInWithPopup(googleProvider)
//       .then((result) => {
//         console.log(result.user);
//         axios.post('http://localhost:3000/auth/google/callback', { // Ensure the URL is correct
//           email: result.user.email,
//           oauthProvider: 'google',
//           oauthId: result.user.uid
//         }).then(response => {
//           console.log('User saved to backend:', response.data);
//         }).catch(error => {
//           console.error('Error saving user to backend:', error);
//         });
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <button onClick={signInWithGoogle}>log in baby!</button>
//     </div>
//   );
// };

// export default Login;
