import { FaApple, FaMicrosoft, FaPhone } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../State/slices/userSlice';
import './SocialButtons.css';

const SocialButtons = ({ onPhoneClick }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSocialLogin = async (provider) => {
        try {
            // Mock Social Login
            const mockUser = {
                uid: 'mock-social-uid-' + Date.now(),
                email: 'social@eduverse.com',
                displayName: 'Social Ninja',
                photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Social',
                emailVerified: true
            };
            
            // Dispatch user to Redux
            dispatch(setUser({
                uid: mockUser.uid,
                email: mockUser.email,
                name: mockUser.displayName || 'Ninja Student',
                photoURL: mockUser.photoURL,
                emailVerified: mockUser.emailVerified,
            }));
            
            navigate('/dashboard');
        } catch (error) {
            console.error("Social Auth Error:", error);
            // You might want to dispatch an error action or show a toast here
        }
    };

    const loginGoogle = () => handleSocialLogin('google');
    const loginMicrosoft = () => handleSocialLogin('microsoft');
    const loginApple = () => handleSocialLogin('apple');

    return (
        <div className="social-login-container">
            <div className="divider">
                <span>OR Continue With</span>
            </div>
            
            <div className="social-buttons-grid">
                <button type="button" className="social-btn google" onClick={loginGoogle} title="Google">
                    <FcGoogle size={24} />
                </button>
                
                <button type="button" className="social-btn microsoft" onClick={loginMicrosoft} title="Microsoft">
                    <FaMicrosoft size={22} color="#00a1f1" />
                </button>
                
                <button type="button" className="social-btn apple" onClick={loginApple} title="Apple">
                    <FaApple size={24} color="white" />
                </button>
                
                <button type="button" className="social-btn phone" onClick={onPhoneClick} title="Phone Number">
                    <FaPhone size={20} color="white" />
                </button>
            </div>
        </div>
    );
};

export default SocialButtons;
