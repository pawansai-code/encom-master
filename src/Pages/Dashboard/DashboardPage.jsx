import { FaBolt, FaBookOpen, FaFire, FaGamepad, FaStar, FaTools, FaTrophy, FaUserEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import HomeNavbar from '../../Components/Homepage/HomeNavbar'; // Or specific Dashboard Navbar
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


    const recentActivity = [
        { id: 1, text: "Completed 'Calculus I' Quiz", time: "2 hours ago", xp: "+50 XP" },
        { id: 2, text: "Maintained 7-day Streak", time: "Yesterday", xp: "+20 XP" },
        { id: 3, text: "Joined 'Science Club'", time: "2 days ago", xp: "" },
    ];

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
                        <Link to="/profile" className="btn btn-outline-light rounded-pill px-4">
                            <FaUserEdit className="me-2" /> Edit Profile
                        </Link>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="row g-4 mb-5 fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="col-md-4">
                        <div className="stat-card d-flex align-items-center gap-3">
                            <div className="stat-icon bg-fire">
                                <FaFire />
                            </div>
                            <div>
                                <h3 className="mb-0 fw-bold">{user.streak} Days</h3>
                                <p className="mb-0 text-secondary small">Daily Streak</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="stat-card d-flex align-items-center gap-3">
                            <div className="stat-icon bg-xp">
                                <FaStar />
                            </div>
                            <div className="w-100">
                                <div className="d-flex justify-content-between align-items-end mb-1">
                                    <h3 className="mb-0 fw-bold">{user.xp} XP</h3>
                                    <small className="text-secondary">{user.nextLevelXp - user.xp} to Level {user.level + 1}</small>
                                </div>
                                <div className="progress" style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                    <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${(user.xp / user.nextLevelXp) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="stat-card d-flex align-items-center gap-3">
                            <div className="stat-icon bg-rank">
                                <FaTrophy />
                            </div>
                            <div>
                                <h3 className="mb-0 fw-bold">{user.rank}</h3>
                                <p className="mb-0 text-secondary small">Current Rank (Lvl {user.level})</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4 fade-in-up" style={{ animationDelay: '0.2s' }}>
                    {/* Quick Actions / Hub */}
                    <div className="col-lg-8">
                        <div className="stat-card h-100">
                            <h4 className="fw-bold mb-4">Your Ninja Tools</h4>
                            <div className="row g-4">
                                <div className="col-6 col-md-6">
                                    <div className="action-card h-100">
                                        <div className="action-icon-wrapper">
                                            <FaTools className="text-info" />
                                        </div>
                                        <h5 className="fw-bold mb-1">Tools</h5>
                                        <p className="small text-secondary">Calculators & Utils</p>
                                    </div>
                                </div>
                                <div className="col-6 col-md-6">
                                    <div className="action-card h-100">
                                        <div className="action-icon-wrapper">
                                            <FaBookOpen className="text-danger" />
                                        </div>
                                        <h5 className="fw-bold mb-1">Journal</h5>
                                        <p className="small text-secondary">Track Progress</p>
                                    </div>
                                </div>
                                <div className="col-6 col-md-6">
                                    <div className="action-card h-100">
                                        <div className="action-icon-wrapper">
                                            <FaGamepad className="text-success" />
                                        </div>
                                        <h5 className="fw-bold mb-1">Games</h5>
                                        <p className="small text-secondary">Brain Training</p>
                                    </div>
                                </div>
                                <div className="col-6 col-md-6">
                                    <div className="action-card h-100">
                                        <div className="action-icon-wrapper">
                                            <FaBolt className="text-warning" />
                                        </div>
                                        <h5 className="fw-bold mb-1">Challenges</h5>
                                        <p className="small text-secondary">Daily Quests</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Leaderboard Widget & Activity Log */}
                    <div className="col-lg-4 d-flex flex-column gap-4">
                        
                        {/* Compact Leaderboard Widget */}
                        <div className="stat-card p-0 overflow-hidden text-center position-relative border-0 shadow-lg">
                            <div className="lb-widget-bg"></div>
                            <div className="p-4 position-relative z-1">
                                <div className="mb-3 d-inline-block p-3 rounded-circle bg-dark bg-opacity-50 shadow-sm border border-white border-opacity-10">
                                    <FaTrophy className="text-warning fs-1" />
                                </div>
                                <h3 className="fw-bold text-white mb-1">#42</h3>
                                <p className="text-white-50 small mb-3">Global Rank • Top 5%</p>
                                
                                <Link to="/leaderboards" className="btn btn-primary w-100 rounded-pill fw-bold" style={{ background: 'var(--gradient-btn)', border: 'none' }}>
                                    View Leaderboards
                                </Link>
                            </div>
                        </div>

                        {/* Activity Log */}
                        <div className="stat-card flex-grow-1">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-bold mb-0">Activity Log</h5>
                                <button className="btn btn-sm btn-link text-secondary text-decoration-none">View All</button>
                            </div>
                            <div className="activity-list">
                                {recentActivity.map(activity => (
                                    <div key={activity.id} className="activity-item d-flex gap-3">
                                        <div className="mt-1">
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-purple)' }}></div>
                                        </div>
                                        <div>
                                            <p className="mb-1 small fw-semibold ">{activity.text}</p>
                                            <small className="text-secondary opacity-75">{activity.time}</small>
                                        </div>
                                        {activity.xp && (
                                            <div className="ms-auto text-warning small fw-bold">{activity.xp}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
