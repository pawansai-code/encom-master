import { useEffect, useState } from 'react';
import { FaRobot } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import './ChatbotFloatingIcon.css';

const ChatbotFloatingIcon = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    // Don't show on the actual chatbot page
    if (location.pathname === '/chatbot') return null;

    useEffect(() => {
        // Entrance animation delay
        const timer = setTimeout(() => setIsVisible(true), 1000);
        
        // Tooltip periodic show
        const tooltipInterval = setInterval(() => {
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 4000);
        }, 15000);

        return () => {
            clearTimeout(timer);
            clearInterval(tooltipInterval);
        };
    }, []);

    return (
        <div 
            className={`chatbot-float-container ${isVisible ? 'visible' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => navigate('/chatbot')}
        >
            {/* Dynamic Tooltip/Speech Bubble */}
            <div className={`chatbot-tooltip ${showTooltip || isHovered ? 'visible' : ''}`}>
                <span className="tooltip-text">
                    {isHovered ? "Need help? Ask me!" : "Psst! I'm here to help! 🤖"}
                </span>
                <div className="tooltip-arrow"></div>
            </div>

            {/* The Icon Button */}
            <div className="chatbot-btn">
                <div className="chatbot-icon-wrapper">
                    <FaRobot className="chatbot-icon" />
                </div>
                
                {/* Orbital Rings/Glow Effects */}
                <div className="chatbot-ring ring-1"></div>
                <div className="chatbot-ring ring-2"></div>
                
                {/* Status Dot */}
                <div className="chatbot-status-dot"></div>
            </div>
        </div>
    );
};

export default ChatbotFloatingIcon;
