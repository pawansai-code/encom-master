import { useEffect } from 'react';
import { FaBook, FaGamepad, FaSignInAlt, FaTools, FaUsers } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import HomeNavbar from '../../Components/Homepage/HomeNavbar';
import { updateStreak } from '../../State/slices/streakSlice';
import { CombinedScoreHero, StreakCard, StreakHeatmap } from './components/StreakComponents';
import './styles/Streaks.css';

const StreaksPage = () => {
    const dispatch = useDispatch();
    const streaks = useSelector(state => state.streaks);
    
    // Simulate updating login streak on mount
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        dispatch(updateStreak({ type: 'login', date: today }));
    }, [dispatch]);

    const categories = [
        { id: 'login', title: 'Daily Login', icon: <FaSignInAlt />, color: '#4ade80' },
        { id: 'tools', title: 'Tool Master', icon: <FaTools />, color: '#3b82f6' },
        { id: 'journal', title: 'Journaling', icon: <FaBook />, color: '#f472b6' },
        { id: 'funzone', title: 'Game Champion', icon: <FaGamepad />, color: '#a855f7' },
        { id: 'community', title: 'Community', icon: <FaUsers />, color: '#f59e0b' },
    ];

    return (
        <div className="streaks-container">
            <HomeNavbar />
            
            <div className="container py-5 mt-5">
                <div className="streaks-header text-center mb-5 fade-in-up">
                    <h1 className="display-4 text-gradient mb-3">Streak Dashboard</h1>
                    <p className="lead text-secondary">Consistency is the key to mastery.</p>
                </div>

                {/* Combined Score Hero */}
                <div className="row justify-content-center mb-5">
                    <div className="col-lg-8">
                        <CombinedScoreHero score={streaks.combinedScore} />
                    </div>
                </div>

                {/* Streak Cards Grid */}
                <div className="row g-4 mb-5">
                    {categories.map((cat, index) => {
                        const data = streaks[cat.id];
                        return (
                            <div key={cat.id} className="col-md-6 col-lg-4 col-xl-2p4 fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                <StreakCard 
                                    title={cat.title}
                                    icon={cat.icon}
                                    color={cat.color}
                                    streak={data.current}
                                    longest={data.longest}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Heatmap & History */}
                <div className="row fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <div className="col-12">
                        <StreakHeatmap />
                    </div>
                </div>

                {/* Optional Comparison / Leaderboard Teaser */}
                <div className="row mt-5 fade-in-up" style={{ animationDelay: '0.5s' }}>
                    <div className="col-12">
                        <div className="streak-card">
                            <h5 className="fw-bold mb-4">Top Streaks This Week</h5>
                            <div className="table-responsive">
                                <table className="comparison-table text-light">
                                    <thead>
                                        <tr>
                                            <th>Rank</th>
                                            <th>User</th>
                                            <th>Total Score</th>
                                            <th>Longest Streak</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><span className="rank-badge rank-1">1</span></td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="bg-primary rounded-circle" style={{width: 30, height: 30}}></div>
                                                    <span>NinjaMaster99</span>
                                                </div>
                                            </td>
                                            <td className="fw-bold text-accent-pink">12,450</td>
                                            <td>Login (145 days)</td>
                                            <td><span className="badge bg-success">Online</span></td>
                                        </tr>
                                        <tr>
                                            <td><span className="rank-badge rank-2">2</span></td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="bg-info rounded-circle" style={{width: 30, height: 30}}></div>
                                                    <span>CodeWizard</span>
                                                </div>
                                            </td>
                                            <td className="fw-bold text-accent-pink">11,200</td>
                                            <td>Tools (98 days)</td>
                                            <td><span className="badge bg-secondary">Away</span></td>
                                        </tr>
                                        <tr>
                                            <td><span className="rank-badge rank-3">3</span></td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="bg-warning rounded-circle" style={{width: 30, height: 30}}></div>
                                                    <span>PixelArtist</span>
                                                </div>
                                            </td>
                                            <td className="fw-bold text-accent-pink">9,850</td>
                                            <td>Journal (50 days)</td>
                                            <td><span className="badge bg-success">Online</span></td>
                                        </tr>
                                        {/* Current User Row */}
                                        <tr style={{ background: 'rgba(255, 107, 107, 0.1)', borderLeft: '3px solid #ff6b6b' }}>
                                            <td>42</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="bg-danger rounded-circle" style={{width: 30, height: 30}}></div>
                                                    <span>You</span>
                                                </div>
                                            </td>
                                            <td className="fw-bold text-white">{streaks.combinedScore.toLocaleString()}</td>
                                            <td>Login ({streaks.login.longest} days)</td>
                                            <td><span className="badge bg-success">Active</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StreaksPage;
