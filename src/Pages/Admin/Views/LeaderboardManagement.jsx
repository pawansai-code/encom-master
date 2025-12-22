import { useState } from 'react';
import { FaBan, FaCalendarAlt, FaRedo, FaTrophy, FaUserShield } from 'react-icons/fa';

const LeaderboardManagement = () => {
    const [selectedBoard, setSelectedBoard] = useState('global');
    
    // Mock Leaderboard Data
    const [entries, setEntries] = useState([
        { id: 1, rank: 1, user: 'NinjaMaster99', score: 95000, status: 'valid' },
        { id: 2, rank: 2, user: 'SusPlayer_1', score: 94000, status: 'suspicious' },
        { id: 3, rank: 3, user: 'RegularJoe', score: 82000, status: 'valid' },
        { id: 4, rank: 4, user: 'SpeedRunner', score: 81500, status: 'valid' },
    ]);

    const handleBan = (id) => {
        if(window.confirm("Ban this user from leaderboards?")) {
            setEntries(entries.filter(e => e.id !== id));
        }
    };

    const handleReset = () => {
        if(window.confirm("Reset THIS leaderboard? This cannot be undone.")) {
            setEntries([]);
        }
    }

    return (
        <div className="admin-view">
            <header className="view-header mb-4">
                <h2 className="view-title">Leaderboard Operations</h2>
                <div className="text-muted small">Manage rankings, remove cheaters, and reset seasons.</div>
            </header>

            <div className="row mb-4">
                <div className="col-md-8">
                    <div className="admin-card">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="text-white mb-0 d-flex align-items-center gap-2">
                                <FaTrophy className="text-warning" /> 
                                {selectedBoard.charAt(0).toUpperCase() + selectedBoard.slice(1)} Leaderboard
                            </h4>
                            <select 
                                className="form-select w-auto bg-dark text-white border-secondary"
                                value={selectedBoard}
                                onChange={(e) => setSelectedBoard(e.target.value)}
                            >
                                <option value="global">Global XP</option>
                                <option value="weekly">Weekly Challenge</option>
                                <option value="snake">Neon Snake</option>
                                <option value="tic-tac-toe">Tic Tac Toe</option>
                            </select>
                        </div>

                        <table className="table table-dark table-hover align-middle">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>User</th>
                                    <th>Score</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.map(entry => (
                                    <tr key={entry.id}>
                                        <td>#{entry.rank}</td>
                                        <td className="fw-bold">{entry.user}</td>
                                        <td className="text-accent">{entry.score.toLocaleString()}</td>
                                        <td>
                                            <span className={`badge bg-${entry.status === 'valid' ? 'success' : 'warning'}`}>
                                                {entry.status}
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleBan(entry.id)} title="Ban/Remote">
                                                <FaBan />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {entries.length === 0 && <p className="text-muted text-center py-4">Leaderboard is empty.</p>}
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="admin-card mb-3">
                        <h5 className="text-white mb-3">Seasonal Controls</h5>
                        <div className="d-grid gap-2">
                            <button className="btn btn-warning" onClick={handleReset}>
                                <FaRedo className="me-2" /> Reset Current Season
                            </button>
                            <button className="btn btn-outline-secondary">
                                <FaCalendarAlt className="me-2" /> Schedule Reset
                            </button>
                        </div>
                    </div>

                    <div className="admin-card">
                        <h5 className="text-white mb-3">Anti-Cheat</h5>
                         <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">Auto-Detect Suspicious Scores</span>
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" defaultChecked />
                            </div>
                        </div>
                        <div className="d-grid">
                            <button className="btn btn-outline-light btn-sm">
                                <FaUserShield className="me-2" /> View Cheat Logs
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardManagement;
