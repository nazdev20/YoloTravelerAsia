import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import ResponsiveMenu from './ResponsiveMenu';
import { FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const Navlinks = [
    { id: 1, name: 'Home', link: '/' },
    { id: 2, name: 'About', link: '/about' },
    { id: 4, name: 'Team', link: '/team' },
    { id: 3, name: 'Testimonial', link: '/testimonial' },
    { id: 5, name: 'Contacts', link: '/contacts' }
];

const Navbar = () => {
    const { user, signOut } = useAuth();
    const [showMenu, setShowMenu] = useState(false);
    const [authError, setAuthError] = useState('');
    const navigate = useNavigate();
    const navbarRef = useRef(null);
    const menuButtonRef = useRef(null);

    const toggleMenu = () => {
        if (showMenu) menuButtonRef.current?.focus();
        setShowMenu((current) => !current);
    };

    const handleClick = (id) => {
        const element = document.getElementById(id);
        if (element && navbarRef.current) {
            const elementPosition = element.offsetTop - navbarRef.current.offsetHeight;
            window.scrollTo({ top: elementPosition, behavior: 'smooth' });
        }
    };

    const handleCartClick = () => navigate('/list');

    const handleAuth = async () => {
        if (!user) {
            navigate('/auth');
            return;
        }
        try {
            setAuthError('');
            await signOut();
        } catch (error) {
            setAuthError(error?.message || 'Unable to sign out. Please try again.');
        }
    };

    return (
        <>
            <nav ref={navbarRef} className="flex fixed top-0 left-0 z-50 w-full bg-[#008080] px-3 py-3 sm:px-8 sm:py-5 items-center justify-between gap-3">
                <div className="flex min-w-0 items-center justify-center">
                    <div className="whitespace-nowrap text-[17px] sm:text-[25px] font-bold">
                        <span className='text-secondary'>Yolo</span><span className='text-primary'>Traveler</span><span className='text-fourth'>Asia</span>
                    </div>
                </div>
                <div className="hidden md:flex items-center flex-1 justify-center ml-4 mr-4">
                    <ul className="flex flex-wrap justify-center gap-x-12 sm:gap-x-16 md:gap-x-20 space-x-4 sm:space-x-8 font-bold text-lg">
                        {Navlinks.map((link) => (
                            <li key={link.id}><Link to={link.link} className="text-[#ffffff] hover:text-[#FF6F61] transition-colors duration-300" onClick={() => handleClick(link.id)}>{link.name}</Link></li>
                        ))}
                    </ul>
                </div>
                <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-4">
                    <h1 className='hidden sm:block font-bold text-white'>Cart</h1>
                    <FaShoppingCart className='cursor-pointer transition-all text-[#FF6F61] shrink-0' size={25} onClick={handleCartClick} />
                    <button onClick={handleAuth} className="hidden md:block text-white font-semibold">{user ? 'Sign out' : 'Sign in'}</button>
                    {authError && <p role="alert" className="absolute right-3 top-full mt-2 max-w-xs rounded-md bg-white px-3 py-2 text-sm font-medium text-red-700 shadow-lg">{authError}</p>}
                    <button ref={menuButtonRef} type="button" aria-label={showMenu ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={showMenu} onClick={toggleMenu} className="md:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white">
                        {showMenu ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
                    </button>
                </div>
            </nav>
            <ResponsiveMenu showMenu={showMenu} toggleMenu={toggleMenu} links={Navlinks} />
        </>
    );
};

export default Navbar;
