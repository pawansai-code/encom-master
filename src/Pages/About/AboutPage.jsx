import { useEffect, useState } from 'react';
import { GiNinjaHead, GiShuriken } from 'react-icons/gi';
import HomeFooter from '../../Components/Homepage/HomeFooter';
import HomeNavbar from '../../Components/Homepage/HomeNavbar';
import './AboutPage.css';

const AboutPage = () => {
    const [scrolled, setScrolled] = useState(0);

    // Parallax effect on scroll
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Random Lightning Effect Logic
    const [lightning, setLightning] = useState(false);
    const [boltPosition, setBoltPosition] = useState(50);

    useEffect(() => {
        const triggerLightning = () => {
            const delay = Math.random() * 5000 + 4000; // 4-9 seconds delay
            setTimeout(() => {
                setBoltPosition(Math.random() * 80 + 10);
                setLightning(true);
                setTimeout(() => setLightning(false), 400); // 400ms duration
                triggerLightning();
            }, delay);
        };
        const initialTimer = setTimeout(triggerLightning, 2000);
        return () => clearTimeout(initialTimer);
    }, []);

    return (
        <div className="about-page">
            <HomeNavbar />
            
            {/* Animated Background Layers */}
            <div className="ninja-bg">
                <div className="fog-container"></div>
                {lightning && (
                    <div className="lightning-container">
                        <div className="lightning-flash"></div>
                        <svg className="lightning-bolt" style={{ left: `${boltPosition}%` }} viewBox="0 0 100 500">
                            <path d="M50 0 L0 200 L40 200 L10 500 L80 150 L40 150 L90 0 Z" fill="#fff" />
                        </svg>
                    </div>
                )}
                {/* Dynamic Shurikens */}
                {[...Array(10)].map((_, i) => (
                    <div 
                        key={i} 
                        className="particle" 
                        style={{
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 30 + 10}px`,
                            height: `${Math.random() * 30 + 10}px`,
                            animationDuration: `${Math.random() * 10 + 5}s`,
                            animationDelay: `${Math.random() * 5}s`,
                            backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjZmZmZmZmIiBkPSJNNDYyLjkgMTE0LjlsLTU4LjItMzMuNmw0Ny00Ny0xMDUuOS0yOC40LTUwLjYtMTA1LjktMjguNCAxMDUuOS0xMDUuOSA1MC42IDQ3IDQ3LTMzLjYgNTguMi0xMTIuOCA2NS4xIDExMi44IDY1LjEgMzMuNiA1OC4yLTQ3IDQ3IDEwNS45IDI4LjQgNTAuNiAxMDUuOSAyOC40LTEwNS45IDEwNS45LTUwLjYtNDctNDcgMzMuNi01OC4yIDExMi44LTY1LjF6IiAvPjwvc3ZnPg==")', // Simple star/shuriken shape
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            background: 'transparent'
                        }}
                    >
                        <GiShuriken style={{ width: '100%', height: '100%', color: 'rgba(255,255,255,0.1)' }} />
                    </div>
                ))}
            </div>

            <div className="about-container">
                {/* Hero Section */}
                <section className="about-hero" style={{ transform: `translateY(${scrolled * 0.2}px)` }}>
                    <h1 className="hero-title">
                        <GiNinjaHead style={{ marginRight: '1rem' }} />
                        The Eduverse Story
                    </h1>
                    <p className="hero-subtitle">
                        From the shadows of ignorance to the light of knowledge.
                    </p>
                </section>

                {/* Story Section */}
                <section className="story-section">
                    <div className="story-card">
                        <div className="story-content">
                            <h2>The Legend Begins</h2>
                            <p className="story-text">
                                Long ago, in a digital landscape cluttered with dry textbooks and uninspiring lectures, a clan of rogue developers and educators gathered in the shadows. We realized that learning had lost its spark. The joy of discovery was being buried under mountains of rote memorization.
                            </p>
                            <p className="story-text">
                                We envisioned a new world—<span className="highlight">The Eduverse</span>—where education wasn't a chore, but an adventure. A place where seeking knowledge made you a warrior, and mastering a skill made you a legend.
                            </p>

                            <h3>The Struggles</h3>
                            <p className="story-text">
                                Building the dojo was no easy feat. We faced the <span className="highlight">Bug swarms of the North</span> that crashed our servers night after night. We battled the specter of <span className="highlight">Mobile Incompatibility</span>, ensuring our scrolls could be read on devices of all sizes. There were sleepless nights fueled only by dark roast coffee and determination.
                            </p>
                            <p className="story-text">
                                But with every line of code, we forged a stronger platform. We integrated gamification not as a gimmick, but as the core philosophy. XP, ranks, and achievements were born to honor the student's journey.
                            </p>

                            <h3>The Path Forward</h3>
                            <p className="story-text">
                                Today, Eduverse stands as a beacon for digital ninjas everywhere. We continue to sharpen our tools, expand our libraries, and protect the sanctity of fun in learning. The journey is never over; there is always a higher belt to earn.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
            
            <HomeFooter />
        </div>
    );
};

export default AboutPage;
