import { FaEnvelope, FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';

const HomeFooter = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: <FaInstagram />, href: "#", label: "Instagram", color: "#E1306C" },
        { icon: <FaFacebookF />, href: "#", label: "Facebook", color: "#4267B2" },
        { icon: <FaTwitter />, href: "#", label: "Twitter", color: "#1DA1F2" }, // Twitter/X color
        { icon: <FaWhatsapp />, href: "#", label: "WhatsApp", color: "#25D366" },
        { icon: <FaEnvelope />, href: "#", label: "Email", color: "#EA4335" }
    ];

    return (
        <footer className="home-footer">
            <div className="footer-content">
                <div className="footer-logo">
                    <h2>EDUVERSE</h2>
                    <p>Where Academics Meet Adventure</p>
                </div>
                
                <div className="social-links">
                    {socialLinks.map((social, index) => (
                        <a 
                            key={index} 
                            href={social.href} 
                            className="social-icon" 
                            aria-label={social.label}
                            style={{ '--hover-color': social.color }}
                        >
                            {social.icon}
                        </a>
                    ))}
                </div>

                <div className="footer-bottom">
                    <p>&copy; {currentYear} Eduverse. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default HomeFooter;
