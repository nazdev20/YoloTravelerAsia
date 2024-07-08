// src/config/firebase-config.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyB-YqAkrOw6xzNoTXKe4RHCwj90fqcv1os",
  authDomain: "database-4bac1.firebaseapp.com",
  databaseURL: "https://database-4bac1-default-rtdb.firebaseio.com",
  projectId: "database-4bac1",
  storageBucket: "database-4bac1.appspot.com",
  messagingSenderId: "125697044088",
  appId: "1:125697044088:web:b4a67ecb3c55436406078d",
  measurementId: "G-0ETJP2NJXT"
};



const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

export { auth, provider, db, storage };

