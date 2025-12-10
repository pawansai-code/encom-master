import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../../Layout/Footer/Footer";
import MainHeader from "../../Layout/Mainheader/Mainheader";
import Navbar from "../../Layout/Navigation/Navigation";
// import Carousel from "../../Layout/carousel/Carousel";

const HomePage = () => {
  return (
    <div>
        <MainHeader
                siteName="NELLOREHUB.IN"
                tagline="Explore, Discover, Connect"
            />
            <Navbar includeSearch={false} />
            <Footer
                siteName="NELLOREHUB.IN"
                tagline="Your trusted gateway to explore Nellore"
            />
    </div>
  );
};

export default HomePage;
