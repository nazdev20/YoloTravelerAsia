/* eslint-disable react/prop-types */
import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiX } from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';

const ResponsiveMenu = ({ showMenu, toggleMenu, links = [] }) => {
  const { user, signOut } = useAuth();
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useLayoutEffect(() => {
    if (menuRef.current) menuRef.current.inert = !showMenu;
  }, [showMenu]);

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
      <aside ref={menuRef} aria-label="Mobile navigation" aria-hidden={!showMenu} className={"fixed right-0 top-0 z-[60] flex h-dvh w-[min(86vw,360px)] flex-col justify-between overflow-y-auto rounded-l-3xl bg-white px-5 pb-6 pt-20 text-slate-900 shadow-2xl transition-transform duration-300 ease-in-out dark:bg-dark dark:text-white md:hidden " + (showMenu ? "translate-x-0" : "translate-x-full")}>
        <div>
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-5 dark:border-slate-700">
            <Link to="/" onClick={toggleMenu} className="flex min-w-0 items-center gap-3" aria-label="YoloTravelerAsia home">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#008080] text-xl text-white shadow-sm">✦</span>
              <span className="min-w-0">
                <span className="block truncate text-lg font-extrabold tracking-tight"><span className="text-secondary">Yolo</span><span className="text-primary">Traveler</span><span className="text-fourth">Asia</span></span>
                <span className="block text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400">YOUR NEXT JOURNEY STARTS HERE</span>
              </span>
            </Link>
            <button type="button" onClick={toggleMenu} aria-label="Close navigation menu" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-700 transition-colors hover:bg-teal-50 hover:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:text-white dark:hover:bg-slate-800">
              <HiX size={24} />
            </button>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
            {user?.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} alt="Profile" className="h-11 w-11 rounded-full object-cover" /> : <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#008080] text-base font-bold text-white">{(user?.user_metadata?.name ?? user?.email ?? 'T').charAt(0).toUpperCase()}</span>}
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">Hello, {user?.user_metadata?.name ?? user?.email ?? 'traveler'}!</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user ? 'Signed in to your account' : 'Explore as a guest'}</p>
            </div>
          </div>

          <p className="mb-2 mt-7 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Explore</p>
          <nav aria-label="Main navigation">
            <ul className="space-y-1">
              {links.map(({ id, name, link }) => <li key={id}><Link to={link} onClick={() => { toggleMenu(); const target = document.getElementById(String(id)); if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="group flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-semibold transition-colors hover:bg-teal-50 hover:text-teal-800 dark:hover:bg-slate-800 dark:hover:text-teal-300"><span>{name}</span><span aria-hidden="true" className="text-lg text-slate-400 transition-transform group-hover:translate-x-1 dark:text-slate-500">›</span></Link></li>)}
              <li><Link to="/list" onClick={toggleMenu} className="flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-semibold transition-colors hover:bg-teal-50 hover:text-teal-800 dark:hover:bg-slate-800 dark:hover:text-teal-300"><span>Cart & bookings</span><span aria-hidden="true" className="text-lg text-slate-400 dark:text-slate-500">›</span></Link></li>
              {authError && <li><p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">{authError}</p></li>}
              <li className="pt-2"><button type="button" onClick={handleAuth} className="block w-full rounded-xl border border-slate-200 px-3 py-3 text-left text-sm font-bold text-slate-700 transition-colors hover:bg-teal-50 hover:text-teal-800 dark:border-slate-600 dark:text-white dark:hover:bg-slate-800">{user ? 'Sign out' : 'Sign in'}</button></li>
            </ul>
          </nav>
        </div>
        <p className="pt-6 text-xs text-slate-500 dark:text-slate-400">Discover more. Travel further. <a href="https://github.com/nazdev20" className="font-semibold text-teal-700 hover:underline dark:text-teal-300">Made by Naz</a></p>
      </aside>
    </>
  );
};

export default ResponsiveMenu;
