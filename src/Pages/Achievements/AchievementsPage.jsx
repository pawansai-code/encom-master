import { useState } from 'react';
import { FaBolt, FaBook, FaCode, FaCrown, FaFire, FaGem, FaMedal, FaRocket, FaShieldAlt, FaStar } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import HomeNavbar from '../../Components/Homepage/HomeNavbar';
import { addAchievement, selectUser } from '../../State/slices/userSlice';
import './Achievements.css';

const AVAILABLE_STICKERS = [
    { id: 'star_student', name: 'Star Student', icon: FaStar, color: '#FFD700' },
    { id: 'code_ninja', name: 'Code Ninja', icon: FaCode, color: '#00FF00' },
    { id: 'quiz_master', name: 'Quiz Master', icon: FaCrown, color: '#9d4edd' },
    { id: 'fast_learner', name: 'Fast Learner', icon: FaBolt, color: '#FF4500' },
    { id: 'bookworm', name: 'Bookworm', icon: FaBook, color: '#4ade80' },
    { id: 'on_fire', name: 'On Fire', icon: FaFire, color: '#FF0000' },
    { id: 'gem_collector', name: 'Gem Collector', icon: FaGem, color: '#00FFFF' },
    { id: 'shield_bearer', name: 'Defender', icon: FaShieldAlt, color: '#708090' },
    { id: 'rocket_science', name: 'Innovator', icon: FaRocket, color: '#FF1493' },
    { id: 'champion', name: 'Champion', icon: FaMedal, color: '#FFD700' },
];

// Mock Users for Admin to select
const MOCK_USERS = [
    { id: 'u1', name: 'Ninja Student', email: 'student@eduverse.com' },
    { id: 'u2', name: 'Alice Wonder', email: 'alice@example.com' },
    { id: 'u3', name: 'Bob Builder', email: 'bob@example.com' },
];

const AchievementsPage = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(selectUser);
    
    // Admin State
    const [selectedUser, setSelectedUser] = useState(MOCK_USERS[0].id);
    const [selectedSticker, setSelectedSticker] = useState(null);

    const isAdmin = currentUser?.role === 'admin';

    // Get achievements from user profile
    // Note: In a real app we'd fetch this. We assume user.data.achievements exists
    const myAchievements = currentUser?.data?.achievements || [];

    const handleAwardSticker = () => {
        if (!selectedSticker) {
            alert("Please select a sticker first!");
            return;
        }

        const stickerDetails = AVAILABLE_STICKERS.find(s => s.id === selectedSticker);
        
        // Dispatch action to add sticker (to Redux state for demo)
        dispatch(addAchievement({
            userId: selectedUser, // In a real app, this would target the specific user
            achievement: {
                id: Date.now(), // unique ID for this instance
                stickerId: selectedSticker,
                name: stickerDetails.name,
                date: new Date().toISOString(),
                awardedBy: currentUser.name
            }
        }));

        alert(`Awarded ${stickerDetails.name} to User ID: ${selectedUser}`);
        setSelectedSticker(null);
    };

    return (
        <div className="achievements-container">
            <HomeNavbar />
            
            <header className="achievements-header">
                <h1 className="page-title">Achievements</h1>
                <p className="page-subtitle">Collect stickers and showcase your journey!</p>
            </header>

            {/* Admin Panel */}
            {isAdmin && (
                <div className="admin-panel">
                    <div className="admin-header">
                        <h2>🏆 Award Stickers</h2>
                        <span className="badge bg-primary">Admin Access</span>
                    </div>

                    <div className="form-group">
                        <label style={{color: '#ccc', marginBottom: '10px', display: 'block'}}>Select Student</label>
                        <select 
                            className="user-selector form-select bg-dark text-light border-secondary"
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                        >
                            {MOCK_USERS.map(u => (
                                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                            ))}
                        </select>
                    </div>

                    <label style={{color: '#ccc', marginBottom: '10px', display: 'block'}}>Choose Sticker</label>
                    <div className="sticker-selector">
                        {AVAILABLE_STICKERS.map(sticker => (
                            <div 
                                key={sticker.id}
                                className={`select-sticker-btn ${selectedSticker === sticker.id ? 'selected' : ''}`}
                                onClick={() => setSelectedSticker(sticker.id)}
                            >
                                <sticker.icon className="icon" style={{color: sticker.color}} />
                                <span>{sticker.name}</span>
                            </div>
                        ))}
                    </div>

                    <button className="award-btn" onClick={handleAwardSticker}>
                        Award Sticker
                    </button>
                </div>
            )}

            {/* User Collection */}
            <div className="user-collection">
                <h3 className="mb-4 ps-3 border-start border-4 border-danger">My Sticker Collection</h3>
                
                {myAchievements.length === 0 ? (
                    <div className="empty-state">
                        <FaStar size={50} className="mb-3 opacity-50" />
                        <h3>No achievements yet!</h3>
                        <p>Keep learning and participating to earn stickers.</p>
                        {/* Demo/fallback entry if needed */}
                    </div>
                ) : (
                    <div className="stickers-grid">
                        {myAchievements.map((ach) => {
                            const config = AVAILABLE_STICKERS.find(s => s.id === ach.stickerId) || AVAILABLE_STICKERS[0];
                            const Icon = config.icon;
                            return (
                                <div key={ach.id} className="sticker-card">
                                    <Icon className="sticker-icon" style={{color: config.color}} />
                                    <div className="sticker-name">{ach.name}</div>
                                    <div className="sticker-date">{new Date(ach.date).toLocaleDateString()}</div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AchievementsPage;
