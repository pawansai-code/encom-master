import { useEffect, useState } from 'react';
import BannerImg from '../../assets/images/Banner_img.jpg';
import HistoryImg from '../../assets/images/history-img1.jpg';
import NellorePic from '../../assets/images/nellore_pic.jpg';
import SportsImg from '../../assets/images/sports-hero.jpg';
import '../../styles/Carousel.css';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: BannerImg,
      title: "Your Gateway to Jobs, News, Travel & More",
    },
    {
      id: 2,
      image: NellorePic,
      title: "Discover the Beauty of Nellore",
    },
    {
      id: 3,
      image: HistoryImg,
      title: "Rich History & Cultural Heritage",
    },
    {
      id: 4,
      image: SportsImg,
      title: "Latest Sports Updates & Events",
    }
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); 

    return () => clearInterval(slideInterval);
  }, [slides.length]);

  return (
    <section className="carousel-container">
      {/* Slides Background */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      ))}

      {/* Dark Overlay */}
      <div className="carousel-overlay"></div>

      {/* Content */}
      <div className="carousel-content">
        <span className='name-logo'>NELLORIEN</span>
        
        {/* Key prop triggers animation restart on change */}
        <h2 key={currentSlide}>{slides[currentSlide].title}</h2>
      </div>

      {/* Indicators */}
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          ></div>
        ))}
      </div>
    </section>
  );
};

export default Carousel;
