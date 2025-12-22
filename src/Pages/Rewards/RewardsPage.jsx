import { FaCoins, FaCrown, FaStar, FaTrophy, FaUserNinja } from 'react-icons/fa';
import { GiRibbonMedal, GiTwoCoins } from 'react-icons/gi';
import { useSelector } from 'react-redux';
import HomeNavbar from '../../Components/Homepage/HomeNavbar';
import { selectRewards } from '../../State/slices/rewardsSlice';
import { selectUser } from '../../State/slices/userSlice';
import './RewardsPage.css';

const RewardsPage = () => {
    // Select data from Redux store
    const rewards = useSelector(selectRewards);
    // Fallback if userSlice doesn't have name/avatar yet
    const user = useSelector(selectUser) || { name: 'Student', avatar: null };

    const getProgressWidth = () => {
        if (!rewards || !rewards.nextLevelXp) return 0;
        return (rewards.xp / rewards.nextLevelXp) * 100;
    };

    if (!rewards) {
        return (
            <div className="rewards-page d-flex justify-content-center align-items-center">
                <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="rewards-page">
            <HomeNavbar />
            
            <div className="rewards-container fade-in-up">
                <header className="rewards-header">
                    <h1 className="rewards-title">Rewards Center</h1>
                    <p className="rewards-subtitle">Collect badges, earn medals, and level up your ninja journey!</p>
                </header>

                <div className="rewards-grid">
                    {/* XP & Level Progress Section */}
                    <div className="rewards-card progress-section">
                        <div className="card-header border-0 pb-0">
                            <div className="card-title">
                                <FaStar className="text-warning" /> Level {rewards.level} Progress
                            </div>
                            <div className="level-badge">Lvl {rewards.level}</div>
                        </div>
                        <div className="xp-bar-container">
                            <div 
                                className="xp-bar-fill" 
                                style={{ width: `${getProgressWidth()}%` }}
                            ></div>
                        </div>
                        <div className="xp-text">
                            <span>{rewards.xp} XP</span>
                            <span>{rewards.nextLevelXp} XP to next level</span>
                        </div>
                    </div>

                    {/* Wallet Section: Coins & Points */}
                    <div className="rewards-card wallet-section">
                        <div className="card-header">
                            <span className="card-title"><GiTwoCoins /> Wallet</span>
                        </div>
                        <div className="currency-item">
                            <div className="d-flex align-items-center gap-3">
                                <span className="currency-icon text-warning"><FaCoins /></span>
                                <span className="text-secondary fw-bold">Coins</span>
                            </div>
                            <span className="currency-amount text-warning">{rewards.coins.toLocaleString()}</span>
                        </div>
                        <div className="currency-item">
                            <div className="d-flex align-items-center gap-3">
                                <span className="currency-icon text-info"><FaStar /></span>
                                <span className="text-secondary fw-bold">Points</span>
                            </div>
                            <span className="currency-amount text-info">{rewards.points.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Badges Collection */}
                    <div className="rewards-card badges-section">
                        <div className="card-header">
                            <span className="card-title"><FaUserNinja /> Badges Collection</span>
                        </div>
                        
                        <div className="mb-3">
                            <h6 className="text-secondary mb-2 small text-uppercase fw-bold">Ninja Badges (Boys)</h6>
                            <div className="badges-grid mb-4">
                                {rewards.badges.filter(b => b.type === 'boys').map(badge => (
                                    <div key={badge.id} className={`badge-item ninja ${!badge.unlocked ? 'locked' : ''}`} title={badge.description}>
                                        <div className="badge-icon">{badge.icon}</div>
                                        <span className="badge-name">{badge.name}</span>
                                    </div>
                                ))}
                            </div>

                            <h6 className="text-secondary mb-2 small text-uppercase fw-bold">Cute Badges (Girls)</h6>
                            <div className="badges-grid">
                                {rewards.badges.filter(b => b.type === 'girls').map(badge => (
                                    <div key={badge.id} className={`badge-item cute ${!badge.unlocked ? 'locked' : ''}`} title={badge.description}>
                                        <div className="badge-icon">{badge.icon}</div>
                                        <span className="badge-name">{badge.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Medals Gallery */}
                    <div className="rewards-card medals-section">
                        <div className="card-header">
                            <span className="card-title"><GiRibbonMedal /> Medals Gallery</span>
                        </div>
                        <div className="medals-display">
                            {rewards.medals.map(medal => (
                                <div key={medal.id} className="medal-spot">
                                    <div className="medal-icon">{medal.icon}</div>
                                    <div className="medal-count">{medal.count}</div>
                                    <div className="mt-2 small fw-bold text-secondary">{medal.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Titles Page */}
                    <div className="rewards-card titles-section">
                        <div className="card-header">
                            <span className="card-title"><FaCrown /> Titles</span>
                        </div>
                        <div className="titles-list">
                            {rewards.titles.map(title => (
                                <div key={title.id} className={`title-item ${title.active ? 'active-title' : ''}`}>
                                    <div className="d-flex align-items-center gap-2">
                                        <span className={`title-name ${title.active ? 'text-white' : 'text-secondary'}`}>
                                            {title.name}
                                        </span>
                                        {title.active && <span className="badge bg-success small">Equipped</span>}
                                        {!title.unlocked && <span className="badge bg-secondary small">Locked</span>}
                                    </div>
                                    {title.unlocked && !title.active && (
                                        <button className="equip-btn">Equip</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Optional: Redeem Rewards Placeholder */}
                    <div className="rewards-card" style={{ gridColumn: 'span 12' }}>
                        <div className="card-header">
                            <span className="card-title"><FaTrophy /> Redeem Rewards</span>
                        </div>
                        <div className="text-center py-4 text-secondary">
                            <p className="mb-3">Exchange your hard-earned coins for exclusive customization items!</p>
                            <button className="btn btn-primary" style={{ background: 'var(--reward-gradient)', border: 'none' }}>
                                Visit Shop (Coming Soon)
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RewardsPage;
