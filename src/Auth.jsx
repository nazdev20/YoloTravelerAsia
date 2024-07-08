// src/components/Auth.jsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import 'firebase/auth';

import { auth } from './config/firebase-config';

const AuthComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const uiConfig = {
      signInSuccessUrl: 'https://nazdev20.github.io/YoloTravelerAsia/',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      
      ],
      callbacks: {
        signInSuccessWithAuthResult: () => {
          navigate('/');
          return false; 
        },
      },
    };

    const ui =
    firebaseui.auth.AuthUI.getInstance() ||
    new firebaseui.auth.AuthUI(firebase.auth());

  
    ui.start('#firebaseui-auth-container', uiConfig);

    
    return () => {
      ui.delete();
    };
  }, [navigate]);

  return <div id="firebaseui-auth-container"></div>;
};

export default AuthComponent;
