import { useEffect, useRef, useState } from 'react';
import { FaCopy, FaMicrophone, FaPaperPlane, FaRobot } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, selectChatError, selectChatLoading, selectChatMessages, selectCurrentChatId, sendMessageToBot } from '../../../State/slices/chatSlice';

const ChatInterface = () => {
    const messages = useSelector(selectChatMessages);
    const loading = useSelector(selectChatLoading);
    const error = useSelector(selectChatError);
    const currentChatId = useSelector(selectCurrentChatId);
    const dispatch = useDispatch();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSend = (text = input) => {
        if (!text.trim()) return;
        
        // Optimistic UI update
        const userMsg = { sender: 'user', text: text, timestamp: Date.now() };
        dispatch(addMessage(userMsg));
        
        dispatch(sendMessageToBot({ message: text, conversationId: currentChatId }));
        setInput('');
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        // Could add a toast notification here
    };

    const suggestions = [
        "What are the Tools?",
        "Tell me a joke",
        "How do streaks work?",
        "Show me the Funzone games"
    ];

    return (
        <>
            {/* Header */}
            <div className="chat-header">
                <div className="chat-header-avatar">
                   <FaRobot />
                </div>
                <div className="chat-header-info">
                    <h3>Ninja Assistant</h3>
                    <div className="chat-header-status">
                        <span className="status-dot"></span> Online
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="chat-messages">
                {messages.length === 0 ? (
                    <div className="welcome-container">
                        <div className="welcome-icon">
                           <FaRobot />
                        </div>
                        <h3 style={{fontSize: '2rem', marginBottom: '1rem', color: '#ff2e63'}}>Hello, Ninja!</h3>
                        <p style={{color:'#aaa', marginBottom:'2rem'}}>I'm here to help you navigate Eduverse. Ask me anything!</p>
                        
                        <div className="suggestion-chips">
                            {suggestions.map((s, i) => (
                                <button key={i} className="chip" onClick={() => handleSend(s)}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div key={idx} className={`message ${msg.sender}`}>
                            <div className="message-content">
                                {msg.text}
                            </div>
                            <div className="message-meta">
                                <span>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                {msg.sender === 'bot' && (
                                    <button className="msg-action-btn" onClick={() => handleCopy(msg.text)} title="Copy">
                                        <FaCopy />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
                
                {error && (
                    <div className="message bot error">
                        Error: {error}
                    </div>
                )}
                
                {loading && (
                    <div className="message bot">
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form className="chat-input-area" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                <div className="input-wrapper">
                    <input 
                        type="text" 
                        className="chat-input" 
                        placeholder="Type your message..." 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                    />
                    <button type="button" className="voice-btn" title="Voice Input (Coming Soon)">
                        <FaMicrophone />
                    </button>
                </div>
                <button type="submit" className="send-btn" disabled={loading || !input.trim()}>
                    <FaPaperPlane />
                </button>
            </form>
        </>
    );
};

export default ChatInterface;
