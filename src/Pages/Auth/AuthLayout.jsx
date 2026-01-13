import { useNavigate } from 'react-router-dom';
import ninjaImg from '../../assets/auth_ninja.jpg';
import './Auth.css';

const AuthLayout = ({ children, title, subtitle, isAdmin = false }) => {
    const navigate = useNavigate();

    return (
        <div className={`auth-container ${isAdmin ? 'admin-mode' : ''}`}>
            {/* Background Animations */}
            <div className="auth-bg-circle bg-circle-1"></div>
            <div className="auth-bg-circle bg-circle-2"></div>

            {/* Left Side: Branding/Image */}
            <div className="auth-branding">
                <div className="auth-branding-content">
                    <img src={ninjaImg} alt="Ninja Mascot" className="ninja-image" />
                    <div className="brand-text">
                        <h1>Eduverse</h1>
                        <p>{isAdmin ? 'Admin Portal Access' : 'Master your learning journey like a Ninja.'}</p>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="auth-form-wrapper">
                <div className="auth-box">
                    <div className="auth-header">
                        {isAdmin && <span className="admin-badge">Admin Access</span>}
                        <h2>{title}</h2>
                        <p>{subtitle}</p>
                    </div>
                    
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
