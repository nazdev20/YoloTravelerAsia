// src/components/Auth.jsx

import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { isSupabaseConfigured } from './config/supabase';

const AuthComponent = () => {
  const { user, signInWithGoogle, signOut } = useAuth();
  const [error, setError] = useState('');

  const handleAuth = async () => {
    try {
      setError('');
      await (user ? signOut() : signInWithGoogle());
    } catch (authError) {
      setError(authError.message);
    }
  };

  return (
    <main className="mx-auto mt-32 max-w-md px-6 text-center">
      <h1 className="mb-6 text-2xl font-bold">{user ? 'Signed in' : 'Sign in to Yolo Traveler Asia'}</h1>
      {!isSupabaseConfigured && <p className="mb-4 text-red-700">Supabase is not configured. Add the project URL and anon key to your environment.</p>}
      <button onClick={handleAuth} disabled={!isSupabaseConfigured} className="rounded bg-teal-700 px-5 py-2 font-semibold text-white disabled:opacity-50">
        {user ? 'Sign out' : 'Continue with Google'}
      </button>
      {error && <p className="mt-4 text-red-700">{error}</p>}
    </main>
  );
};

export default AuthComponent;
