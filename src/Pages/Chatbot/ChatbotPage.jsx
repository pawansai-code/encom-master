import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatHistory, fetchChatSettings } from '../../State/slices/chatSlice';
import './ChatbotPage.css';
import ChatHistory from './components/ChatHistory';
import ChatInterface from './components/ChatInterface';
import ChatSettings from './components/ChatSettings';

const ChatbotPage = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.profile);
    
    useEffect(() => {
        if (user) {
            dispatch(fetchChatHistory());
            dispatch(fetchChatSettings());
        }
    }, [dispatch, user]);

    return (
        <div className="chatbot-container">
            <aside className="chatbot-sidebar">
                <ChatHistory />
            </aside>
            <main className="chatbot-main">
                <ChatInterface />
            </main>
            <aside className="chatbot-settings-panel">
                <ChatSettings />
            </aside>
        </div>
    );
};

export default ChatbotPage;
