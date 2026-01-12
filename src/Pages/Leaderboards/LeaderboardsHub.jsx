import { useState } from 'react';
import { FaCrown, FaGamepad, FaMedal, FaTrophy, FaUserAstronaut } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import HomeNavbar from '../../Components/Homepage/HomeNavbar';

const LeaderboardsHub = () => {
    const [searchParams] = useSearchParams();
    const initialTab = searchParams.get('tab') || 'global';
    const [activeTab, setActiveTab] = useState(initialTab);

    // Mock Data for demonstration
    const mockLeaderboard = [
        { rank: 1, name: "Ninja Master", xp: 15000, badge: "legend" },
        { rank: 2, name: "Code Wizard", xp: 14200, badge: "diamond" },
        { rank: 3, name: "Pixel Artist", xp: 12800, badge: "gold" },
        { rank: 4, name: "Edu Explorer", xp: 11000, badge: "silver" },
        { rank: 5, name: "Quiz Whiz", xp: 9500, badge: "bronze" },
    ];

    const getRankIcon = (rank) => {
        switch(rank) {
            case 1: return <FaCrown className="text-warning" size={24} />;
            case 2: return <FaMedal className="text-secondary" size={24} />; // Silverish
            case 3: return <FaMedal className="text-danger" size={24} />; // Bronzeish
            default: return <span className="fw-bold text-secondary">#{rank}</span>;
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white' }}>
            <HomeNavbar />
            
            <div className="container py-5 mt-5">
                <div className="text-center mb-5 fade-in-up">
                    <h1 className="display-4 fw-bold">
                        <span className="text-gradient">Leaderboards</span> <FaTrophy className="text-warning" />
                    </h1>
                    <p className="lead text-secondary">See who's topping the charts in Eduverse!</p>
                </div>

                {/* Tabs */}
                <div className="d-flex justify-content-center gap-3 mb-5">
                    <button 
                        className={`btn rounded-pill px-4 ${activeTab === 'global' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setActiveTab('global')}
                    >
                         <FaTrophy className="me-2" /> Global
                    </button>
                    <button 
                        className={`btn rounded-pill px-4 ${activeTab === 'funzone' ? 'btn-warning text-dark' : 'btn-outline-secondary'}`}
                        onClick={() => setActiveTab('funzone')}
                    >
                         <FaGamepad className="me-2" /> Funzone
                    </button>
                </div>

                {/* Leaderboard List */}
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card bg-dark border-secondary shadow-lg">
                            <div className="card-header border-secondary bg-transparent p-3">
                                <h4 className="mb-0 text-light"><FaTrophy className="me-2 text-warning" /> Top Players</h4>
                            </div>
                            <div className="list-group list-group-flush">
                                {mockLeaderboard.map((user) => (
                                    <div key={user.rank} className="list-group-item bg-transparent border-secondary text-light d-flex align-items-center p-3 hover-effect">
                                        <div className="me-4" style={{ width: '40px', textAlign: 'center' }}>
                                            {getRankIcon(user.rank)}
                                        </div>
                                        <div className="d-flex align-items-center flex-grow-1">
                                            <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center me-3" style={{ width: '45px', height: '45px' }}>
                                                <FaUserAstronaut size={24} />
                                            </div>
                                            <div>
                                                <h5 className="mb-0 fw-bold">{user.name}</h5>
                                                <small className="text-secondary">Rank {user.badge}</small>
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <h5 className="mb-0 text-primary fw-bold">{user.xp.toLocaleString()} XP</h5>
                                        </div>
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

export default LeaderboardsHub;
