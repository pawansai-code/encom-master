import './App.css';
import Footer from "./Layout/Footer/Footer";
import MainHeader from "./Layout/Mainheader/Mainheader";
import Navbar from "./Layout/Navigation/Navigation";
import Carousel from "./Layout/carousel/Carousel";

function App() {
  return (
    <>
    <MainHeader
        siteName="NELLORIENS.IN"
        tagline="Explore, Discover, Connect"
      />
    <Navbar />
    <Carousel />
    <Footer
        siteName="NELLORIENS.IN"
        tagline="Your trusted gateway to explore Nellore - connecting you with opportunities, news, and destinations."
    />


    </>
  )
}

export default App
