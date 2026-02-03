import { useEffect, useRef, useState } from 'react';
import { FaArrowUp, FaCopy, FaRobot } from 'react-icons/fa';
import { IoMdAttach, IoMdClose } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addMessage, selectChatError, selectChatLoading, selectChatMessages, selectCurrentChatId, sendMessageToBot } from '../../../State/slices/chatSlice';

const ChatInterface = () => {
    const messages = useSelector(selectChatMessages);
    const loading = useSelector(selectChatLoading);
    const error = useSelector(selectChatError);
    const currentChatId = useSelector(selectCurrentChatId);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [input, setInput] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const initialized = useRef(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading, selectedFile]);

    // Initial Mock Messages for Demo/Visuals
    useEffect(() => {
        if (!initialized.current && messages.length === 0 && !currentChatId) {
            initialized.current = true;

            // Dispatching one by one to simulate conversation load
            dispatch(addMessage({ 
                sender: 'user', 
                text: "Hi! What can you do?", 
                timestamp: Date.now() - 2000 
            }));

            setTimeout(() => {
                dispatch(addMessage({ 
                    sender: 'bot', 
                    text: "Welcome to Eduverse! I am your sophisticated AI Ninja Assistant. How can I optimize your learning journey today?", 
                    timestamp: Date.now() 
                }));
            }, 600);
        }
    }, [dispatch, messages.length, currentChatId]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedFile({
                    name: file.name,
                    type: file.type,
                    preview: e.target.result // Base64 for image preview
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSend = (text = input) => {
        if (!text.trim() && !selectedFile) return;
        
        // Optimistic UI update
        const userMsg = { 
            sender: 'user', 
            text: text, 
            timestamp: Date.now(),
            attachment: selectedFile 
        };
        dispatch(addMessage(userMsg));
        
        dispatch(sendMessageToBot({ message: text, conversationId: currentChatId })); // Backend ignores file for now
        setInput('');
        removeFile();
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
                        <div key={idx} className={`message ${msg.sender} ${msg.attachment ? 'has-attachment' : ''}`}>
                             {msg.sender === 'bot' && (
                                <div className="bot-avatar-small">
                                    <FaRobot />
                                </div>
                            )}
                            <div className="message-content-wrapper">
                                {msg.attachment && (
                                    <div className="message-attachment">
                                        {msg.attachment.type.startsWith('image/') ? (
                                            <img src={msg.attachment.preview} alt="Attachment" className="attachment-img" />
                                        ) : (
                                            <div className="attachment-file">
                                                <span className="file-icon">📄</span>
                                                <span>{msg.attachment.name}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {msg.text && <div className="message-text">{msg.text}</div>}
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
                         <div className="bot-avatar-small"><FaRobot /></div>
                         <div className="message-content-wrapper">
                            <span className="typing-dot"></span>
                            <span className="typing-dot"></span>
                            <span className="typing-dot"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Floating Input Area (DeepSeek Style) */}
            <div className="chat-input-container">
                <form className="chat-input-wrapper" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                    
                    {/* File Preview Area */}
                    {selectedFile && (
                        <div className="file-preview-area">
                            <div className="file-preview-item">
                                {selectedFile.type.startsWith('image/') ? (
                                    <img src={selectedFile.preview} alt="Preview" />
                                ) : (
                                    <span className="file-icon-preview">📄</span>
                                )}
                                <span className="file-name">{selectedFile.name}</span>
                                <button type="button" className="remove-file-btn" onClick={removeFile}>
                                    <IoMdClose />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="input-top-row">
                        <textarea
                            className="chat-input" 
                            placeholder="Message Ninja AI..." 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            disabled={loading}
                            rows={1}
                        />
                    </div>
                    
                    <div className="input-bottom-row">
                        <div className="input-left">
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                style={{display: 'none'}} 
                                onChange={handleFileSelect}
                            />
                            <button type="button" className="action-icon-btn" title="Attach File" onClick={() => fileInputRef.current.click()}>
                                <IoMdAttach size={24} />
                            </button>
                        </div>
                        
                        <div className="input-right">
                            <button type="submit" className="send-btn" disabled={loading || (!input.trim() && !selectedFile)}>
                                <FaArrowUp />
                            </button>
                        </div>
                    </div>
                </form>
                <div className="disclaimer-text">
                    AI-generated, for reference only.
                </div>
            </div>
        </>
    );
};

export default ChatInterface;
