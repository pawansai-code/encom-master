import { useState } from 'react';
import { FaAward, FaCalendarCheck, FaCoins, FaEdit, FaFire, FaMedal, FaPlus, FaSave } from 'react-icons/fa';

const StreakRewardManagement = () => {
    const [activeTab, setActiveTab] = useState('streaks'); // streaks, rewards, badges

    // Mock Data
    const [streakSettings, setStreakSettings] = useState({
        loginMultiplier: 1.5,
        gracePeriod: 24, // hours
        recoveryCost: 100, // coins
        streakFreezeLimit: 2
    });

    const [badges, setBadges] = useState([
        { id: 1, name: 'Night Owl', type: 'Special', icon: '🦉' },
        { id: 2, name: 'Math Whiz', type: 'Academic', icon: '➗' },
        { id: 3, name: 'Login Legend', type: 'Streak', icon: '🔥' }
    ]);

    const handleStreakChange = (e) => {
        setStreakSettings({...streakSettings, [e.target.name]: e.target.value});
    };

    return (
        <div className="admin-view">
            <header className="view-header mb-4">
                <h2 className="view-title">Streaks & Rewards</h2>
                <div className="view-actions">
                    <button 
                        className={`btn btn-sm ${activeTab === 'streaks' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setActiveTab('streaks')}
                    >
                        <FaFire /> Streaks & XP
                    </button>
                    <button 
                        className={`btn btn-sm ${activeTab === 'rewards' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setActiveTab('rewards')}
                    >
                         <FaMedal /> Badges & Shop
                    </button>
                </div>
            </header>

            {activeTab === 'streaks' && (
                <div className="row g-4">
                    <div className="col-md-6">
                        <div className="admin-card h-100">
                            <h4 className="text-white mb-3 d-flex align-items-center gap-2">
                                <FaCalendarCheck className="text-warning" /> Streak Configuration
                            </h4>
                            <div className="mb-3">
                                <label className="form-label text-muted">XP Multiplier (per day)</label>
                                <input 
                                    type="number" 
                                    name="loginMultiplier"
                                    className="form-control bg-dark text-white border-secondary"
                                    value={streakSettings.loginMultiplier}
                                    onChange={handleStreakChange}
                                    step="0.1"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-muted">Grace Period (Hours)</label>
                                <input 
                                    type="number" 
                                    name="gracePeriod"
                                    className="form-control bg-dark text-white border-secondary"
                                    value={streakSettings.gracePeriod}
                                    onChange={handleStreakChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-muted">Streak Recovery Cost (Coins)</label>
                                <input 
                                    type="number" 
                                    name="recoveryCost"
                                    className="form-control bg-dark text-white border-secondary"
                                    value={streakSettings.recoveryCost}
                                    onChange={handleStreakChange}
                                />
                            </div>
                            <button className="btn btn-success w-100 mt-2">
                                <FaSave /> Save Settings
                            </button>
                        </div>
                    </div>

                    <div className="col-md-6">
                         <div className="admin-card h-100">
                            <h4 className="text-white mb-3 d-flex align-items-center gap-2">
                                <FaCoins className="text-warning" /> XP & Economy
                            </h4>
                            <div className="alert alert-info bg-opacity-10 border-info text-info">
                                Global XP rates affect all users immediately.
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-2 p-2 bg-dark rounded border border-secondary">
                                <span>Double XP Weekend</span>
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" />
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-2 p-2 bg-dark rounded border border-secondary">
                                <span>Game Rewards Boost (1.5x)</span>
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" defaultChecked />
                                </div>
                            </div>
                         </div>
                    </div>
                </div>
            )}

            {activeTab === 'rewards' && (
                <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="text-white">Badge Library</h4>
                        <button className="btn btn-primary btn-sm">
                            <FaPlus /> Create Badge
                        </button>
                    </div>
                    
                    <div className="row g-3">
                        {badges.map(badge => (
                            <div key={badge.id} className="col-md-3">
                                <div className="admin-card text-center p-3 hover-effect">
                                    <div className="display-4 mb-2">{badge.icon}</div>
                                    <h5 className="text-white mb-1">{badge.name}</h5>
                                    <span className="badge bg-secondary mb-3">{badge.type}</span>
                                    <div className="d-flex justify-content-center gap-2">
                                        <button className="btn btn-sm btn-outline-light"><FaEdit /></button>
                                        <button className="btn btn-sm btn-outline-danger"><FaAward /></button> 
                                    </div>
                                    <small className="d-block mt-2 text-muted">Assign Manually</small>
                                </div>
                            </div>
                        ))}
                        <div className="col-md-3">
                            <div className="admin-card text-center p-3 border-dashed h-100 d-flex flex-column justify-content-center align-items-center text-muted" style={{borderStyle: 'dashed', cursor: 'pointer'}}>
                                <FaPlus size={24} className="mb-2" />
                                <span>Upload New Asset</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StreakRewardManagement;
