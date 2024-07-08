import { useState, useEffect } from 'react';
import { auth, provider } from "../config/firebase-config";

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return {
    user,
    provider,
    signOut: async () => {
      try {
        await signOut();
      } catch (error) {
        console.error('Error signing out:', error.message);
      }
    }
  };
};
