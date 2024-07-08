import firebase from 'firebase/app';
import 'firebase/auth';

const uiConfig = {
  signInSuccessUrl: 'https://nazdev20.github.io/YoloTravelerAsia/',
  // Other configuration options for Firebase UI
};

const ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', uiConfig);
