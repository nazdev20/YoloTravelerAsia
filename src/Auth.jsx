import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { isSupabaseConfigured } from './config/supabase';

const AuthComponent = () => {
  const { user, signIn, signUp, signOut } = useAuth();
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (mode === 'signup' && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signin') {
        await signIn(email.trim(), password);
      } else {
        const data = await signUp(email.trim(), password);
        if (!data.session) {
          setNotice('Account created. Check your email for a confirmation link before signing in.');
          setMode('signin');
          setPassword('');
          setConfirmPassword('');
        } else {
          setNotice('Your account has been created and you are signed in.');
          setMode('signin');
        }
      }
    } catch (authError) {
      setError(authError?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setError('');
    setNotice('');
    try {
      await signOut();
    } catch (authError) {
      setError(authError?.message || 'Unable to sign out.');
    }
  };

  return (
    <main className="mx-auto mt-32 max-w-md px-6 pb-12">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
        <div className="mb-6 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Yolo Traveler Asia</p>
          <h1 className="text-2xl font-bold text-gray-900">{user ? 'Account' : mode === 'signin' ? 'Welcome back' : 'Create your account'}</h1>
          <p className="mt-2 text-sm text-gray-600">{user ? 'You are signed in to your account.' : mode === 'signin' ? 'Sign in with your email and password.' : 'Create an account with your email and password.'}</p>
        </div>

        {!isSupabaseConfigured && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">Supabase is not configured. Add the project URL and anon key to your environment.</p>}

        {user ? (
          <div className="text-center">
            <p className="mb-4 break-words text-gray-700">{user.email}</p>
            <button onClick={handleSignOut} className="w-full rounded-lg bg-teal-700 px-5 py-3 font-semibold text-white transition hover:bg-teal-800">Sign out</button>
          </div>
        ) : (
          <>
            <div className="mb-5 grid grid-cols-2 rounded-lg bg-gray-100 p-1">
              <button type="button" onClick={() => { setMode('signin'); setError(''); setNotice(''); }} className={`rounded-md px-3 py-2 text-sm font-semibold transition ${mode === 'signin' ? 'bg-white text-teal-800 shadow-sm' : 'text-gray-600'}`}>Sign in</button>
              <button type="button" onClick={() => { setMode('signup'); setError(''); setNotice(''); }} className={`rounded-md px-3 py-2 text-sm font-semibold transition ${mode === 'signup' ? 'bg-white text-teal-800 shadow-sm' : 'text-gray-600'}`}>Sign up</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Email
                <input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" />
              </label>
              <label className="block text-sm font-medium text-gray-700">Password
                <input type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} minLength={6} required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" />
              </label>
              {mode === 'signup' && (
                <label className="block text-sm font-medium text-gray-700">Confirm password
                  <input type="password" autoComplete="new-password" minLength={6} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" />
                </label>
              )}
              <button type="submit" disabled={!isSupabaseConfigured || loading} className="w-full rounded-lg bg-teal-700 px-5 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50">
                {loading ? 'Please wait...' : mode === 'signin' ? 'Sign in' : 'Create account'}
              </button>
            </form>
            <p className="mt-5 text-center text-xs leading-5 text-gray-500">Your account is authenticated by Supabase. Account roles and permissions are managed separately by the site administrator.</p>
          </>
        )}
        {notice && <p role="status" className="mt-4 rounded-lg bg-teal-50 p-3 text-sm text-teal-800">{notice}</p>}
        {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      </div>
    </main>
  );
};

export default AuthComponent;
