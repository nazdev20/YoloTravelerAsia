/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ResponsiveMenu = ({ showMenu, toggleMenu, links = [] }) => {
  const { user, signInWithGoogle, signOut } = useAuth();

  const handleAuth = async () => {
    try {
      if (user) await signOut();
      else await signInWithGoogle();
      toggleMenu();
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  return (
    <>
      {showMenu && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={toggleMenu}
          className="fixed inset-0 z-[55] bg-black/45 md:hidden"
        />
      )}
      <aside
        aria-label="Mobile navigation"
        aria-hidden={!showMenu}
        className={"fixed right-0 top-0 z-[60] flex h-dvh w-[min(84vw,340px)] flex-col justify-between overflow-y-auto rounded-l-2xl bg-white px-6 pb-6 pt-20 text-slate-900 shadow-2xl transition-transform duration-300 ease-in-out dark:bg-dark dark:text-white md:hidden " + (showMenu ? "translate-x-0" : "translate-x-full")}
      >
        <div>
          <div className="flex items-center gap-3 border-b border-slate-200 pb-5 dark:border-slate-700">
            {user?.user_metadata?.avatar_url && (
              <img src={user.user_metadata.avatar_url} alt="Profile" className="h-11 w-11 rounded-full object-cover" />
            )}
            <div className="min-w-0">
              <p className="truncate text-base font-semibold">Hello {user?.user_metadata?.name ?? user?.email ?? 'traveler'}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user ? 'Signed in' : 'Guest'}</p>
            </div>
          </div>
          <nav className="mt-5">
            <ul className="space-y-1">
              {links.map(({ id, name, link }) => (
                <li key={id}>
                  <Link
                    to={link}
                    onClick={toggleMenu}
                    className="block rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-teal-50 hover:text-teal-800 dark:hover:bg-slate-800 dark:hover:text-teal-300"
                  >
                    {name}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={handleAuth}
                  className="block w-full rounded-lg px-3 py-3 text-left text-base font-medium transition-colors hover:bg-teal-50 hover:text-teal-800 dark:hover:bg-slate-800 dark:hover:text-teal-300"
                >
                  {user ? 'Sign out' : 'Sign in with Google'}
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <p className="pt-6 text-sm text-slate-500 dark:text-slate-400">
          Made by <a href="https://github.com/nazdev20" className="text-teal-700 hover:underline dark:text-teal-300">Naz</a>
        </p>
      </aside>
    </>
  );
};

export default ResponsiveMenu;
