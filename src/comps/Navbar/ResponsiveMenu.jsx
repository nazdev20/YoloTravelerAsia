/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth } from "../../config/firebase-config";
import { useNavigate } from "react-router-dom";

const Navlinks = [
  { id: 1, name: 'Home', link: '/' },
  { id: 2, name: 'About', link: '/about' },
  { id: 3, name: 'Features', link: '/features' },
  { id: 4, name: 'Blog', link: '/blog' },
  { id: 5, name: 'Contacts', link: '/contact' }
];

const ResponsiveMenu = ({ showMenu }) => {
  const { name, profilePhoto } = useGetUserInfo();
  const navigate = useNavigate();

  const handleSignIn = () => {
    signInWithPopup(auth)
      .then(() => {
        console.log('Sign-in successful!');
      })
      .catch((error) => {
        console.error('Error signing in:', error.message);
      });
  };

  const signUserOut = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/");
      window.location.reload();
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
          <img src={profilePhoto} alt="Profile" className="h-10 w-10 object-cover rounded-full" />
          <div>
            <h1 className='text-lg'>Hello {name}</h1>
            <h1 className='text-sm text-slate-500'>Premium User</h1>
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
              <button onClick={handleSignIn} className='text-lg font-medium text-black dark:text-white duration-300'>
                Sign In
              </button>
            </li>
            <li className='py-4'>
              <button onClick={signUserOut} className='text-lg font-medium text-black dark:text-white duration-300'>
                Sign Out
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
