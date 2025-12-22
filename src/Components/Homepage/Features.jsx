import { FaBookOpen, FaCalculator, FaCommentDots, FaGamepad, FaStar, FaUsers } from 'react-icons/fa';
// Using icons that closely resemble the image
// Journal -> Book
// Fun Zone -> Gamepad
// Community -> Users
// Tools -> Calculator/Tools
// Rewards -> Sparkles/Star
// Chatbot -> Chat bubble

const featuresData = [
    {
        icon: <FaBookOpen />,
        title: 'Journal',
        description: 'Write notes, track thoughts, and reflect on your day in the ninja multiverse.',
        colorClass: 'icon-journal'
    },
    {
        icon: <FaGamepad />,
        title: 'Fun Zone',
        description: 'Play games, solve puzzles, and enjoy study breaks with ninja challenges.',
        colorClass: 'icon-funzone'
    },
    {
        icon: <FaUsers />,
        title: 'Community',
        description: 'Find teammates, share ideas, and join groups in the ninja clan.',
        colorClass: 'icon-community'
    },
    {
        icon: <FaCalculator />,
        title: 'Tools',
        description: 'Access powerful ninja tools for productivity and learning.',
        colorClass: 'icon-tools'
    },
    {
        icon: <FaStar />,
        title: 'Rewards',
        description: 'Earn XP, unlock badges, and climb the ninja ranks.',
        colorClass: 'icon-rewards'
    },
    {
        icon: <FaCommentDots />,
        title: 'Chatbot',
        description: 'Get instant help from our AI-powered ninja assistant.',
        colorClass: 'icon-chatbot'
    }
];

const Features = () => {
    return (
        <section className="features-section">
            <div className="features-container">
                <div className="features-grid">
                    {featuresData.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className={`feature-icon-wrapper ${feature.colorClass}`}>
                                {feature.icon}
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                            <button className="feature-link">Explore Now</button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
