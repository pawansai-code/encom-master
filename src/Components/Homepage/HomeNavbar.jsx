import { useEffect, useState } from 'react';
import { GiNinjaHead } from 'react-icons/gi';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../Pages/Homepage/styles/Homepage.css';
import { setActivePage } from '../../State/slices/appSlice';
import { logoutUser, selectUser } from '../../State/slices/userSlice';


const HomeNavbar = () => {
    const dispatch = useDispatch();
    const activePage = useSelector((state) => state.app.activePage);
    const user = useSelector(selectUser);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/');
    };

    // Navigation Structure
    const baseNavItems = [
        { name: 'Home', id: 'home', type: 'scroll' },
        { 
            name: 'Explore', 
            type: 'dropdown',
            items: [
                { name: 'About', path: '/about', type: 'route' },
                { name: 'Tools', path: '/tools', type: 'route' },
                { name: 'Fun Zone', path: '/funzone', type: 'route' }
            ]
        },
        { 
            name: 'Community', 
            type: 'dropdown',
            items: [
                { name: 'Community', id: 'features', type: 'scroll' },
                { name: 'Journal', path: '/journal', type: 'route' }
            ]
        },
        { 
            name: 'Productivity', 
            type: 'dropdown',
            items: [
                { name: 'Dashboard', path: '/dashboard', type: 'route' },
                { name: 'Achievements', path: '/achievements', type: 'route' }
            ]
        }
    ];

    // Conditional Account Dropdown
    if (user) {
        baseNavItems.push({
            name: 'Account',
            type: 'dropdown',
            items: [
                { name: 'Profile', path: '/settings', type: 'route' },
                { name: 'Settings', path: '/settings', type: 'route' },
                { name: 'Logout', action: handleLogout, type: 'action' }
            ]
        });
    }

    // Add Contact last
    baseNavItems.push({ name: 'Contact', path: '/contact', type: 'route' });

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrolled]);



    const handleNavClick = (item) => {
        if (item.type === 'action' && item.action) {
            item.action();
            return;
        }

        dispatch(setActivePage(item.name.toLowerCase()));
        
        if (item.type === 'route') {
            navigate(item.path);
            return;
        }

        if (location.pathname !== '/') {
            navigate('/');
            // Optional: Store target ID in location state to scroll after semantic nav
            return;
        }

        if (item.id) {
            const element = document.getElementById(item.id);
            if (element) {
                const headerOffset = 80;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        }
    };

    // Toggle Mobile Menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        // Prevent background scrolling when menu is open
        document.body.style.overflow = !isMenuOpen ? 'hidden' : 'unset';
    };

    const handleMobileNavClick = (item) => {
        handleNavClick(item);
        toggleMenu();
    };

    return (
        <>
            <nav className={`navbar navbar-expand-lg fixed-top home-navbar ${scrolled ? 'scrolled' : ''}`} data-bs-theme="dark">
                <div className="container-fluid px-4">
                    {/* Brand */}
                    <div className="navbar-brand logo-container d-flex align-items-center gap-2" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="logo-text">
                            EDU<span>verse</span>
                        </div>
                        <GiNinjaHead className="home-brand-icon" />
                    </div>
                    
                    {/* Desktop Menu - Hidden on Mobile */}
                    <div className="collapse navbar-collapse justify-content-center d-none d-lg-flex" id="navbarContent">
                        <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-4 align-items-center">
                            {baseNavItems.map((item, index) => (
                                item.type === 'dropdown' ? (
                                    <li key={index} className="nav-item dropdown">
                                        <a 
                                            className="nav-link dropdown-toggle" 
                                            href="#" 
                                            role="button" 
                                            data-bs-toggle="dropdown" 
                                            aria-expanded="false"
                                        >
                                            {item.name}
                                        </a>
                                        <ul className="dropdown-menu">
                                            {item.items.map((subItem, subIndex) => (
                                                <li key={subIndex}>
                                                    <button 
                                                        className="dropdown-item" 
                                                        onClick={() => handleNavClick(subItem)}
                                                    >
                                                        {subItem.name}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ) : (
                                    <li key={index} className="nav-item">
                                        <a 
                                            className={`nav-link ${activePage === item.name.toLowerCase() ? 'active' : ''}`}
                                            onClick={() => handleNavClick(item)}
                                            style={{cursor: 'pointer'}}
                                        >
                                            {item.name}
                                        </a>
                                    </li>
                                )
                            ))}
                        </ul>
                        <div className="d-flex auth-buttons align-items-center gap-2">
                            {user ? (
                                <span className="text-light fw-bold small me-2">
                                    <span className="opacity-75">Welcome,</span> {user.name ? user.name.split(' ')[0] : 'Ninja'}
                                </span>
                            ) : (
                                <>
                                    <button className="btn text-light fw-bold login-btn me-2" onClick={() => navigate('/auth/login')}>Login</button>
                                    <button className="btn rounded-pill px-4 signup-btn text-light" onClick={() => navigate('/auth/signup')}>Sign Up</button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Custom Mobile Toggler */}
                    <button 
                        className={`mobile-menu-toggle d-lg-none ${isMenuOpen ? 'open' : ''}`}
                        onClick={toggleMenu}
                        aria-label="Toggle navigation"
                    >
                        <span className="bar top"></span>
                        <span className="bar middle"></span>
                        <span className="bar bottom"></span>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-container">
                    <ul className="mobile-nav-list">
                        {baseNavItems.map((item, index) => (
                            <li key={index} className="mobile-nav-item" style={{ animationDelay: `${0.1 + (index * 0.1)}s` }}>
                                {item.type === 'dropdown' ? (
                                    <div className="mobile-dropdown-group">
                                        <span className="mobile-nav-category">{item.name}</span>
                                        <div className="mobile-sub-menu">
                                            {item.items.map((subItem, subIndex) => (
                                                <button 
                                                    key={subIndex}
                                                    className="mobile-nav-link sub-link"
                                                    onClick={() => handleMobileNavClick(subItem)}
                                                >
                                                    {subItem.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <button 
                                        className={`mobile-nav-link ${activePage === item.name.toLowerCase() ? 'active' : ''}`}
                                        onClick={() => handleMobileNavClick(item)}
                                    >
                                        {item.name}
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>

                    <div className="mobile-auth-section" style={{ animationDelay: '0.6s' }}>
                        {user ? (
                             <div className="text-center">
                                <p className="text-light mb-3">Signed in as <strong>{user.name}</strong></p>
                                {/* Account actions are already in the dropdown above, but we can add logout here explicitly if needed */}
                             </div>
                        ) : (
                            <div className="d-flex flex-column gap-3 w-100 px-4">
                                <button className="login-btn w-100" onClick={() => { navigate('/auth/login'); toggleMenu(); }}>Login</button>
                                <button className="signup-btn w-100" onClick={() => { navigate('/auth/signup'); toggleMenu(); }}>Sign Up</button>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Background Blobs for Visual Flair */}
                <div className="mobile-menu-bg-blob blob-1"></div>
                <div className="mobile-menu-bg-blob blob-2"></div>
            </div>
        </>
    );
};

export default HomeNavbar;
