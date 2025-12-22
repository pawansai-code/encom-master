import { useDispatch, useSelector } from 'react-redux';
import { deleteChatHistory, selectChatSettingsState, updateChatSettings } from '../../../State/slices/chatSlice';

const ChatSettings = () => {
    const settings = useSelector(selectChatSettingsState);
    const dispatch = useDispatch();

    const handleToggle = (key) => {
        // Optimistic update logic if needed, but for now specific functionality
        const newSettings = { ...settings, [key]: !settings[key] };
        dispatch(updateChatSettings(newSettings));
    };

    const handleSelect = (key, value) => {
        const newSettings = { ...settings, [key]: value };
        dispatch(updateChatSettings(newSettings));
    };

    return (
        <div>
            <h2 className="chatbot-title">Settings</h2>
            
            <div className="section-title">Preferences</div>
            <div className="setting-group">
                <div className="setting-item">
                    <span>Notifications</span>
                    <div 
                        className={`toggle-switch ${settings.notifications ? 'active' : ''}`}
                        onClick={() => handleToggle('notifications')}
                    >
                        <div className="toggle-thumb"></div>
                    </div>
                </div>
                <div className="setting-item">
                    <span>Clear History on Exit</span>
                    <div 
                        className={`toggle-switch ${settings.clearHistoryOnExit ? 'active' : ''}`}
                        onClick={() => handleToggle('clearHistoryOnExit')}
                    >
                        <div className="toggle-thumb"></div>
                    </div>
                </div>
            </div>

            <button
                onClick={() => {
                    if(window.confirm("Are you sure you want to delete all chat history?")) {
                        dispatch(deleteChatHistory());
                    }
                }}
                style={{
                    background: 'rgba(255, 0, 0, 0.2)',
                    border: '1px solid #ff2e63',
                    color: '#ff2e63',
                    padding: '10px 15px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    width: '100%',
                    marginBottom: '2rem',
                    fontWeight: 'bold',
                    transition: '0.3s'
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(255, 0, 0, 0.4)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(255, 0, 0, 0.2)'}
            >
                Clear All History Now
            </button>

            <div className="section-title">Appearance</div>
             <div className="setting-group">
                <div className="setting-item" style={{flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem'}}>
                    <span>Theme</span>
                    <select 
                        value={settings.theme || 'light'} 
                        onChange={(e) => handleSelect('theme', e.target.value)}
                        style={{
                            background: 'rgba(255,255,255,0.05)', 
                            color:'white', 
                            border:'1px solid rgba(255,255,255,0.1)', 
                            padding:'8px', 
                            borderRadius: '8px',
                            width: '100%',
                            outline: 'none'
                        }}
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="neon">Neon</option>
                    </select>
                </div>
                <div className="setting-item" style={{flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem'}}>
                    <span>Font Size</span>
                    <select 
                        value={settings.fontSize || 'medium'} 
                        onChange={(e) => handleSelect('fontSize', e.target.value)}
                        style={{
                            background: 'rgba(255,255,255,0.05)', 
                            color:'white', 
                            border:'1px solid rgba(255,255,255,0.1)', 
                            padding:'8px', 
                            borderRadius: '8px',
                            width: '100%',
                            outline: 'none'
                        }}
                    >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default ChatSettings;
