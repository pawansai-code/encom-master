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
                { name: 'Rewards', path: '/rewards', type: 'route' },
                { name: 'Journal', path: '/journal', type: 'route' }
            ]
        },
        { 
            name: 'Productivity', 
            type: 'dropdown',
            items: [
                { name: 'Dashboard', path: '/dashboard', type: 'route' },
                { name: 'Achievements', path: '/leaderboards', type: 'route' }
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

    return (
        <nav className={`navbar navbar-expand-lg fixed-top home-navbar ${scrolled ? 'scrolled bg-black bg-opacity-75' : ''}`} style={{ transition: 'all 0.3s ease' }} data-bs-theme="dark">
            <div className="container-fluid px-4">
                <div className="navbar-brand logo-container d-flex align-items-center gap-2" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <div className="logo-text">
                        EDU<span>verse</span>
                    </div>
                    <GiNinjaHead className="home-brand-icon" />
                </div>
                
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarContent" 
                    aria-controls="navbarContent" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-center" id="navbarContent">
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
                            <span className="text-light d-none d-md-block fw-bold small me-2">
                                <span className="opacity-75">Welcome,</span> {user.name ? user.name.split(' ')[0] : 'Ninja'}
                            </span>


                        ) : (
                            <>
                                <button className="btn text-light fw-bold login-btn me-2" onClick={() => navigate('/login')}>Login</button>
                                <button className="btn rounded-pill px-4 signup-btn text-light" onClick={() => navigate('/signup')}>Sign Up</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default HomeNavbar;
