import { useEffect, useState } from 'react';
import {
    FaBook,
    FaBullhorn,
    FaChartBar, FaChartLine,
    FaClipboardList,
    FaCoins,
    FaGamepad,
    FaGlobeAmericas,
    FaLifeRing,
    FaMedal,
    FaServer,
    FaShieldAlt,
    FaSignOutAlt,
    FaTrophy,
    FaUsers
} from 'react-icons/fa';
import './Styles/AdminDashboard.css';
import CMSManagement from './Views/CMSManagement';
import CommunityModeration from './Views/CommunityModeration';
import FunzoneManagement from './Views/FunzoneManagement';
import JournalOversight from './Views/JournalOversight';
import LeaderboardManagement from './Views/LeaderboardManagement';
import StreakRewardManagement from './Views/StreakRewardManagement';
import SupportLogs from './Views/SupportLogs';
import ToolsManagement from './Views/ToolsManagement';
import UserManagement from './Views/UserManagement';

// --- Mock Components for Graphs ---
const SimpleBarChart = ({ data }) => {
    const max = Math.max(...data.map(d => d.value));
    return (
        <div className="chart-container">
            {data.map((d, i) => (
                <div 
                    key={i} 
                    className="bar-col" 
                    style={{ height: `${(d.value / max) * 100}%` }}
                    data-value={d.value}
                ></div>
            ))}
        </div>
    );
};

const AdminDashboard = () => {
    // View State
    const [currentView, setCurrentView] = useState('dashboard'); // dashboard, users, tools, community

    // Basic Mock Data
    const [stats, setStats] = useState({
        users: 12450,
        active: 842,
        xp: 4500000,
        games: 2530
    });

    const [logs, setLogs] = useState([
        { time: '10:42:01', msg: 'System integrity check passed.' },
        { time: '10:43:15', msg: 'New user registration: user_992' },
        { time: '10:45:00', msg: 'Scheduled database backup started.' },
    ]);

    // Graph Data
    const usageData = [
        { label: 'Mon', value: 450 },
        { label: 'Tue', value: 620 },
        { label: 'Wed', value: 580 },
        { label: 'Thu', value: 810 },
        { label: 'Fri', value: 950 },
        { label: 'Sat', value: 1200 },
        { label: 'Sun', value: 870 },
    ];

    useEffect(() => {
        // Simulate real-time updates
        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                active: prev.active + Math.floor(Math.random() * 10) - 5,
                xp: prev.xp + Math.floor(Math.random() * 500)
            }));

            // Random log entry
            if(Math.random() > 0.7) {
                const newLog = { 
                    time: new Date().toLocaleTimeString('en-US', {hour12: false}), 
                    msg: `Server load sync: ${Math.floor(Math.random() * 20) + 10}ms`
                };
                setLogs(prev => [newLog, ...prev.slice(0, 4)]);
            }

        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const renderContent = () => {
        switch (currentView) {
            case 'users':
                return <UserManagement />;
            case 'tools':
                return <ToolsManagement />;
            case 'community': 
                return <CommunityModeration />;
            case 'journal':
                return <JournalOversight />;
            case 'funzone':
                return <FunzoneManagement />;
            case 'streaks':
                return <StreakRewardManagement />;
            case 'leaderboards':
                return <LeaderboardManagement />;
            case 'cms':
                return <CMSManagement />;
            case 'support':
                return <SupportLogs />;
            case 'dashboard':
            default:
                return (
                    <>
                        <header className="admin-header">
                            <div className="admin-title">
                                <h2>Dashboard Overview</h2>
                                <p>Real-time system insights and performance metrics.</p>
                            </div>
                            <div className="status-indicator">
                                <span className="status-dot"></span>
                                Status: Operational
                            </div>
                        </header>

                        {/* Global Analytics Cards */}
                        <div className="stats-grid">
                            <div className="admin-card">
                                <div className="stat-header">
                                    <div className="stat-icon bg-primary bg-opacity-10 text-primary">
                                        <FaUsers />
                                    </div>
                                    <span className="stat-trend trend-up">
                                        +12% <FaChartLine />
                                    </span>
                                </div>
                                <div className="stat-value">{stats.users.toLocaleString()}</div>
                                <div className="stat-label">Total Registered Users</div>
                            </div>

                            <div className="admin-card">
                                <div className="stat-header">
                                    <div className="stat-icon bg-success bg-opacity-10 text-success">
                                        <FaGlobeAmericas />
                                    </div>
                                    <span className="stat-trend trend-up">
                                        +5% <FaChartLine />
                                    </span>
                                </div>
                                <div className="stat-value">{stats.active.toLocaleString()}</div>
                                <div className="stat-label">Active Users Now</div>
                            </div>

                            <div className="admin-card">
                                <div className="stat-header">
                                    <div className="stat-icon bg-warning bg-opacity-10 text-warning">
                                        <FaCoins />
                                    </div>
                                </div>
                                <div className="stat-value">{(stats.xp / 1000).toFixed(1)}k</div>
                                <div className="stat-label">Total XP Generated</div>
                            </div>

                            <div className="admin-card">
                                <div className="stat-header">
                                    <div className="stat-icon bg-info bg-opacity-10 text-info">
                                        <FaGamepad />
                                    </div>
                                </div>
                                <div className="stat-value">{stats.games.toLocaleString()}</div>
                                <div className="stat-label">Games Played (24h)</div>
                            </div>
                        </div>

                        {/* Usage Graphs & Server Info */}
                        <div className="charts-grid">
                            {/* Traffic/Usage Graph */}
                            <div className="admin-card">
                                <h4 className="text-lg fw-bold mb-4">Weekly Traffic Overview</h4>
                                <SimpleBarChart data={usageData} />
                                <div className="d-flex justify-content-between mt-3 text-muted small">
                                    {usageData.map((d, i) => <span key={i}>{d.label}</span>)}
                                </div>
                            </div>

                            {/* Server Info Panel */}
                            <div className="server-panel">
                                <div className="admin-card">
                                    <h4 className="text-lg fw-bold mb-4 d-flex align-items-center gap-2">
                                        <FaServer /> System Resources
                                    </h4>
                                    
                                    <div className="server-metric">
                                        <div className="metric-header">
                                            <span>CPU Usage</span>
                                            <span>42%</span>
                                        </div>
                                        <div className="progress-track">
                                            <div className="progress-fill" style={{ width: '42%' }}></div>
                                        </div>
                                    </div>

                                    <div className="server-metric">
                                        <div className="metric-header">
                                            <span>Memory (RAM)</span>
                                            <span>64%</span>
                                        </div>
                                        <div className="progress-track">
                                            <div className="progress-fill bg-warning" style={{ width: '64%' }}></div>
                                        </div>
                                    </div>

                                    <div className="server-metric">
                                        <div className="metric-header">
                                            <span>Storage</span>
                                            <span>21%</span>
                                        </div>
                                        <div className="progress-track">
                                            <div className="progress-fill bg-success" style={{ width: '21%' }}></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Logs */}
                                <div className="admin-card p-0 overflow-hidden">
                                    <div className="p-3 border-bottom border-light border-opacity-10">
                                        <h5 className="mb-0 fw-bold fs-6">Live System Logs</h5>
                                    </div>
                                    <div className="console-logs rounded-0 border-0">
                                        {logs.map((log, i) => (
                                            <div key={i} className="log-entry">
                                                <span className="log-time">[{log.time}]</span>
                                                {log.msg}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="admin-dashboard">
            {/* Sidebar Navigation */}
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <FaShieldAlt className="text-primary" />
                    <span>NINJA<span className="text-muted">ADMIN</span></span>
                    <span className="logo-badge">PRO</span>
                </div>

                <div className="nav-section">
                    <div className="nav-label">Main Menu</div>
                    <div 
                        className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setCurrentView('dashboard')}
                    >
                        <FaChartBar /> Dashboard
                    </div>
                    <div 
                        className={`nav-link ${currentView === 'users' ? 'active' : ''}`}
                        onClick={() => setCurrentView('users')}
                    >
                        <FaUsers /> User Management
                    </div>
                    <div 
                        className={`nav-link ${currentView === 'journal' ? 'active' : ''}`}
                        onClick={() => setCurrentView('journal')}
                    >
                         <FaBook /> Journal Oversight
                    </div>
                </div>

                <div className="nav-section">
                    <div className="nav-label">Game & Rewards</div>
                    <div 
                        className={`nav-link ${currentView === 'funzone' ? 'active' : ''}`}
                        onClick={() => setCurrentView('funzone')}
                    >
                        <FaGamepad /> Funzone Manager
                    </div>
                    <div 
                        className={`nav-link ${currentView === 'streaks' ? 'active' : ''}`}
                        onClick={() => setCurrentView('streaks')}
                    >
                        <FaMedal /> Streaks & Rewards
                    </div>
                    <div 
                        className={`nav-link ${currentView === 'leaderboards' ? 'active' : ''}`}
                        onClick={() => setCurrentView('leaderboards')}
                    >
                        <FaTrophy /> Leaderboards
                    </div>
                </div>

                <div className="nav-section">
                    <div className="nav-label">Content & System</div>
                    <div 
                         className={`nav-link ${currentView === 'cms' ? 'active' : ''}`}
                         onClick={() => setCurrentView('cms')}
                    >
                        <FaBullhorn /> CMS Management
                    </div>
                    <div 
                        className={`nav-link ${currentView === 'tools' ? 'active' : ''}`}
                        onClick={() => setCurrentView('tools')}
                    >
                        <FaClipboardList /> Tools Config
                    </div>
                     <div 
                        className={`nav-link ${currentView === 'support' ? 'active' : ''}`}
                        onClick={() => setCurrentView('support')}
                    >
                        <FaLifeRing /> Support & Logs
                    </div>
                </div>

                <div className="nav-section">
                    <div className="nav-label">System</div>
                    <div className="nav-link">
                        <FaServer /> Server Status
                    </div>
                    <div className="nav-link text-danger mt-4">
                        <FaSignOutAlt /> Logout
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="admin-main">
                {renderContent()}
            </main>
        </div>
    );
};

export default AdminDashboard;
