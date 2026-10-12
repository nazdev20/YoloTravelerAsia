/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ResponsiveMenu = ({ showMenu, toggleMenu, links = [] }) => {
  const { user, signOut } = useAuth();
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async () => {
    if (!user) {
      toggleMenu();
      navigate('/auth');
      return;
    }
    try {
      setAuthError('');
      await signOut();
      toggleMenu();
    } catch (error) {
      setAuthError(error?.message || 'Unable to sign out. Please try again.');
    }
  };

  return (
    <>
      {showMenu && <button type="button" aria-label="Close navigation menu" onClick={toggleMenu} className="fixed inset-0 z-[55] bg-black/45 md:hidden" />}
      <aside aria-label="Mobile navigation" aria-hidden={!showMenu} className={"fixed right-0 top-0 z-[60] flex h-dvh w-[min(84vw,340px)] flex-col justify-between overflow-y-auto rounded-l-2xl bg-white px-6 pb-6 pt-20 text-slate-900 shadow-2xl transition-transform duration-300 ease-in-out dark:bg-dark dark:text-white md:hidden " + (showMenu ? "translate-x-0" : "translate-x-full")}>
        <div>
          <div className="flex items-center gap-3 border-b border-slate-200 pb-5 dark:border-slate-700">
            {user?.user_metadata?.avatar_url && <img src={user.user_metadata.avatar_url} alt="Profile" className="h-11 w-11 rounded-full object-cover" />}
            <div className="min-w-0">
              <p className="truncate text-base font-semibold">Hello {user?.user_metadata?.name ?? user?.email ?? 'traveler'}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user ? 'Signed in' : 'Guest'}</p>
            </div>
          </div>
          <nav className="mt-5">
            <ul className="space-y-1">
              {links.map(({ id, name, link }) => <li key={id}><Link to={link} onClick={() => { toggleMenu(); const target = document.getElementById(String(id)); if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="block rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-teal-50 hover:text-teal-800 dark:hover:bg-slate-800 dark:hover:text-teal-300">{name}</Link></li>)}
              {authError && <li><p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">{authError}</p></li>}
              <li><button type="button" onClick={handleAuth} className="block w-full rounded-lg px-3 py-3 text-left text-base font-medium transition-colors hover:bg-teal-50 hover:text-teal-800 dark:hover:bg-slate-800 dark:hover:text-teal-300">{user ? 'Sign out' : 'Sign in'}</button></li>
            </ul>
          </nav>
        </div>
        <p className="pt-6 text-sm text-slate-500 dark:text-slate-400">Made by <a href="https://github.com/nazdev20" className="text-teal-700 hover:underline dark:text-teal-300">Naz</a></p>
      </aside>
    </>
  );
};

export default ResponsiveMenu;
