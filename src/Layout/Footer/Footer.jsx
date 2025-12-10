import { FaEnvelope, FaFacebook, FaGlobe, FaInstagram, FaMapMarkerAlt, FaPhone, FaTwitter, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useTranslation from '../../hooks/useTranslation';
import './Footer.css';

const Footer = ({ siteName = 'NELLORIENS.IN', tagline = 'Your trusted gateway to explore Nellore - connecting you with opportunities, news, and destinations.' }) => {
  const { t } = useTranslation();
  const isHub = siteName === 'NELLOREHUB.IN';
  
  // Translate siteName and tagline if they match default keys
  const translatedSiteName = siteName === 'NELLORIENS.IN' ? t('siteName') + '.IN' : siteName;
  const translatedTagline = tagline.startsWith('Your trusted gateway') ? t('FooterTagline') : tagline;

  const quickLinks1 = [
    { label: t('Jobs'), path: isHub ? '/hub/jobs' : '/jobs' },
    { label: t('LatestNews'), path: isHub ? '/hub/news' : '/news' },
    { label: t('ExamResults'), path: isHub ? '/hub/results' : '/results' },
  ];

  const quickLinks2 = [
    { label: t('UpdatesInfo'), path: isHub ? '/hub/updates' : '/updates' },
    { label: t('Notifications'), path: isHub ? '/hub/notifications' : '/notifications' },
    { label: t('SportsNews'), path: isHub ? '/hub/sports' : '/sports' },
  ];

  const quickLinks3 = isHub ? [
    { label: t('Tourism'), path: '/hub/tourism' },
    { label: t('ContactUs'), path: '/hub/contact' },
    { label: t('AboutUs'), path: '/hub/about' },
  ] : [
    { label: t('Tourism'), path: '/tourism' },
    { label: t('ContactUs'), path: '/contact' },
    { label: t('AboutUs'), path: '/about' },
  ];

  return (
    <footer className="main-footer">
      <div className="container-fluid">
        <div className="footer-content">
          <div className="footer-section footer-info">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="logo-circle">
                <FaGlobe className="logo-icon" />
              </div>
              <h3 className="footer-site-title">{translatedSiteName}</h3>
            </div>
            <p className="footer-description">{translatedTagline}</p>
            <div className="social-icons">
              <a href="#" aria-label="Facebook" className="social-icon">
                <FaFacebook />
              </a>
              <a href="#" aria-label="Twitter" className="social-icon">
                <FaTwitter />
              </a>
              <a href="#" aria-label="Instagram" className="social-icon">
                <FaInstagram />
              </a>
              {!isHub && (
                <a href="#" aria-label="YouTube" className="social-icon">
                  <FaYoutube />
                </a>
              )}
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">{t('QuickLinks')}</h4>
            <ul className="footer-links">
              {quickLinks1.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>• {link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">{t('QuickLinks')}</h4>
            <ul className="footer-links">
              {quickLinks2.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>• {link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">{t('QuickLinks')}</h4>
            <ul className="footer-links">
              {quickLinks3.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>• {link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-contact">
          <div className="contact-item">
            <FaEnvelope className="contact-icon" />
            <div>
              <h5>{t('EmailUs')}</h5>
              <p>contact@nelloriens.in</p>
            </div>
          </div>
          <div className="contact-item">
            <FaPhone className="contact-icon" />
            <div>
              <h5>{t('CallUs')}</h5>
              <p>8341540001 • 8367600045</p>
            </div>
          </div>
          <div className="contact-item">
            <FaMapMarkerAlt className="contact-icon" />
            <div>
              <h5>{t('Location')}</h5>
              <p>{t('LocationValue')}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

