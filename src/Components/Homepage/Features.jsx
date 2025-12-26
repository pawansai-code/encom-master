import { useRef } from 'react';
import { FaChartLine, FaRocket, FaUserPlus } from 'react-icons/fa';

const Features = () => {
    // Refs for hover effects (optional JS enhancements, mostly handled by CSS)
    const stepsRef = useRef([]);

    const steps = [
        {
            id: 1,
            title: 'Sign Up',
            desc: 'Create your EDUVERSE account',
            icon: <FaUserPlus />,
            colorClass: 'icon-community', // Pinkish
            delay: '0s'
        },
        {
            id: 2,
            title: 'Explore & Learn',
            desc: 'Use tools, join community',
            icon: <FaRocket />,
            colorClass: 'icon-tools', // Purple
            delay: '0.2s'
        },
        {
            id: 3,
            title: 'Track & Grow',
            desc: 'Earn rewards & improve daily',
            icon: <FaChartLine />,
            colorClass: 'icon-funzone', // Violet/Blue
            delay: '0.4s'
        }
    ];

    return (
        <section className="features-section flex-column py-5 position-relative overflow-hidden">
            {/* Background Blob for atmosphere */}
            <div className="position-absolute top-50 start-50 translate-middle" 
                 style={{ 
                     width: '600px', 
                     height: '600px', 
                     background: 'radial-gradient(circle, rgba(157, 78, 221, 0.1) 0%, transparent 70%)', 
                     filter: 'blur(100px)', 
                     zIndex: 0 
                 }}>
            </div>

            {/* Eduverse Motto Section */}
            <div className="container text-center mb-5" style={{ zIndex: 1 }}>
                <div className="position-relative d-inline-block mb-4 overflow-hidden">
                    <h2 className="display-4 fw-bold text-white mb-0 animate-slide-up" style={{ letterSpacing: '2px', animationDelay: '0.2s' }}>
                        OUR <span className="text-gradient shimmer-text">CREED</span>
                    </h2>
                    <div className="position-absolute w-100 bottom-0 start-0 border-bottom border-danger animate-width" style={{ transform: 'scaleX(0)', animationDelay: '0.8s' }}></div>
                </div>
                
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="position-relative p-4">
                            {/* Animated Quote Marks */}
                            <span className="text-secondary display-1 position-absolute top-0 start-0 opacity-25 animate-float-slow" 
                                  style={{ transform: 'translate(-20px, -10px)', animationDelay: '0s' }}>"</span>
                            
                            <blockquote className="blockquote text-light fs-3 fst-italic position-relative" style={{ lineHeight: '1.6' }}>
                                <div className="overflow-hidden">
                                    <p className="mb-0 animate-reveal-text" style={{ animationDelay: '0.5s' }}>
                                        To empower every aspiring ninja with the code of wisdom,
                                    </p>
                                </div>
                                <div className="overflow-hidden">
                                    <p className="mb-0 animate-reveal-text" style={{ animationDelay: '0.7s' }}>
                                        forging a path where knowledge knows no boundaries
                                    </p>
                                </div>
                                <div className="overflow-hidden">
                                    <p className="mb-0 animate-reveal-text" style={{ animationDelay: '0.9s' }}>
                                        and <span className="text-warning text-shadow-glow">creativity strikes like lightning</span>.
                                    </p>
                                </div>
                            </blockquote>
                            
                            <span className="text-secondary display-1 position-absolute bottom-0 end-0 opacity-25 animate-float-slow" 
                                  style={{ transform: 'translate(20px, 10px)', animationDelay: '1.5s' }}>"</span>
                        </div>
                        <p className="text-secondary mt-3 animate-fade-in" style={{ animationDelay: '1.2s' }}>- The Eduverse Council</p>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="container text-center mb-5 fade-in-up position-relative" style={{ zIndex: 1 }}>
                <h2 className="display-4 fw-bold text-white mb-3">
                    Your Journey to <span className="text-gradient">Greatness</span>
                </h2>
                <p className="lead text-secondary mx-auto" style={{ maxWidth: '600px' }}>
                    Follow these simple steps to unlock your full potential in the Eduverse.
                </p>
            </div>

            {/* Steps Container */}
            <div className="container position-relative" style={{ zIndex: 1 }}>
                {/* Connecting Line (Desktop) */}
                <div className="d-none d-lg-block position-absolute start-0 end-0 top-50 translate-middle-y border-top border-secondary border-opacity-25 border-dashed" 
                     style={{ zIndex: -1, borderWidth: '2px', borderStyle: 'dashed' }}>
                </div>

                <div className="row g-4 justify-content-center">
                    {steps.map((step, index) => (
                        <div key={index} className="col-12 col-md-4">
                            <div 
                                className="step-card feature-card h-100 position-relative p-5 text-center d-flex flex-column align-items-center"
                                style={{ 
                                    animation: `fadeInUp 0.8s ease-out ${step.delay} backwards`,
                                    background: 'rgba(20, 20, 35, 0.4)', // Slightly more transparent for glass feel
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}
                            >
                                {/* Icon */}
                                <div className={`feature-icon-wrapper ${step.colorClass} mb-4 position-relative step-icon-glow`} 
                                     style={{ 
                                         fontSize: '2.5rem', 
                                         width: '100px', 
                                         height: '100px',
                                         transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                                     }}>
                                    {step.icon}
                                    {/* Pulse Ring */}
                                    <div className="pulse-ring"></div>
                                </div>

                                <h3 className="fw-bold text-white mb-2 fs-3">{step.title}</h3>
                                <p className="text-secondary mb-0 fs-5">{step.desc}</p>
                                
                                {/* Hover Reveal Line */}
                                <div className="step-hover-line"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Custom Styles for this Component internally for now, or move to CSS file */}
            <style>{`
                .step-card {
                    transition: all 0.4s ease;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    position: relative;
                    overflow: hidden;
                }
                
                /* Neon Border Effect on Hover */
                .step-card:hover {
                    transform: translateY(-15px) scale(1.02);
                    background: rgba(30, 30, 50, 0.8) !important;
                    box-shadow: 
                        0 0 5px #fff,
                        0 0 40px #fe019a; /* Neon Glow */
                    border-color: #fe019a !important;
                }
                
                /* Optional: Animated border tracing */
                .step-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    border-radius: inherit;
                    padding: 2px;
                    background: linear-gradient(90deg, #ff00cc, #333399, #00d4ff);
                    -webkit-mask: 
                        linear-gradient(#fff 0 0) content-box, 
                        linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    opacity: 0;
                    transition: opacity 0.4s ease;
                }

                .step-card:hover::before {
                    opacity: 1;
                    animation: borderRotate 2s linear infinite;
                }

                .step-card:hover .feature-icon-wrapper {
                    transform: scale(1.1) rotate(5deg);
                    text-shadow: 0 0 10px currentColor; /* Glow text/icon */
                }
                
                .step-icon-glow {
                    position: relative;
                }
                
                .pulse-ring {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    border-radius: 50%;
                    border: 2px solid currentColor;
                    opacity: 0;
                    animation: pulse 2s infinite;
                }
                
                .step-hover-line {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 0%;
                    height: 3px;
                    background: linear-gradient(90deg, #ff2e63, #9d4edd);
                    transition: width 0.4s ease;
                }
                
                .step-card:hover .step-hover-line {
                    width: 100%;
                }

                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.5; }
                    100% { transform: scale(1.5); opacity: 0; }
                }

                /* New Animations for Motto */
                .animate-slide-up {
                    opacity: 0;
                    animation: slideUp 0.8s ease-out forwards;
                }
                
                .animate-reveal-text {
                    opacity: 0;
                    transform: translateY(100%);
                    animation: revealText 0.8s cubic-bezier(0.77, 0, 0.175, 1) forwards;
                }

                .animate-width {
                    animation: expandWidth 0.8s ease-out forwards;
                }

                .animate-fade-in {
                    opacity: 0;
                    animation: fadeIn 1s ease-out forwards;
                }

                .animate-float-slow {
                    animation: float 6s ease-in-out infinite;
                }

                .shimmer-text {
                    color: rgba(255,255,255,0.1);
                    background: linear-gradient(to right, #4d4d4d 0%, #fff 50%, #4d4d4d 100%);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: shimmer 3s linear infinite;
                }

                .text-shadow-glow {
                    text-shadow: 0 0 10px rgba(255, 193, 7, 0.5);
                    animation: glowPulse 2s infinite alternate;
                }

                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                @keyframes revealText {
                   from { transform: translateY(100%); opacity: 0; }
                   to { transform: translateY(0); opacity: 1; }
                }

                @keyframes expandWidth {
                    to { transform: scaleX(1); }
                }

                @keyframes shimmer {
                    to { background-position: 200% center; }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                @keyframes glowPulse {
                    from { text-shadow: 0 0 5px rgba(255, 193, 7, 0.2); }
                    to { text-shadow: 0 0 20px rgba(255, 193, 7, 0.8), 0 0 30px rgba(255, 193, 7, 0.6); }
                }
            `}</style>
        </section>
    );
};

export default Features;
