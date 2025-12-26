import { useEffect, useRef } from 'react';
import Announcements from '../../Components/Homepage/Announcements';
import Features from '../../Components/Homepage/Features';
import Hero from '../../Components/Homepage/Hero';
import HomeCarousel from '../../Components/Homepage/HomeCarousel';
import HomeFooter from '../../Components/Homepage/HomeFooter';
import HomeNavbar from '../../Components/Homepage/HomeNavbar';
import './styles/Homepage.css';

const HomePage = () => {
    const observerRef = useRef(null);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observerCallback = (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Stop observing once visible if you want it to happen only once
                    observer.unobserve(entry.target); 
                }
            });
        };

        observerRef.current = new IntersectionObserver(observerCallback, observerOptions);

        const sections = document.querySelectorAll('.reveal-section');
        sections.forEach((section) => observerRef.current.observe(section));

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, []);

    return (
        <div className="homepage-container">
            <HomeNavbar />
            
            <div id="home" className="reveal-section">
                <Hero />
            </div>
            
            <div id="features" className="reveal-section">
                <Features />
            </div>
            
            <div id="announcements" className="reveal-section">
                <Announcements />
            </div>
            
            <div id="showcase" className="reveal-section">
                <HomeCarousel />
            </div>
            
            <div id="contact" className="reveal-section">
                <HomeFooter />
            </div>
        </div>
    );
};

export default HomePage;
