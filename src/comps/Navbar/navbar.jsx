import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import ResponsiveMenu from './ResponsiveMenu';
import { FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { useGetTransactions } from '../../hooks/useGetTransactions';

const Navlinks = [
    { id: 1, name: 'Home', link: '/' },
    { id: 2, name: 'About', link: '/about' },
    { id: 4, name: 'Team', link: '/team' },
    { id: 3, name: 'Testimonial', link: '/testimonial' },
    { id: 5, name: 'Contacts', link: '/contacts' }
];

const Navbar = () => {
    const { user, signOut } = useAuth();
    const { cartItems } = useGetTransactions();
    const cartCount = cartItems.reduce((total, item) => total + Math.max(0, Number(item.quantity) || 0), 0);
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
            <nav ref={navbarRef} className="flex fixed top-0 left-0 z-50 w-full items-center justify-between gap-3 border-b bg-[#008080] px-3 py-3 text-white sm:px-8 sm:py-5">
                <Link to="/" aria-label="YoloTravelerAsia home" className="flex min-w-0 items-center gap-2">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#008080] text-lg text-white shadow-sm">✦</span>
                    <span className="whitespace-nowrap text-[17px] font-extrabold tracking-tight sm:text-[25px]">
                        <span className="text-secondary">Yolo</span><span className="text-primary">Traveler</span><span className="text-fourth">Asia</span>
                    </span>
                </Link>
                <div className="ml-4 mr-4 hidden flex-1 items-center justify-center md:flex">
                    <ul className="flex flex-wrap justify-center gap-x-8 font-semibold lg:gap-x-12">
                        {Navlinks.map((link) => (
                            <li key={link.id}><Link to={link.link} className="text-white transition-colors duration-300 hover:text-[#FF6F61]" onClick={() => handleClick(link.id)}>{link.name}</Link></li>
                        ))}
                    </ul>
                </div>
                <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-4">
                    <h1 className="hidden font-bold text-white sm:block">Cart</h1>
                    <button type="button" onClick={handleCartClick} aria-label={cartCount > 0 ? `Open cart, ${cartCount} items` : 'Open cart'} className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[#FF6F61] transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white">
                        <FaShoppingCart size={22} />
                        {cartCount > 0 && <span aria-label={`${cartCount} items in cart`} className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF6F61] px-1 text-[11px] font-bold leading-none text-white ring-2 ring-[#008080]">{cartCount > 99 ? '99+' : cartCount}</span>}
                    </button>
                    <button onClick={handleAuth} className="hidden rounded-full px-4 py-2 text-sm font-semibold text-white transition-colors hover:text-[#FF6F61] md:block">{user ? 'Sign out' : 'Sign in'}</button>
                    {authError && <p role="alert" className="absolute right-3 top-full mt-2 max-w-xs rounded-md bg-white px-3 py-2 text-sm font-medium text-red-700 shadow-lg">{authError}</p>}
                    <button ref={menuButtonRef} type="button" aria-label={showMenu ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={showMenu} onClick={toggleMenu} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white md:hidden">
                        {showMenu ? <HiX size={26} /> : <HiMenuAlt3 size={26} />}
                    </button>
                </div>
            </nav>
            <ResponsiveMenu showMenu={showMenu} toggleMenu={toggleMenu} links={Navlinks} />
        </>
    );
};

export default Navbar;
