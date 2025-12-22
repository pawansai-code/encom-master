
const NinjaMascot = ({ mood = 'happy' }) => {
    // Determine eye shape based on mood
    const getEyeShape = () => {
        if (mood === 'focused') return <path d="M70,95 Q80,105 90,95" stroke="white" strokeWidth="3" fill="none"/>; 
        return <circle cx="80" cy="95" r="5" fill="white" />; // Happy/Normal
    };

    return (
        <svg 
            className="ninja-mascot" 
            viewBox="0 0 200 200" 
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Shadow */}
            <ellipse cx="100" cy="180" rx="60" ry="10" fill="rgba(0,0,0,0.3)" />

            {/* Body */}
            <circle cx="100" cy="100" r="50" fill="#2c3e50" /> {/* Dark Blue Suit */}
            
            {/* Head/Mask */}
            <path d="M70,80 Q100,60 130,80 L130,110 Q100,130 70,110 Z" fill="#2c3e50" />
            
            {/* Skin Area (Face Window) */}
            <path d="M75,85 Q100,75 125,85 L125,100 Q100,115 75,100 Z" fill="#f1c27d" />
            
            {/* Eyes (Left & Right) */}
            <g transform="translate(-15, 0)">
                <circle cx="80" cy="95" r="5" fill="black" /> 
                <circle cx="82" cy="93" r="1.5" fill="white" />
            </g>
            <g transform="translate(15, 0)">
                <circle cx="120" cy="95" r="5" fill="black" />
                <circle cx="122" cy="93" r="1.5" fill="white" />
            </g>

            {/* Headband */}
            <path d="M60,82 Q100,65 140,82" stroke="#e74c3c" strokeWidth="8" fill="none" strokeLinecap="round" />
            {/* Headband Ties (Animated) */}
            <path d="M135,80 Q160,70 170,90" stroke="#e74c3c" strokeWidth="6" fill="none" strokeLinecap="round">
                <animate attributeName="d" values="M135,80 Q160,70 170,90; M135,80 Q165,60 175,70; M135,80 Q160,70 170,90" dur="2s" repeatCount="indefinite" />
            </path>
            <path d="M138,82 Q160,90 165,110" stroke="#e74c3c" strokeWidth="6" fill="none" strokeLinecap="round">
                 <animate attributeName="d" values="M138,82 Q160,90 165,110; M138,82 Q165,100 170,120; M138,82 Q160,90 165,110" dur="2.3s" repeatCount="indefinite" />
            </path>

            {/* Arms - Crossed or Sides */}
            <path d="M60,110 Q50,130 70,140" stroke="#2c3e50" strokeWidth="10" strokeLinecap="round" />
            <path d="M140,110 Q150,130 130,140" stroke="#2c3e50" strokeWidth="10" strokeLinecap="round" />

            {/* Sword Handle (Peeking from back) */}
            <rect x="110" y="40" width="8" height="30" fill="#95a5a6" transform="rotate(30 114 55)" />
            <rect x="106" y="65" width="16" height="5" fill="#f1c40f" transform="rotate(30 114 67.5)" />

        </svg>
    );
};

export default NinjaMascot;
