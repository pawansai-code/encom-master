import { FaRobot } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './FloatingChatbotIcon.css';

const FloatingChatbotIcon = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/chatbot');
    };

    return (
        <div className="floating-chatbot-icon" onClick={handleClick}>
            <div className="chatbot-tooltip">Ask Ninja AI</div>
            <FaRobot />
        </div>
    );
};

export default FloatingChatbotIcon;
