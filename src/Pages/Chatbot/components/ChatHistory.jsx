import { useDispatch, useSelector } from 'react-redux';
import { selectChatHistory, setConversation } from '../../../State/slices/chatSlice';

const ChatHistory = () => {
    const history = useSelector(selectChatHistory);
    const dispatch = useDispatch();

    return (
        <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <h2 className="chatbot-title">Conversations</h2>
            
            <button 
                onClick={() => dispatch(startNewChat())}
                style={{
                    background: 'linear-gradient(90deg, #ff2e63, #9d4edd)',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '8px',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginBottom: '1rem',
                    width: '100%',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                }}
            >
                + New Chat
            </button>

            <ul className="history-list">
                {history.length === 0 ? (
                    <li style={{color: '#666', padding: '10px', textAlign: 'center', fontStyle: 'italic'}}>No recent chats</li>
                ) : history.map(chat => (
                    <li key={chat.id} className="history-item" onClick={() => dispatch(setConversation(chat))}>
                        <h4>{chat.title || 'Untitled Conversation'}</h4>
                        <span>{new Date(chat.date || Date.now()).toLocaleDateString()}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatHistory;
