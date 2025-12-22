import { useNavigate } from 'react-router-dom';
import GravityLogo from './GravityLogo';


const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="hero-section">
            <div className="hero-content">
                <GravityLogo />
                <h1 className="hero-title">
                    Step Into the Student <span className="ninja-text">Ninja</span> <br />
                    <span className="multiverse-text">Multiverse</span>
                </h1>
                <p className="hero-subtitle">
                    Where Academics Meet Adventure. Engineered for dreamers, built for doers!
                </p>
                <div className="hero-buttons">
                    <button className="get-started-btn" onClick={() => navigate('/auth/signup')}>Get Started</button>
                    <button className="learn-more-btn" onClick={() => navigate('/about')}>Learn More</button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
