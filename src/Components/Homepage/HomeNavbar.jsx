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

    const navItems = [
        { name: 'Home', id: 'home', type: 'scroll' },
        { name: 'About', id: 'about', type: 'route', path: '/about' }, 
        { name: 'Tools', id: 'tools', type: 'route', path: '/tools' },
        { name: 'Community', id: 'features', type: 'scroll' }, 
        { name: 'Fun Zone', id: 'funzone', type: 'route', path: '/funzone' },
        { name: 'Journal', id: 'journal', type: 'route', path: '/journal' }, 
        { name: 'Rewards', id: 'rewards', type: 'route', path: '/rewards' },
        { name: 'Dashboard', id: 'dashboard', type: 'route', path: '/dashboard' },
        { name: 'Contact', id: 'contact', type: 'route', path: '/contact' },
        { name: 'Settings', id: 'settings', type: 'route', path: '/settings' }
    ];

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

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/');
    };

    const handleNavClick = (item) => {
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
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-4">
                        {navItems.map((item) => (
                            <li key={item.name} className="nav-item">
                                <a 
                                    className={`nav-link ${activePage === item.name.toLowerCase() ? 'active' : ''}`}
                                    onClick={() => handleNavClick(item)}
                                    style={{cursor: 'pointer'}}
                                >
                                    {item.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="d-flex auth-buttons align-items-center gap-2">
                        {user ? (
                            <>
                                <span className="text-light d-none d-md-block fw-bold small me-2">Hi, {user.name ? user.name.split(' ')[0] : 'Ninja'}</span>
                                <button className="btn text-light fw-bold login-btn" onClick={handleLogout}>Logout</button>
                            </>
                        ) : (
                            <>
                                <button className="btn text-light fw-bold login-btn me-2" onClick={() => navigate('/auth/login')}>Login</button>
                                <button className="btn rounded-pill px-4 signup-btn text-light" onClick={() => navigate('/auth/signup')}>Sign Up</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default HomeNavbar;
