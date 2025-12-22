import { FaCalendarCheck, FaFire, FaTrophy } from 'react-icons/fa';

export const StreakCard = ({ title, streak, longest, icon, color }) => {
    return (
        <div className="streak-card h-100">
            <div className="d-flex justify-content-between align-items-start">
                <div className="card-icon-wrapper" style={{ color: color, background: `${color}20` }}>
                    {icon}
                </div>
                <div className={`streak-ring ${streak > 0 ? 'streak-active' : ''}`} style={{ borderColor: streak > 0 ? color : '' }}>
                    <FaFire size={20} color={streak > 0 ? color : '#ffffff20'} />
                </div>
            </div>
            
            <div className="mt-2">
                <h3 className="streak-counter mb-0" style={{ color: streak > 0 ? 'white' : '#ffffff50' }}>{streak}</h3>
                <p className="streak-label mb-3">Current Streak</p>
                
                <div className="d-flex align-items-center gap-2 text-secondary small">
                    <FaTrophy size={12} className="text-warning" />
                    <span>Best: <strong className="text-light">{longest}</strong> days</span>
                </div>
                
                <h5 className="mt-3 fs-6 fw-bold" style={{ color: 'rgba(255,255,255,0.8)' }}>{title}</h5>
            </div>
        </div>
    );
};

export const StreakHeatmap = ({ data }) => {
    // Generate simple heatmap data visualization
    // Since we don't have full year data, we'll simulate a "year" layout with generic filled cells
    // In a real app, 'data' would be the history map from Redux slice
    
    // Mock 52 weeks * 7 days
    const totalDays = 364; 
    const cells = Array.from({ length: totalDays }).map((_, i) => {
        // Randomly fill some cells to look active
        const isActive = Math.random() > 0.7;
        const intensity = isActive ? Math.ceil(Math.random() * 3) : 0;
        return intensity;
    });

    return (
        <div className="streak-card">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0"><FaCalendarCheck className="me-2 text-primary" />Activity History</h5>
                <select className="form-select bg-transparent text-light border-secondary w-auto py-1 px-3 d-none d-md-block">
                    <option>2024</option>
                </select>
            </div>
            
            <div className="streak-heatmap-grid" style={{ gridTemplateColumns: 'repeat(52, 1fr)' }}>
                {cells.map((intensity, i) => (
                    <div 
                        key={i} 
                        className={`streak-cell ${intensity > 0 ? `active-${intensity}` : ''}`}
                        title={`Day ${i + 1}`}
                    />
                ))}
            </div>
            
            <div className="d-flex justify-content-end gap-3 mt-3 align-items-center small text-secondary">
                <span>Less</span>
                <div className="d-flex gap-1">
                    <div className="streak-cell" style={{ width: 12, height: 12 }}></div>
                    <div className="streak-cell active-1" style={{ width: 12, height: 12 }}></div>
                    <div className="streak-cell active-2" style={{ width: 12, height: 12 }}></div>
                    <div className="streak-cell active-3" style={{ width: 12, height: 12 }}></div>
                </div>
                <span>More</span>
            </div>
        </div>
    );
};

export const CombinedScoreHero = ({ score }) => {
    return (
        <div className="score-hero mb-4 fade-in-up">
            <h2 className="text-light opacity-75 mb-3 text-uppercase fs-6 letter-spacing-2">Total Streak Score</h2>
            <div className="score-display pulse-animation">
                {score.toLocaleString()}
            </div>
            <p className="text-secondary mt-3 mb-0">
                You're in the top <strong className="text-accent-pink">5%</strong> of ninjas this week!
            </p>
        </div>
    );
};
