import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import ninjaChar from '../../assets/ninja_character.png';
import './GlobalNinjaGuide.css';

const GlobalNinjaGuide = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [step, setStep] = useState(0);

    // Initial delay before ninja appears
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 3000); // Appears after 3 seconds
        return () => clearTimeout(timer);
    }, []);

    // Auto progress speech sequence
    useEffect(() => {
        if (!isVisible) return;
        
        // Sequence timing
        const sequence = [
            { time: 5000, nextStep: 1 },  // Stay on "Hi" for 5s
            { time: 6000, nextStep: 2 },  // "I'm EduNinja" for 6s
            { time: 8000, nextStep: 3 },  // "About Eduverse" for 8s
        ];

        if (step < sequence.length) {
            const timer = setTimeout(() => {
                setStep(prev => prev + 1);
            }, sequence[step].time);
            return () => clearTimeout(timer);
        } else {
            // After sequence ends, maybe hide or stay quiet?
            // Let's hide it automatically after the last message
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 6000);
            return () => clearTimeout(timer);
        }

    }, [isVisible, step]);

    const messages = [
        "Greetings to the Eduverse!",
        "I am your Sensei Ninja. I will guide you on your journey.",
        "Eduverse is a multiverse of learning, where every challenge earns you honor.",
        "Explore Journals, Fun Zones, and Tools to level up your mind. Good luck!"
    ];

    if (!isVisible) return null;

    return (
        <div className="global-ninja-container">
            <div className="speech-bubble-container">
                <div className="speech-bubble">
                    <p>{messages[step] || messages[messages.length - 1]}</p>
                </div>
            </div>
            <div className="ninja-wrapper">
                 <img src={ninjaChar} alt="Ninja Guide" className="ninja-image" />
            </div>
            <button className="ninja-close-btn" onClick={() => setIsVisible(false)}>
                <FaTimes />
            </button>
        </div>
    );
};

export default GlobalNinjaGuide;
