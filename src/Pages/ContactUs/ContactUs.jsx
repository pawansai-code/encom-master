
import { useEffect, useState } from 'react';
import { BiSupport } from 'react-icons/bi';
import {
    FaEnvelope,
    FaFacebookF,
    FaInstagram,
    FaMapMarkerAlt,
    FaPaperPlane,
    FaPhoneAlt,
    FaWhatsapp
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { GiNinjaHead, GiNinjaStar } from 'react-icons/gi';
import { useDispatch } from 'react-redux';
import HomeFooter from '../../Components/Homepage/HomeFooter';
import HomeNavbar from '../../Components/Homepage/HomeNavbar';
import { createTicket } from '../../State/slices/supportSlice';
import './ContactUs.css';

const ContactUs = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    // Scroll to top on load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.message) return;
        
        setStatus('loading');
        try {
            await dispatch(createTicket(formData)).unwrap();
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            setStatus('error');
        }
    };

    const socialLinks = [
        { 
            name: 'Instagram', 
            icon: FaInstagram, 
            handle: '@EduverseOfficial', 
            color: '#E1306C', 
            link: 'https://instagram.com' 
        },
        { 
            name: 'Twitter / X', 
            icon: FaXTwitter, 
            handle: '@EduverseEco', 
            color: '#ffffff', 
            link: 'https://twitter.com' 
        },
        { 
            name: 'Facebook', 
            icon: FaFacebookF, 
            handle: 'Eduverse Community', 
            color: '#4267B2', 
            link: 'https://facebook.com' 
        },
        { 
            name: 'WhatsApp', 
            icon: FaWhatsapp, 
            handle: '+1 (555) 000-NINJA', 
            color: '#25D366', 
            link: 'https://whatsapp.com' 
        }
    ];

    const contactInfo = [
        {
            icon: FaPhoneAlt,
            title: 'Call Us',
            detail: '+1 (800) EDU-VERSE',
            sub: 'Mon-Fri from 8am to 5pm'
        },
        {
            icon: FaEnvelope,
            title: 'Email Us',
            detail: 'support@eduverse.com',
            sub: 'Online support 24/7'
        },
        {
            icon: BiSupport,
            title: 'Live Chat',
            detail: 'Start a Chat',
            sub: 'Talk to a Ninja specialist'
        },
        {
            icon: FaMapMarkerAlt,
            title: 'HQ Location',
            detail: '123 Ninja Valley, Hidden Leaf',
            sub: 'Visit our Dojo'
        }
    ];

    return (
        <div className="contact-page-container">
            <HomeNavbar />
            
            {/* Background Animations */}
            <div className="bg-gradient-orb orb-1"></div>
            <div className="bg-gradient-orb orb-2"></div>
            <GiNinjaStar className="shuriken-decor s-1" />
            <GiNinjaStar className="shuriken-decor s-2" />
            
            {/* Ninja Character Animation */}
            <div className="ninja-mascot-container">
                <GiNinjaHead className="ninja-mascot" />
                <div className="ninja-shadow"></div>
            </div>

            <div className="container contact-content py-5">
                <div className="text-center mb-5">
                    <h1 className="section-title">Get in Touch</h1>
                    <p className="section-subtitle">
                        Have questions? Our Ninja support team is ready to help you level up your learning experience. 
                        Connect with us on social media or drop a message below.
                    </p>
                </div>

                {/* Social Grid */}
                <div className="social-grid">
                    {socialLinks.map((social, index) => (
                        <a 
                            key={index} 
                            href={social.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="social-card"
                            style={{ '--color': social.color }}
                        >
                            <div className="social-icon-wrapper">
                                <social.icon />
                            </div>
                            <div className="social-name">{social.name}</div>
                            <div className="social-handle">{social.handle}</div>
                        </a>
                    ))}
                </div>

                {/* Info & Form Split */}
                <div className="contact-split">
                    {/* Information Panel */}
                    <div className="info-panel">
                        <h3 className="text-white fw-bold mb-4">Contact Information</h3>
                        
                        {contactInfo.map((item, index) => (
                            <div key={index} className="info-item">
                                <div className="info-icon">
                                    <item.icon />
                                </div>
                                <div>
                                    <h5 className="text-white mb-1 fw-bold">{item.title}</h5>
                                    <p className="text-info mb-0 fw-bold">{item.detail}</p>
                                    <small className="text-secondary">{item.sub}</small>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dynamic Form */}
                    <div className="ninja-form">
                        <h3 className="text-white fw-bold mb-4">Send a Message</h3>
                        {status === 'success' && <div className="alert alert-success">Message sent successfully! Our ninjas are on it.</div>}
                        {status === 'error' && <div className="alert alert-danger">Failed to send. Please try again later.</div>}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 form-group">
                                    <label className="text-secondary small mb-1">Your Name</label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        className="ninja-input" 
                                        placeholder="Ninja Warrior"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label className="text-secondary small mb-1">Your Email</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        className="ninja-input" 
                                        placeholder="ninja@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label className="text-secondary small mb-1">Subject</label>
                                <input 
                                    type="text" 
                                    name="subject"
                                    className="ninja-input" 
                                    placeholder="How can we help?" 
                                    value={formData.subject}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="text-secondary small mb-1">Message</label>
                                <textarea 
                                    rows="4" 
                                    name="message"
                                    className="ninja-input" 
                                    placeholder="Write your message here..."
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="ninja-btn d-flex align-items-center justify-content-center" disabled={status === 'loading'}>
                                {status === 'loading' ? 'Sending...' : <>Send Message <FaPaperPlane /></>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            
            <HomeFooter />
        </div>
    );
};

export default ContactUs;
