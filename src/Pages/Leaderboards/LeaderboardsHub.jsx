import React, { useEffect } from 'react';
import {
    FaBook,
    FaCalendarAlt, FaCrown,
    FaFire,
    FaGamepad, FaMedal,
    FaStar,
    FaTools,
    FaTrophy,
    FaUsers
} from 'react-icons/fa';
import { GiRibbonMedal } from 'react-icons/gi';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import HomeNavbar from '../../Components/Homepage/HomeNavbar';
import { selectLeaderboard, setCategory } from '../../State/slices/leaderboardSlice';
import './Leaderboards.css';

// Configuration for all leaderboard types
const LEADERBOARD_CONFIG = [
    { id: 'overall', label: 'Overall', icon: <FaCrown />, description: 'Top ranking students across all activities', metric: 'XP' },
    { id: 'streak', label: 'Streak', icon: <FaFire />, description: 'Longest accumulated daily activity streaks', metric: 'Days' },
    { id: 'xp', label: 'XP / Level', icon: <FaStar />, description: 'Most experienced ninja learners', metric: 'XP' },
    { id: 'journal', label: 'Journal', icon: <FaBook />, description: 'Most consistent reflective writers', metric: 'Entries' },
    { id: 'tools', label: 'Tools Master', icon: <FaTools />, description: 'Most active users of productivity tools', metric: 'Uses' },
    { id: 'community', label: 'Community', icon: <FaUsers />, description: 'Top contributors to discussions and help', metric: 'Contribs' },
    { id: 'funzone', label: 'Funzone Global', icon: <FaGamepad />, description: 'Highest scores across all games', metric: 'Score' },
    { id: 'badges', label: 'Badges', icon: <FaMedal />, description: 'Most badges collected', metric: 'Badges' },
    { id: 'medals', label: 'Medals', icon: <GiRibbonMedal />, description: 'Most medals earned from challenges', metric: 'Medals' },
    { id: 'seasonal', label: 'Seasonal', icon: <FaCalendarAlt />, description: 'Top performers this season', metric: 'Points' },
];

const Podium = ({ topThree }) => {
    if (!topThree || topThree.length === 0) return null;

    // Ensure we have 3 slots even if data is missing, for layout stability (though mock data is full)
    const [first, second, third] = [topThree[0], topThree[1], topThree[2]];

    return (
        <div className="podium-section">
            <div className="podium-card rank-2">
                <FaTrophy className="crown-icon" />
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${second?.name}`} alt="Avatar" className="podium-avatar" />
                <div className="podium-name">{second?.name || 'Empty'}</div>
                <div className="podium-stat">{second?.value || 0}</div>
            </div>
            <div className="podium-card rank-1">
                <FaCrown className="crown-icon" />
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${first?.name}`} alt="Avatar" className="podium-avatar" />
                <div className="podium-name">{first?.name || 'Empty'}</div>
                <div className="podium-stat">{first?.value || 0}</div>
            </div>
            <div className="podium-card rank-3">
                <FaMedal className="crown-icon" />
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${third?.name}`} alt="Avatar" className="podium-avatar" />
                <div className="podium-name">{third?.name || 'Empty'}</div>
                <div className="podium-stat">{third?.value || 0}</div>
            </div>
        </div>
    );
};

const LeaderboardTable = ({ data, metricLabel }) => {
    return (
        <div className="leaderboard-list">
            <div className="list-header">
                <span>Rank</span>
                <span>User</span>
                <span>{metricLabel}</span>
                <span>Level</span>
            </div>
            {data.map((user) => (
                <div key={user.id} className="list-item">
                    <div className="rank-cell">
                        #{user.rank}
                        {user.change === 'up' ? (
                            <span className="trend-up trend-icon">▲</span>
                        ) : (
                            <span className="trend-down trend-icon">▼</span>
                        )}
                    </div>
                    <div className="user-cell">
                        <div className="user-avatar-small">
                            <img 
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                                alt="avatar" 
                                style={{width: '100%', borderRadius: '50%'}}
                            />
                        </div>
                        <div className="user-info">
                            <span className="user-name">{user.name}</span>
                            <span className="user-badge">Ninja Novice</span>
                        </div>
                    </div>
                    <div className="stat-cell">
                        {user.value}
                    </div>
                    <div className="level-cell">
                        Lvl {user.level}
                    </div>
                </div>
            ))}
        </div>
    );
};

const LeaderboardsHub = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Get current tab from URL or default to 'hub'
    const currentTab = searchParams.get('tab') || 'hub';

    // State data
    const activeLeaderboardData = useSelector((state) => selectLeaderboard(state, currentTab));
    const gameLeaderboardData = useSelector((state) => state.leaderboards.gameSpecific); // Access directly for now or add selector

    const [subFilter, setSubFilter] = React.useState('global');

    // Reset sub-filter when tab changes
    useEffect(() => {
        setSubFilter('global');
    }, [currentTab]);
    
    const handleTabChange = (tabId) => {
        setSearchParams({ tab: tabId });
        if (tabId !== 'hub') {
            dispatch(setCategory(tabId));
        }
    };

    // Helper to map generic value to specific field based on config
    const getProcessedData = () => {
        let rawData = activeLeaderboardData;

        // Handle Game Specific Data Override
        if (currentTab === 'funzone' && subFilter !== 'global') {
            rawData = gameLeaderboardData[subFilter] || [];
        }

        if (!rawData) return [];

        return rawData.map(user => {
            let val = user.value;
            // Override value based on type if needed, or rely on mock generator's 'value'
            if (currentTab === 'streak') val = user.streak;
            if (currentTab === 'xp') val = user.xp;
            if (currentTab === 'journal') val = user.entries;
            // ... etc
            
            return { ...user, value: val };
        }).sort((a, b) => b.value - a.value).map((u, i) => ({...u, rank: i + 1}));
    };

    const displayData = getProcessedData();
    const topThree = displayData.slice(0, 3);
    const listData = displayData.slice(3);
    const activeConfig = LEADERBOARD_CONFIG.find(c => c.id === currentTab);

    return (
        <div className="leaderboards-page">
            <HomeNavbar />
            
            <div className="leaderboards-container">
                <header className="leaderboards-header">
                    <h1 className="leaderboards-title">Leaderboards</h1>
                    <p className="leaderboards-subtitle">
                        Compare your progress with fellow ninjas in the Eduverse!
                    </p>
                </header>

                {/* Navigation Tabs */}
                <div className="leaderboard-tabs">
                    <button 
                        className={`tab-btn ${currentTab === 'hub' ? 'active' : ''}`}
                        onClick={() => handleTabChange('hub')}
                    >
                        Hub
                    </button>
                    {LEADERBOARD_CONFIG.map(tab => (
                        <button 
                            key={tab.id}
                            className={`tab-btn ${currentTab === tab.id ? 'active' : ''}`}
                            onClick={() => handleTabChange(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                {currentTab === 'hub' ? (
                    <div className="categories-grid">
                        {LEADERBOARD_CONFIG.map(cat => (
                            <div 
                                key={cat.id} 
                                className="category-card"
                                onClick={() => handleTabChange(cat.id)}
                            >
                                <div className="category-icon">{cat.icon}</div>
                                <div className="category-title">{cat.label}</div>
                                <div className="category-desc">{cat.description}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="leaderboard-view animate-fade-in">
                        {/* Sub-filters for Funzone */}
                        {currentTab === 'funzone' && (
                            <div className="d-flex justify-content-center gap-2 mb-4">
                                <button 
                                    className={`btn btn-sm ${subFilter === 'global' ? 'btn-primary' : 'btn-outline-light'}`}
                                    onClick={() => setSubFilter('global')}
                                >
                                    Global
                                </button>
                                <button 
                                    className={`btn btn-sm ${subFilter === 'game-1' ? 'btn-primary' : 'btn-outline-light'}`}
                                    onClick={() => setSubFilter('game-1')}
                                >
                                    Snake
                                </button>
                                <button 
                                    className={`btn btn-sm ${subFilter === 'game-2' ? 'btn-primary' : 'btn-outline-light'}`}
                                    onClick={() => setSubFilter('game-2')}
                                >
                                    Trivia
                                </button>
                            </div>
                        )}

                        <Podium topThree={topThree} />
                        <LeaderboardTable 
                            data={listData} 
                            metricLabel={activeConfig?.metric || 'Score'} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaderboardsHub;
