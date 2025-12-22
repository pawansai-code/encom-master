import { useState } from 'react';
import HomeNavbar from '../../Components/Homepage/HomeNavbar';
import ProfileSettings from './components/ProfileSettings';
import PrivacySettings from './components/PrivacySettings';
import AccountSettings from './components/AccountSettings';
import '../Dashboard/styles/Dashboard.css';
import './styles/Settings.css';
import { FaUser, FaShieldAlt, FaLock } from 'react-icons/fa';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const renderContent = () => {
        switch(activeTab) {
            case 'profile': return <ProfileSettings />;
            case 'privacy': return <PrivacySettings />;
            case 'account': return <AccountSettings />;
            default: return <ProfileSettings />;
        }
    };

    return (
        <div className="dashboard-container settings-container">
            <HomeNavbar />
            
            <div className="container py-4 flex-grow-1">
                <div className="row g-4 h-100">
                    {/* Sidebar */}
                    <div className="col-lg-3">
                        <div className="settings-sidebar rounded-3 overflow-hidden">
                            <div className="p-4 border-bottom border-secondary border-opacity-25">
                                <h4 className="fw-bold mb-0 text-white">Settings</h4>
                                <p className="text-secondary small mb-0">Manage your preferences</p>
                            </div>
                            <div className="py-2">
                                <div 
                                    className={`settings-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('profile')}
                                >
                                    <FaUser /> Profile
                                </div>
                                <div 
                                    className={`settings-nav-item ${activeTab === 'privacy' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('privacy')}
                                >
                                    <FaShieldAlt /> Data & Privacy
                                </div>
                                <div 
                                    className={`settings-nav-item ${activeTab === 'account' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('account')}
                                >
                                    <FaLock /> Account Security
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="col-lg-9">
                        <div className="h-100 fade-in">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
