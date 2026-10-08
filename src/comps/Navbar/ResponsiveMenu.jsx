/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const Navlinks = [
  { id: 1, name: 'Home', link: '/' },
  { id: 2, name: 'About', link: '/about' },
  { id: 3, name: 'Features', link: '/features' },
  { id: 4, name: 'Blog', link: '/blog' },
  { id: 5, name: 'Contacts', link: '/contact' }
];

const ResponsiveMenu = ({ showMenu }) => {
  const { user, signInWithGoogle, signOut } = useAuth();

  const handleAuth = async () => {
    try {
      if (user) await signOut();
      else await signInWithGoogle();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`fixed bottom-0 top-0 z-20 flex h-screen w-[55%] flex-col justify-between
      bg-white dark:bg-dark dark:text-white px-8 pb-6 pt-16 text-black
      duration-300 md:hidden rounded-r-xl shadow-md
      ${showMenu ? "left-0" : '-left-[100%]'}`}>
      <div>
        <div className='flex items-center justify-start gap-3'>
          {user?.user_metadata?.avatar_url && <img src={user.user_metadata.avatar_url} alt="Profile" className="h-10 w-10 object-cover rounded-full" />}
          <div>
            <h1 className='text-lg'>Hello {user?.user_metadata?.name ?? user?.email ?? 'traveler'}</h1>
            <h1 className='text-sm text-slate-500'>{user ? 'Signed in' : 'Guest'}</h1>
          </div>
        </div>
        <nav className='mt-12'>
          <ul>
            {Navlinks.map(({ id, name, link }) => (
              <li key={id} className='py-4'>
                <Link to={link} className='text-lg font-medium text-black dark:text-white duration-300'>
                  {name}
                </Link>
              </li>
            ))}
            <li className='py-4'>
              <button onClick={handleAuth} className='text-lg font-medium text-black dark:text-white duration-300'>
                {user ? 'Sign Out' : 'Sign In with Google'}
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <div className='footer'>
        <h1 className='text-lg'>
          Made by <a href="https://github.com/nazdev20" className='text-blue-500 hover:underline'>Naz</a>
        </h1>
      </div>
    </div>
  );
}

export default ResponsiveMenu;
