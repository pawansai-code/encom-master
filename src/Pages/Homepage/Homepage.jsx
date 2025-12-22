import Announcements from '../../Components/Homepage/Announcements';
import Features from '../../Components/Homepage/Features';
import Hero from '../../Components/Homepage/Hero';
import HomeCarousel from '../../Components/Homepage/HomeCarousel';
import HomeFooter from '../../Components/Homepage/HomeFooter';
import HomeNavbar from '../../Components/Homepage/HomeNavbar';
import './styles/Homepage.css';

const HomePage = () => {
    return (
        <div className="homepage-container">
            <HomeNavbar />
            <div id="home"><Hero /></div>
            <div id="features"><Features /></div>
            <div id="announcements"><Announcements /></div>
            <div id="showcase"><HomeCarousel /></div>
            <div id="contact"><HomeFooter /></div>
        </div>
    );
};

export default HomePage;
