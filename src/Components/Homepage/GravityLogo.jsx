import { useEffect, useState } from 'react';
import './styles/GravityLogo.css';

const GravityLogo = () => {
    const text = "EDUVERSE";
    const [startAnimation, setStartAnimation] = useState(false);

    useEffect(() => {
        // Slight delay to ensure mount
        const timer = setTimeout(() => {
            setStartAnimation(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="gravity-container">
            <div className="gravity-text">
                {text.split('').map((char, index) => (
                    <span 
                        key={index} 
                        className={`gravity-char ${startAnimation ? 'animate' : ''}`}
                        style={{ animationDelay: `${index * 0.15}s` }} // Staggered falling like gravity rain
                    >
                        {char}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default GravityLogo;
