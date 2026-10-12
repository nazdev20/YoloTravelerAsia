import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { isSupabaseConfigured } from './config/supabase';

const AuthComponent = () => {
  const { user, signIn, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (authError) {
      setError(authError?.message || 'Unable to sign in. Check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setError('');
    try {
      await signOut();
    } catch (authError) {
      setError(authError?.message || 'Unable to sign out.');
    }
  };

  return (
    <main className="mx-auto mt-32 max-w-md px-6 pb-12">
      <h1 className="mb-2 text-center text-2xl font-bold">{user ? 'You are signed in' : 'Sign in to Yolo Traveler Asia'}</h1>
      <p className="mb-6 text-center text-sm text-gray-600">Use the email and password provided by the administrator.</p>
      {!isSupabaseConfigured && <p className="mb-4 text-red-700">Supabase is not configured. Add the project URL and anon key to your environment.</p>}
      {user ? (
        <div className="text-center">
          <p className="mb-4 break-words">{user.email}</p>
          <button onClick={handleSignOut} className="rounded bg-teal-700 px-5 py-2 font-semibold text-white">Sign out</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium">Email
            <input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 block w-full rounded border border-gray-300 px-3 py-2" />
          </label>
          <label className="block text-sm font-medium">Password
            <input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 block w-full rounded border border-gray-300 px-3 py-2" />
          </label>
          <button type="submit" disabled={!isSupabaseConfigured || loading} className="w-full rounded bg-teal-700 px-5 py-2 font-semibold text-white disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      )}
      {error && <p role="alert" className="mt-4 text-center text-red-700">{error}</p>}
    </main>
  );
};

export default AuthComponent;
