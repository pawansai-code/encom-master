import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const carouselData = [
    {
        id: 1,
        title: "Master Your Craft",
        description: "Unlock exclusive tools and resources to level up your academic journey.",
        buttonText: "Start Learning",
        gradient: "linear-gradient(135deg, #2e1065 0%, #050510 100%)",
        accent: "#9d4edd"
    },
    {
        id: 2,
        title: "Join the Ninja Clan",
        description: "Connect with thousands of students worldwide in our thriving community.",
        buttonText: "Join Community",
        gradient: "linear-gradient(135deg, #be123c 0%, #050510 100%)",
        accent: "#ff2e63"
    },
    {
        id: 3,
        title: "Daily Challenges",
        description: "Complete daily quests to earn XP and climb the global leaderboard.",
        buttonText: "View Challenges",
        gradient: "linear-gradient(135deg, #0f766e 0%, #050510 100%)",
        accent: "#2dd4bf"
    }
];

const HomeCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        let interval;
        if (isAutoPlaying) {
            interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % carouselData.length);
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % carouselData.length);
        setIsAutoPlaying(false);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length);
        setIsAutoPlaying(false);
    };

    return (
        <section className="home-carousel-section">
            <div className="carousel-wrapper">
                <div 
                    className="carousel-slides-container" 
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {carouselData.map((slide) => (
                        <div 
                            key={slide.id} 
                            className="carousel-slide-item"
                            style={{ background: slide.gradient }}
                        >
                            <div className="carousel-slide-content">
                                <h2 className="slide-title" style={{ textShadow: `0 0 20px ${slide.accent}` }}>
                                    {slide.title}
                                </h2>
                                <p className="slide-description">{slide.description}</p>
                                <button 
                                    className="slide-btn"
                                    style={{ 
                                        borderColor: slide.accent, 
                                        color: slide.accent,
                                        boxShadow: `0 0 15px ${slide.accent}40`
                                    }}
                                >
                                    {slide.buttonText}
                                </button>
                            </div>
                            {/* Decorative Elements */}
                            <div className="slide-decoration" style={{ background: slide.accent }}></div>
                        </div>
                    ))}
                </div>

                <button className="carousel-control prev" onClick={prevSlide}>
                    <FaChevronLeft />
                </button>
                <button className="carousel-control next" onClick={nextSlide}>
                    <FaChevronRight />
                </button>

                <div className="carousel-dots">
                    {carouselData.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${currentSlide === index ? 'active' : ''}`}
                            onClick={() => {
                                setCurrentSlide(index);
                                setIsAutoPlaying(false);
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeCarousel;
