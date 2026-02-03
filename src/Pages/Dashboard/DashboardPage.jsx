import { FaLightbulb, FaUserEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import HomeNavbar from '../../Components/Homepage/HomeNavbar'; // Or specific Dashboard Navbar
import { HeatmapCalendar } from '../Journal/components/JournalComponents';
import '../Journal/styles/Journal.css';
import './styles/Dashboard.css';

import { useSelector } from 'react-redux';
import { selectUser } from '../../State/slices/userSlice';

const DashboardPage = () => {
    const userProfile = useSelector(selectUser);
    
    // Default fallback if redux state is not fully populated yet

    const user = userProfile?.data || {
        name: "Ninja Student",
        level: 1,
        xp: 0,
        nextLevelXp: 1000,
        streak: 0,
        rank: "Novice"
    };

    return (
        <div className="dashboard-container">
            <HomeNavbar />
            
            <div className="container py-4">
                {/* Welcome Header */}
                <div className="row mb-5 fade-in-up">
                    <div className="col-lg-8">
                        <h1 className="fw-bold mb-2">Welcome back, <span className="text-gradient">{user.name}</span>!</h1>
                        <p className="text-secondary fs-5">Your multiverse journey continues here.</p>
                    </div>
                    <div className="col-lg-4 text-end d-none d-lg-block">
                        <Link to="/settings" className="btn btn-outline-light rounded-pill px-4">
                            <FaUserEdit className="me-2" /> Edit Profile
                        </Link>
                    </div>
                </div>



                <div className="row g-4 fade-in-up" style={{ animationDelay: '0.2s' }}>
                    {/* Left Column: Daily Wisdom & Progress */}
                    <div className="col-lg-7 d-flex flex-column gap-4">
                        {/* Daily Wisdom Widget */}
                        <div className="stat-card position-relative overflow-hidden d-flex flex-column justify-content-center" style={{ minHeight: '220px' }}>
                            {/* Decorative Background Icon */}
                            <div style={{ position: 'absolute', top: '-10%', right: '-5%', fontSize: '10rem', opacity: '0.05', transform: 'rotate(15deg)', zIndex: 0 }}>
                                <FaLightbulb />
                            </div>
                            
                            <div className="d-flex align-items-center gap-3 mb-4 position-relative z-1">
                                <FaLightbulb className="fs-3 transition-colors" style={{ animation: 'bulb-switch 6s infinite' }} />
                                <h5 className="fw-bold mb-0 text-uppercase text-secondary tracking-wider" style={{ letterSpacing: '2px', fontSize: '0.85rem' }}>Daily Wisdom</h5>
                            </div>
                            
                            <blockquote className="blockquote mb-0 border-0 p-0 position-relative z-1">
                                <p className="fw-bold fst-italic mb-3 text-gradient lh-sm" style={{ fontSize: '1.75rem', animation: 'fadeInUp 0.8s ease-out' }}>
                                    "The expert in anything was once a beginner."
                                </p>
                                <footer className="blockquote-footer mt-4">
                                    <span className="text-white opacity-75 fst-normal border-top border-secondary border-opacity-25 pt-2 px-3 d-inline-block">
                                        Helen Hayes
                                    </span>
                                </footer>
                            </blockquote>

                            {/* Inline Styles for specific animations */}
                            <style>
                                {`
                                    @keyframes bulb-switch {
                                        0%, 10% { 
                                            color: #4a5568; /* OFF: Dark Gray */
                                            filter: none;
                                            opacity: 0.5;
                                        }
                                        12%, 14% {
                                            color: #fbbf24; /* FLICKER ON */
                                            filter: drop-shadow(0 0 5px #fbbf24);
                                            opacity: 0.8;
                                        }
                                        16% {
                                            color: #4a5568; /* FLICKER OFF */
                                            filter: none;
                                            opacity: 0.5;
                                        }
                                        20%, 85% {
                                            color: #fbbf24; /* ON: Bright Yellow + Glow */
                                            filter: drop-shadow(0 0 10px #fbbf24) drop-shadow(0 0 20px #f59e0b);
                                            opacity: 1;
                                            transform: scale(1.1);
                                        }
                                        90%, 100% { 
                                            color: #4a5568; /* OFF */
                                            filter: none;
                                            opacity: 0.5;
                                            transform: scale(1);
                                        }
                                    }
                                    @keyframes fadeInUp {
                                        from { opacity: 0; transform: translateY(20px); }
                                        to { opacity: 1; transform: translateY(0); }
                                    }
                                    

                                `}
                            </style>

                            {/* Animated Ninja Character SVG */}

                        </div>


                    </div>

                    {/* Right Column: Activity Log (Smaller now) */}
                    <div className="col-lg-5">
                        <HeatmapCalendar minimal={true} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
