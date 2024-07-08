import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenuAlt3, HiMenuAlt1 } from 'react-icons/hi';
import ResponsiveMenu from './ResponsiveMenu';
import { FaShoppingCart } from 'react-icons/fa';
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from '../../config/firebase-config'; 

const Navlinks = [
    { id: 1, name: 'Home', link: '/' },
    { id: 2, name: 'About', link: '/about' },
    { id: 4, name: 'Team', link: '/team' },
    { id: 3, name: 'Testimonial', link: '/testimonial' },
    { id: 5, name: 'Contacts', link: '/contacts' }
];

const Navbar = () => {
    const { name, profilePhoto, isAuthenticated } = useGetUserInfo(); 
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const navbarRef = useRef(null);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const handleClick = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const navbarHeight = navbarRef.current.offsetHeight;
            const elementPosition = element.offsetTop - navbarHeight;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    };

    const handleCartClick = () => {
        navigate('/list');
    };
    return (
        <>
            <nav ref={navbarRef} className="flex fixed top-0 left-0 z-50 w-full bg-[#008080] p-4 sm:p-8 items-center justify-between">
                <div className="flex items-center justify-center ml-5">
                    <div className="text-[25px] font-bold">
                        <span className='text-secondary'>Yolo</span>
                        <span className='text-primary'>Traveler</span>
                        <span className='text-fourth'>Asia</span>
                    </div>
                </div>

                <div className="hidden md:flex items-center flex-1 justify-center ml-4 mr-4">
                    <ul className="flex flex-wrap justify-center gap-x-12 sm:gap-x-16 md:gap-x-20 space-x-4 sm:space-x-8 font-bold text-lg">
                        {Navlinks.map((link) => (
                            <li key={link.id}>
                                <Link
                                    to={link.link}
                                    className="text-[#ffffff] hover:text-[#FF6F61] transition-colors duration-300"
                                    onClick={() => handleClick(link.id)}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex items-center space-x-3 "> <h1 className='font-bold text-white'>Cart</h1>
                    <FaShoppingCart
                        className='cursor-pointer transition-all text-[#FF6F61]'
                        size={25}
                        onClick={handleCartClick}
                       
                    />


                    <div className="md:hidden ml-4 ">
                        {showMenu ? (
                            <HiMenuAlt1 onClick={toggleMenu} className='cursor-pointer transition-all' size={30} />
                        ) : (
                            <HiMenuAlt3 onClick={toggleMenu} className='cursor-pointer transition-all' size={30} />
                        )}
                    </div>
                </div>
            </nav>
            <ResponsiveMenu showMenu={showMenu} toggleMenu={toggleMenu} links={Navlinks} />
        </>
    );
};

export default Navbar;
