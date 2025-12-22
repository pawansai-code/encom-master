import { useEffect, useState } from 'react';
import { FaBolt, FaBrain, FaCode, FaDragon, FaGlobe, FaShieldAlt, FaUserSecret } from 'react-icons/fa';
import { GiNinjaHead, GiNinjaMask, GiShuriken } from 'react-icons/gi';
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

    // Interactive Team Data
    const teamMembers = [
        {
            id: 1,
            name: "Sensei Code",
            role: "Master Architect",
            icon: <GiNinjaMask />,
            stats: { skill: "React", level: 99 }
        },
        {
            id: 2,
            name: "Shadow Design",
            role: "UI/UX Ninja",
            icon: <FaUserSecret />,
            stats: { skill: "CSS3", level: 95 }
        },
        {
            id: 3,
            name: "Rogue Bug",
            role: "QA Specialist",
            icon: <GiShuriken />,
            stats: { skill: "Testing", level: 90 }
        },
        {
            id: 4,
            name: "Cyber Monk",
            role: "Backend Guru",
            icon: <FaBrain />,
            stats: { skill: "Node.js", level: 98 }
        },
    ];

    const values = [
        {
            icon: <FaGlobe />,
            title: "Universal Access",
            desc: "Education for every ninja, anywhere in the multiverse."
        },
        {
            icon: <FaBolt />,
            title: "Lightning Fast",
            desc: "Optimized learning paths for rapid skill acquisition."
        },
        {
            icon: <FaShieldAlt />,
            title: "Secure Future",
            desc: "Empowering students with knowledge that lasts a lifetime."
        }
    ];

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
                        Born from the shadows of traditional learning, we emerged to train the next generation of digital warriors. 
                        Our dojo is the internet, our weapons are knowledge.
                    </p>
                </section>

                {/* Mission Scrolls (Cards) */}
                <section className="mission-section">
                    {values.map((val, idx) => (
                        <div key={idx} className="scroll-card">
                            <div className="scroll-icon">{val.icon}</div>
                            <h3 className="scroll-title">{val.title}</h3>
                            <p className="scroll-text">{val.desc}</p>
                        </div>
                    ))}
                </section>

                {/* Interactive Team Grid */}
                <section className="team-section">
                    <div className="section-header">
                        <h2><FaDragon className="text-danger me-2" /> Meet the Masters</h2>
                        <p className="text-secondary">Hover over the cards to reveal their power levels.</p>
                    </div>
                    
                    <div className="team-grid">
                        {teamMembers.map((member) => (
                            <div key={member.id} className="ninja-card">
                                <div className="card-inner">
                                    {/* Front */}
                                    <div className="card-front">
                                        <div className="ninja-avatar">
                                            {member.icon}
                                        </div>
                                        <h3 className="ninja-name">{member.name}</h3>
                                        <span className="ninja-role">{member.role}</span>
                                    </div>
                                    
                                    {/* Back */}
                                    <div className="card-back">
                                        <h3 className="mb-4">{member.name}</h3>
                                        <p className="mb-4">"Silence is the ultimate weapon of the coder."</p>
                                        <div className="stat-bar">
                                            <div className="stat-label">
                                                <span>{member.stats.skill}</span>
                                                <span>{member.stats.level}%</span>
                                            </div>
                                            <div className="progress-container">
                                                <div 
                                                    className="progress-fill" 
                                                    style={{ width: `${member.stats.level}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <FaCode className="fs-2" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                
                {/* Join CTA */}
                <section className="text-center py-5 mb-5">
                    <h2 className="mb-4 display-4 fw-bold">Ready to start your training?</h2>
                    <button className="btn btn-lg btn-danger rounded-pill px-5 py-3 fw-bold shadow-lg" style={{ background: 'linear-gradient(45deg, #ff2e63, #ff0844)', border: 'none' }}>
                        Join the Clan <GiShuriken className="ms-2 spin-icon" />
                    </button>
                </section>
            </div>
        </div>
    );
};

export default AboutPage;
